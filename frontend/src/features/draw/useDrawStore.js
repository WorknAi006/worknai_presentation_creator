import { useSyncExternalStore } from "react";
import { DEFAULT_PEN_PRESETS } from "./drawTools";

// Isolated store for the Draw feature, kept fully separate from the
// existing PresentationEditor state and from HistoryManager (which only
// snapshots Fabric canvas JSON). Mirrors the plain-class + subscriber shape
// already used by frontend/src/editor/history/HistoryManager.js.
class DrawStore {
  constructor() {
    this.state = {
      strokesBySlide: {},
      activeTool: "pen",
      activeColor: DEFAULT_PEN_PRESETS[0].color,
      activeThickness: DEFAULT_PEN_PRESETS[0].thickness,
      penPresets: DEFAULT_PEN_PRESETS,
      undoStack: [],
      redoStack: [],
      rulerVisible: false,
      inkToShapeEnabled: false,
      selectedStrokeId: null,
    };
    this.listeners = new Set();
  }

  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  setState(patch) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  getStrokes(slideId) {
    return this.state.strokesBySlide[slideId] || [];
  }

  // Hydrates strokes for a slide from persisted presentation data without
  // touching the undo/redo stacks (used when the active slide changes).
  loadSlideStrokes(slideId, strokes) {
    if (this.state.strokesBySlide[slideId] === strokes) return;
    this.setState({
      strokesBySlide: {
        ...this.state.strokesBySlide,
        [slideId]: strokes || [],
      },
    });
  }

  addStroke(slideId, stroke) {
    const strokes = [...this.getStrokes(slideId), stroke];
    this.setState({
      strokesBySlide: { ...this.state.strokesBySlide, [slideId]: strokes },
      undoStack: [...this.state.undoStack, { type: "add", slideId, stroke }],
      redoStack: [],
    });
  }

  removeStroke(slideId, strokeId) {
    const existing = this.getStrokes(slideId);
    const stroke = existing.find((s) => s.id === strokeId);
    if (!stroke) return;
    this.setState({
      strokesBySlide: {
        ...this.state.strokesBySlide,
        [slideId]: existing.filter((s) => s.id !== strokeId),
      },
      undoStack: [...this.state.undoStack, { type: "remove", slideId, stroke }],
      redoStack: [],
      selectedStrokeId:
        this.state.selectedStrokeId === strokeId ? null : this.state.selectedStrokeId,
    });
  }

  undo() {
    const stack = this.state.undoStack;
    if (!stack.length) return;
    const action = stack[stack.length - 1];
    const existing = this.getStrokes(action.slideId);
    const strokes =
      action.type === "add"
        ? existing.filter((s) => s.id !== action.stroke.id)
        : [...existing, action.stroke];

    this.setState({
      strokesBySlide: { ...this.state.strokesBySlide, [action.slideId]: strokes },
      undoStack: stack.slice(0, -1),
      redoStack: [...this.state.redoStack, action],
    });
  }

  redo() {
    const stack = this.state.redoStack;
    if (!stack.length) return;
    const action = stack[stack.length - 1];
    const existing = this.getStrokes(action.slideId);
    const strokes =
      action.type === "add"
        ? [...existing, action.stroke]
        : existing.filter((s) => s.id !== action.stroke.id);

    this.setState({
      strokesBySlide: { ...this.state.strokesBySlide, [action.slideId]: strokes },
      redoStack: stack.slice(0, -1),
      undoStack: [...this.state.undoStack, action],
    });
  }

  setTool(tool) {
    this.setState({ activeTool: tool, selectedStrokeId: null });
  }

  setColor(color) {
    this.setState({ activeColor: color });
  }

  setThickness(thickness) {
    this.setState({ activeThickness: thickness });
  }

  updatePreset(presetId, patch) {
    this.setState({
      penPresets: this.state.penPresets.map((p) =>
        p.id === presetId ? { ...p, ...patch } : p
      ),
    });
  }

  toggleRuler() {
    this.setState({ rulerVisible: !this.state.rulerVisible });
  }

  toggleInkToShape() {
    this.setState({ inkToShapeEnabled: !this.state.inkToShapeEnabled });
  }

  selectStroke(strokeId) {
    this.setState({ selectedStrokeId: strokeId });
  }

  moveStroke(slideId, strokeId, dxNorm, dyNorm) {
    const existing = this.getStrokes(slideId);
    const strokes = existing.map((s) =>
      s.id === strokeId
        ? { ...s, points: s.points.map((p) => ({ ...p, x: p.x + dxNorm, y: p.y + dyNorm })) }
        : s
    );
    this.setState({ strokesBySlide: { ...this.state.strokesBySlide, [slideId]: strokes } });
  }
}

export const drawStore = new DrawStore();

export function useDrawStore(selector = (state) => state) {
  return useSyncExternalStore(drawStore.subscribe, () => selector(drawStore.getState()));
}
