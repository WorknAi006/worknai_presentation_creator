import { useEffect, useRef, useState } from "react";

const RULER_SIZE = 18;
const TICK_GAP = 50;

/**
 * On-canvas ruler guide: a top + left ruler bar matched to the slide box,
 * toggled by the Draw toolbar's Ruler button. Purely visual, no pointer
 * interaction, so it never affects existing slide editing.
 */
function DrawRuler({ visible, matchSelector }) {
  const rootRef = useRef(null);
  const [dims, setDims] = useState({ width: 0, height: 0, left: 0, top: 0 });

  useEffect(() => {
    if (!visible) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const measure = () => {
      const parent = root.parentElement;
      const host = matchSelector ? parent?.querySelector(matchSelector) : parent;
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
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root.parentElement || root);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [visible, matchSelector]);

  // Always render the ref-bearing wrapper while visible, even before the
  // first measurement lands - otherwise rootRef never attaches and the
  // measurement effect above has nothing to measure from.
  if (!visible) return null;

  const ready = dims.width > 0 && dims.height > 0;
  const hTicks = ready ? Math.floor(dims.width / TICK_GAP) : 0;
  const vTicks = ready ? Math.floor(dims.height / TICK_GAP) : 0;

  return (
    <div
      ref={rootRef}
      className="draw-ruler-root"
      style={{
        position: "absolute",
        left: dims.left,
        top: dims.top,
        width: dims.width,
        height: dims.height,
        pointerEvents: "none",
        zIndex: 4,
        visibility: ready ? "visible" : "hidden",
      }}
    >
      <div className="draw-ruler-h" style={{ height: RULER_SIZE }}>
        {Array.from({ length: hTicks + 1 }).map((_, i) => (
          <span key={i} className="draw-ruler-tick" style={{ left: i * TICK_GAP }}>
            {i * TICK_GAP}
          </span>
        ))}
      </div>
      <div className="draw-ruler-v" style={{ width: RULER_SIZE }}>
        {Array.from({ length: vTicks + 1 }).map((_, i) => (
          <span key={i} className="draw-ruler-tick-v" style={{ top: i * TICK_GAP }}>
            {i * TICK_GAP}
          </span>
        ))}
      </div>
      <div className="draw-ruler-guide-h" />
      <div className="draw-ruler-guide-v" />
    </div>
  );
}

export default DrawRuler;
