import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { generateId } from "../../utils/generateId";
import { renderStrokes, hitTestStrokes } from "./drawTools";
import { drawStore, useDrawStore } from "./useDrawStore";

const ERASER_HIT_RADIUS = 0.015;

/**
 * Absolutely-positioned ink overlay, rendered as a sibling AFTER the existing
 * slide content (EditorCanvas in the editor, the Fabric canvas in Present
 * mode). Reads its size/position from the sibling slide box rather than
 * recomputing slide dimensions itself.
 *
 * - `matchSelector`: CSS selector (scoped to this component's parent) of the
 *   sibling box to match pixel-for-pixel (editor mode, no CSS transforms).
 *   When omitted, the overlay simply fills its parent via inset:0, which is
 *   what Present mode needs since it sits inside the same transformed
 *   ancestor as the slide (e.g. Presenter View's scale(0.65)).
 */
function DrawCanvas({
  slideId,
  active = false,
  readOnly = false,
  matchSelector = null,
  initialStrokes,
  onStrokesChange,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [dims, setDims] = useState({ width: 0, height: 0, left: 0, top: 0 });

  const drawingRef = useRef(null);
  const erasingRef = useRef(false);
  const draggingRef = useRef(null);

  const strokesBySlide = useDrawStore((s) => s.strokesBySlide);
  const activeTool = useDrawStore((s) => s.activeTool);
  const activeColor = useDrawStore((s) => s.activeColor);
  const activeThickness = useDrawStore((s) => s.activeThickness);
  const selectedStrokeId = useDrawStore((s) => s.selectedStrokeId);

  const strokes = useMemo(
    () => strokesBySlide[slideId] || [],
    [strokesBySlide, slideId]
  );

  useEffect(() => {
    if (slideId) drawStore.loadSlideStrokes(slideId, initialStrokes);
    // Only re-hydrate when the active slide changes, not on every strokes edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideId]);

  const lastReportedRef = useRef(strokes);
  useEffect(() => {
    if (readOnly || !onStrokesChange) return;
    if (lastReportedRef.current === strokes) return;
    lastReportedRef.current = strokes;
    onStrokesChange(slideId, strokes);
  }, [strokes, slideId, readOnly, onStrokesChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      if (matchSelector) {
        const parent = root.parentElement;
        const host = parent?.querySelector(matchSelector);
        const offsetParent = root.offsetParent;
        if (!host || !offsetParent) return;
        const hostRect = host.getBoundingClientRect();
        const parentRect = offsetParent.getBoundingClientRect();
        setDims({
          width: hostRect.width,
          height: hostRect.height,
          left: hostRect.left - parentRect.left,
          top: hostRect.top - parentRect.top,
        });
      } else {
        const parent = root.parentElement;
        if (!parent) return;
        setDims((prev) =>
          prev.width === parent.offsetWidth && prev.height === parent.offsetHeight
            ? prev
            : { width: parent.offsetWidth, height: parent.offsetHeight, left: 0, top: 0 }
        );
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(root.parentElement || root);
    if (matchSelector) {
      const host = root.parentElement?.querySelector(matchSelector);
      if (host) ro.observe(host);
    }
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [matchSelector]);

  const repaint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dims.width || !dims.height) return;
    const ctx = canvas.getContext("2d");
    const live = drawingRef.current ? [...strokes, drawingRef.current] : strokes;
    renderStrokes(ctx, live, dims.width, dims.height);

    if (selectedStrokeId) {
      const selected = strokes.find((s) => s.id === selectedStrokeId);
      if (selected) {
        const xs = selected.points.map((p) => p.x * dims.width);
        const ys = selected.points.map((p) => p.y * dims.height);
        const pad = 6;
        const minX = Math.min(...xs) - pad;
        const minY = Math.min(...ys) - pad;
        const maxX = Math.max(...xs) + pad;
        const maxY = Math.max(...ys) + pad;
        ctx.save();
        ctx.strokeStyle = "#2684ff";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
        ctx.restore();
      }
    }
  }, [strokes, dims, selectedStrokeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dims.width || !dims.height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dims.width * dpr;
    canvas.height = dims.height * dpr;
    canvas.style.width = `${dims.width}px`;
    canvas.style.height = `${dims.height}px`;
    canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    repaint();
    // repaint is intentionally re-run below whenever strokes/selection change too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.width, dims.height]);

  useEffect(() => {
    repaint();
  }, [repaint]);

  const toNormalizedPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
      pressure: event.pressure > 0 ? event.pressure : 0.5,
      t: event.timeStamp,
    };
  };

  const handlePointerDown = (event) => {
    if (!active || readOnly) return;
    canvasRef.current?.setPointerCapture?.(event.pointerId);
    const point = toNormalizedPoint(event);

    if (activeTool === "eraser") {
      erasingRef.current = true;
      const hitId = hitTestStrokes(strokes, point.x, point.y, ERASER_HIT_RADIUS);
      if (hitId) drawStore.removeStroke(slideId, hitId);
      return;
    }

    if (activeTool === "select") {
      const hitId = hitTestStrokes(strokes, point.x, point.y, ERASER_HIT_RADIUS);
      drawStore.selectStroke(hitId);
      if (hitId) draggingRef.current = { strokeId: hitId, x: point.x, y: point.y };
      return;
    }

    drawingRef.current = {
      id: generateId(),
      tool: activeTool,
      color: activeColor,
      thickness: activeThickness,
      slideId,
      points: [point],
    };
    repaint();
  };

  const handlePointerMove = (event) => {
    if (!active || readOnly) return;

    if (erasingRef.current) {
      const point = toNormalizedPoint(event);
      const hitId = hitTestStrokes(strokes, point.x, point.y, ERASER_HIT_RADIUS);
      if (hitId) drawStore.removeStroke(slideId, hitId);
      return;
    }

    if (draggingRef.current) {
      const point = toNormalizedPoint(event);
      const { strokeId, x, y } = draggingRef.current;
      drawStore.moveStroke(slideId, strokeId, point.x - x, point.y - y);
      draggingRef.current = { strokeId, x: point.x, y: point.y };
      return;
    }

    if (!drawingRef.current) return;
    drawingRef.current.points.push(toNormalizedPoint(event));
    repaint();
  };

  const handlePointerUp = () => {
    erasingRef.current = false;
    draggingRef.current = null;
    if (drawingRef.current) {
      const stroke = drawingRef.current;
      drawingRef.current = null;
      if (stroke.points.length > 0) drawStore.addStroke(slideId, stroke);
    }
  };

  const interactive = active && !readOnly;

  const wrapperStyle = matchSelector
    ? {
        position: "absolute",
        left: dims.left,
        top: dims.top,
        width: dims.width,
        height: dims.height,
        pointerEvents: interactive ? "auto" : "none",
        touchAction: "none",
        zIndex: 5,
      }
    : {
        position: "absolute",
        inset: 0,
        pointerEvents: interactive ? "auto" : "none",
        touchAction: "none",
        zIndex: 5,
      };

  const cursor =
    activeTool === "eraser" ? "cell" : activeTool === "select" ? "default" : "crosshair";

  return (
    <div ref={rootRef} className="draw-canvas-root" style={wrapperStyle}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", cursor }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
}

export default DrawCanvas;
