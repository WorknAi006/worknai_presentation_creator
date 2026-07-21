// Tool presets + per-tool stroke rendering, matching PowerPoint's Draw tab defaults.

export const INK_TOOLS = [
  "pen",
  "highlighter",
  "fountain",
  "brush",
  "pencil",
  "text-pen",
];

export const DEFAULT_PEN_PRESETS = [
  { id: "pen-black", label: "Pen", tool: "pen", color: "#0f0f0f", thickness: 2 },
  { id: "pen-red", label: "Pen", tool: "pen", color: "#e0342b", thickness: 2 },
  { id: "highlighter-gray", label: "Highlighter", tool: "highlighter", color: "#9aa0a6", thickness: 16 },
  { id: "pen-yellow", label: "Pen", tool: "pen", color: "#f4c20d", thickness: 2 },
  { id: "pen-blue", label: "Pen", tool: "pen", color: "#3a6bc9", thickness: 2 },
  { id: "pen-green", label: "Pen", tool: "pen", color: "#2e8b57", thickness: 2 },
  { id: "pen-lightgreen", label: "Pen", tool: "pen", color: "#8bc34a", thickness: 2 },
];

export const ADD_TOOL_MENU = [
  { tool: "pen", label: "Pen", disabled: false },
  { tool: "highlighter", label: "Highlighter", disabled: false },
  { tool: "fountain", label: "Fountain Pen", disabled: false },
  { tool: "brush", label: "Brush Pen", disabled: false },
  { tool: "pencil", label: "Pencil", disabled: false },
  { tool: "text-pen", label: "Text Pen", disabled: true },
];

export const TOOL_BASE_OPACITY = {
  pen: 1,
  highlighter: 0.4,
  fountain: 1,
  brush: 0.85,
  pencil: 0.85,
};

function toPixelPoints(stroke, width, height) {
  return stroke.points.map((p) => ({
    x: p.x * width,
    y: p.y * height,
    pressure: p.pressure ?? 0.5,
    t: p.t,
  }));
}

function strokePath(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawPen(ctx, points, stroke) {
  ctx.globalAlpha = TOOL_BASE_OPACITY.pen;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.thickness;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  strokePath(ctx, points);
}

function drawHighlighter(ctx, points, stroke) {
  ctx.globalAlpha = TOOL_BASE_OPACITY.highlighter;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.thickness;
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  strokePath(ctx, points);
}

// Thicker on slow strokes, thinner on fast ones - draw as a series of
// variable-width segments rather than a single fixed-width path.
function drawFountain(ctx, points, stroke) {
  ctx.globalAlpha = TOOL_BASE_OPACITY.fountain;
  ctx.strokeStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    const dt = Math.max(1, (curr.t ?? 0) - (prev.t ?? 0));
    const speed = dist / dt; // px/ms
    const speedFactor = Math.max(0.35, 1 - Math.min(speed * 4, 0.75));
    const pressureFactor = 0.6 + (curr.pressure ?? 0.5) * 0.8;
    ctx.lineWidth = stroke.thickness * speedFactor * pressureFactor;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();
  }
}

function drawBrush(ctx, points, stroke) {
  ctx.strokeStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = stroke.color;
  ctx.shadowBlur = stroke.thickness * 0.6;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const pressureFactor = 0.7 + (curr.pressure ?? 0.5) * 0.6;
    ctx.globalAlpha = TOOL_BASE_OPACITY.brush * (0.8 + pressureFactor * 0.2);
    ctx.lineWidth = stroke.thickness * pressureFactor;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

// Fake graphite texture with a few low-alpha jittered passes.
function drawPencil(ctx, points, stroke) {
  ctx.strokeStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, stroke.thickness * 0.7);

  const passes = 3;
  for (let pass = 0; pass < passes; pass++) {
    ctx.globalAlpha = (TOOL_BASE_OPACITY.pencil / passes) * (0.6 + Math.random() * 0.4);
    ctx.beginPath();
    const seed = pass * 7.13;
    points.forEach((p, i) => {
      const jitter = Math.sin(i * 12.9898 + seed) * 0.35;
      const px = p.x + jitter;
      const py = p.y + jitter;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }
}

const RENDERERS = {
  pen: drawPen,
  highlighter: drawHighlighter,
  fountain: drawFountain,
  brush: drawBrush,
  pencil: drawPencil,
};

/** Draws a single stroke (normalized points) onto a canvas 2D context sized width x height. */
export function renderStroke(ctx, stroke, width, height) {
  if (!stroke.points || stroke.points.length === 0) return;

  const points = toPixelPoints(stroke, width, height);
  const renderer = RENDERERS[stroke.tool] || drawPen;

  ctx.save();
  if (points.length === 1) {
    // Single point (a tap/dot) - draw a small filled circle so it's visible.
    ctx.globalAlpha = TOOL_BASE_OPACITY[stroke.tool] ?? 1;
    ctx.fillStyle = stroke.color;
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, stroke.thickness / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    renderer(ctx, points, stroke);
  }
  ctx.restore();
}

/**
 * Renders every stroke for a slide onto the given context.
 * Highlighter strokes are painted first so they sit behind ink drawn with
 * every other tool, matching PowerPoint's layering of highlighter marks.
 */
export function renderStrokes(ctx, strokes, width, height) {
  ctx.clearRect(0, 0, width, height);
  const ordered = [
    ...strokes.filter((s) => s.tool === "highlighter"),
    ...strokes.filter((s) => s.tool !== "highlighter"),
  ];
  ordered.forEach((stroke) => renderStroke(ctx, stroke, width, height));
}

/** Distance in normalized units from point p to the nearest segment of a stroke. */
function distanceToStroke(stroke, x, y) {
  let min = Infinity;
  const pts = stroke.points;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - x, pts[i].y - y);
    if (d < min) min = d;
  }
  return min;
}

/** Returns the id of the topmost stroke whose path passes within `radius` (normalized) of (x, y). */
export function hitTestStrokes(strokes, x, y, radius = 0.02) {
  for (let i = strokes.length - 1; i >= 0; i--) {
    if (distanceToStroke(strokes[i], x, y) <= radius) {
      return strokes[i].id;
    }
  }
  return null;
}
