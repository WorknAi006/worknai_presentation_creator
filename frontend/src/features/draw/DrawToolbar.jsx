import { useState } from "react";

import { ADD_TOOL_MENU } from "./drawTools";
import { drawStore, useDrawStore } from "./useDrawStore";
import "./draw.css";

const NEW_TOOL_DEFAULTS = {
  pen: { color: "#0f0f0f", thickness: 2, label: "Pen" },
  highlighter: { color: "#f4c20d", thickness: 16, label: "Highlighter" },
  fountain: { color: "#1a1a1a", thickness: 3, label: "Fountain Pen" },
  brush: { color: "#3a6bc9", thickness: 10, label: "Brush Pen" },
  pencil: { color: "#4b4b4b", thickness: 3, label: "Pencil" },
};

function DrawToolbar() {
  const activeTool = useDrawStore((s) => s.activeTool);
  const activeColor = useDrawStore((s) => s.activeColor);
  const penPresets = useDrawStore((s) => s.penPresets);
  const rulerVisible = useDrawStore((s) => s.rulerVisible);
  const inkToShapeEnabled = useDrawStore((s) => s.inkToShapeEnabled);
  const undoStack = useDrawStore((s) => s.undoStack);
  const redoStack = useDrawStore((s) => s.redoStack);

  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const selectPreset = (preset) => {
    drawStore.setTool(preset.tool);
    drawStore.setColor(preset.color);
    drawStore.setThickness(preset.thickness);
  };

  const handleAddTool = (toolId) => {
    const defaults = NEW_TOOL_DEFAULTS[toolId] || NEW_TOOL_DEFAULTS.pen;
    const preset = {
      id: `${toolId}-${Date.now()}`,
      label: defaults.label,
      tool: toolId,
      color: defaults.color,
      thickness: defaults.thickness,
    };
    drawStore.setState({ penPresets: [...drawStore.getState().penPresets, preset] });
    selectPreset(preset);
    setShowAddMenu(false);
  };

  return (
    <div className="draw-ribbon">
      <RibbonGroup label="Undo">
        <RibbonButton
          icon="↶"
          label="Undo"
          onClick={() => drawStore.undo()}
          disabled={undoStack.length === 0}
        />
        <RibbonButton
          icon="↷"
          label="Redo"
          onClick={() => drawStore.redo()}
          disabled={redoStack.length === 0}
        />
      </RibbonGroup>

      <RibbonGroup label="Tools">
        <RibbonButton
          icon="⇖"
          label="Select"
          active={activeTool === "select"}
          onClick={() => drawStore.setTool("select")}
        />
        <RibbonButton
          icon="⌫"
          label="Eraser"
          active={activeTool === "eraser"}
          onClick={() => drawStore.setTool("eraser")}
        />
      </RibbonGroup>

      <RibbonGroup label="Pens">
        <div className="draw-swatch-row">
          {penPresets.map((preset) => (
            <PenSwatch
              key={preset.id}
              preset={preset}
              active={activeTool === preset.tool && activeColor === preset.color}
              open={openPopoverId === preset.id}
              onSelect={() => selectPreset(preset)}
              onTogglePopover={() =>
                setOpenPopoverId((current) => (current === preset.id ? null : preset.id))
              }
              onChange={(patch) => {
                drawStore.updatePreset(preset.id, patch);
                if (activeTool === preset.tool && activeColor === preset.color) {
                  if (patch.color !== undefined) drawStore.setColor(patch.color);
                  if (patch.thickness !== undefined) drawStore.setThickness(patch.thickness);
                }
              }}
            />
          ))}

          <div className="ribbon-dropdown-wrapper">
            <button
              type="button"
              className="draw-add-button"
              title="Add a pen"
              onClick={() => setShowAddMenu((current) => !current)}
            >
              +
            </button>

            {showAddMenu && (
              <div className="draw-add-menu">
                {ADD_TOOL_MENU.map((item) => (
                  <button
                    key={item.tool}
                    type="button"
                    className="draw-add-menu-item"
                    disabled={item.disabled}
                    onClick={() => handleAddTool(item.tool)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup label="Guides">
        <RibbonButton
          icon="📐"
          label="Ruler"
          active={rulerVisible}
          onClick={() => drawStore.toggleRuler()}
        />
      </RibbonGroup>

      <RibbonGroup label="Convert">
        <RibbonButton
          icon="◇"
          label="Ink to Shape"
          active={inkToShapeEnabled}
          onClick={() => drawStore.toggleInkToShape()}
        />
      </RibbonGroup>
    </div>
  );
}

function PenSwatch({ preset, active, open, onSelect, onTogglePopover, onChange }) {
  return (
    <div className={`draw-swatch-wrapper${active ? " active" : ""}`}>
      <button type="button" className="draw-swatch" onClick={onSelect} title={preset.label}>
        <span
          className="draw-swatch-nib"
          style={{
            background: preset.color,
            opacity: preset.tool === "highlighter" ? 0.55 : 1,
            height: Math.min(22, 4 + preset.thickness),
          }}
        />
        <span className="draw-swatch-label">{preset.label}</span>
      </button>

      <button
        type="button"
        className="draw-swatch-caret"
        onClick={onTogglePopover}
        title="Customize pen"
      >
        ▾
      </button>

      {open && (
        <div className="draw-swatch-popover">
          <label className="draw-popover-row">
            Color
            <input
              type="color"
              value={preset.color}
              onChange={(event) => onChange({ color: event.target.value })}
            />
          </label>
          <label className="draw-popover-row">
            Thickness
            <input
              type="range"
              min="1"
              max={preset.tool === "highlighter" ? 30 : 20}
              value={preset.thickness}
              onChange={(event) => onChange({ thickness: Number(event.target.value) })}
            />
          </label>
        </div>
      )}
    </div>
  );
}

function RibbonGroup({ label, children }) {
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-content">{children}</div>
      <div className="ribbon-group-label">{label}</div>
    </div>
  );
}

function RibbonButton({ icon, label, onClick, active = false, disabled = false }) {
  return (
    <button
      type="button"
      className={`ribbon-button${active ? " active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="ribbon-button-icon">{icon}</span>
      <span className="ribbon-button-label">{label}</span>
    </button>
  );
}

export default DrawToolbar;
