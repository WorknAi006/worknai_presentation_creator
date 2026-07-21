/**
 * @typedef {"pen"|"highlighter"|"fountain"|"brush"|"pencil"} InkToolType
 * @typedef {"select"|"eraser"} PointerToolType
 * @typedef {InkToolType|PointerToolType} ToolId
 *
 * @typedef {Object} StrokePoint
 * @property {number} x - normalized 0..1, relative to slide width
 * @property {number} y - normalized 0..1, relative to slide height
 * @property {number} pressure - 0..1 (defaults to 0.5 when unavailable)
 * @property {number} t - timestamp (ms)
 *
 * @typedef {Object} Stroke
 * @property {string} id
 * @property {InkToolType} tool
 * @property {string} color
 * @property {number} thickness
 * @property {StrokePoint[]} points
 * @property {string} slideId
 *
 * @typedef {Object} PenPreset
 * @property {string} id
 * @property {string} label
 * @property {InkToolType} tool
 * @property {string} color
 * @property {number} thickness
 *
 * @typedef {Object} UndoAction
 * @property {"add"|"remove"} type
 * @property {string} slideId
 * @property {Stroke} stroke
 *
 * @typedef {Object} DrawState
 * @property {Object.<string, Stroke[]>} strokesBySlide
 * @property {ToolId} activeTool
 * @property {string} activeColor
 * @property {number} activeThickness
 * @property {UndoAction[]} undoStack
 * @property {UndoAction[]} redoStack
 * @property {boolean} rulerVisible
 * @property {boolean} inkToShapeEnabled
 * @property {string|null} selectedStrokeId
 */

export {};
