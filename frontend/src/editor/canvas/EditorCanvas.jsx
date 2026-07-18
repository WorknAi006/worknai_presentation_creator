import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Canvas,
  Textbox,
  Rect,
  Circle,
  Triangle,
  Line,
  FabricImage,
  Group,
  ActiveSelection,
} from "fabric";

import HistoryManager from "../history/HistoryManager";

import { themeDefinitions } from "../design/themeDefinitions";
const EditorCanvas = forwardRef(function EditorCanvas(
  {
    onSelectionChange,
    onHistoryChange,
  },
  ref
) {
  const canvasElementRef = useRef(null);

  const fabricCanvasRef = useRef(null);

  const zoomRef = useRef(1);

  const guideLinesRef = useRef([]);

  const SNAP_DISTANCE = 6;

  const selectionCallbackRef = useRef(
    onSelectionChange
  );

  const historyCallbackRef = useRef(
    onHistoryChange
  );

  const historyManagerRef = useRef(
    new HistoryManager(100)
  );

  const isRestoringHistoryRef =
    useRef(false);

    const clipboardRef =
  useRef(null);

  useEffect(() => {
    selectionCallbackRef.current =
      onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    historyCallbackRef.current =
      onHistoryChange;
  }, [onHistoryChange]);

  const configureObjectControls = (object) => {
  if (!object) {
    return;
  }

  object.set({
    selectable: true,

    evented: true,

    hasControls: true,

    hasBorders: true,

    lockRotation: false,

    centeredRotation: true,

    transparentCorners: false,

    cornerStyle: "circle",

    cornerSize: 10,

    borderScaleFactor: 1.5,

    padding: 2,
  });

  object.setControlsVisibility({
    mtr: true,
  });

  object.setCoords();
};
const sendSelectionData = (object) => {
  if (!object) {
    selectionCallbackRef.current?.(
      null
    );

    return;
  }

  const isMultipleSelection =
   String(object.type)
    .toLowerCase() ===
    "activeselection";

  if (isMultipleSelection) {
    const selectedObjects =
      object.getObjects();

    const objectData = {
      type: "activeselection",

      selectionType: "multiple",

      selectedCount:
        selectedObjects.length,

      x: Math.round(
        object.left ?? 0
      ),

      y: Math.round(
        object.top ?? 0
      ),

      width: Math.round(
        object.getScaledWidth()
      ),

      height: Math.round(
        object.getScaledHeight()
      ),

      rotation: Math.round(
        object.angle ?? 0
      ),

      fill: null,

      stroke: null,

      strokeWidth: null,

      opacity: null,

      fontSize: null,

      fontFamily: null,

      fontWeight: null,

      fontStyle: null,

      underline: null,

      linethrough: null,

      textAlign: null,

      charSpacing: null,

      lineHeight: null,
    };

    selectionCallbackRef.current?.(
      objectData
    );

    return;
  }

  const objectData = {
    id: object.id || (object.id = `obj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
    animations: object.animations || [],
    type:
      object.customType ||
      object.type,

    selectionType: "single",

    selectedCount: 1,

    x: Math.round(
      object.left ?? 0
    ),

    y: Math.round(
      object.top ?? 0
    ),

    width: Math.round(
      object.getScaledWidth()
    ),

    height: Math.round(
      object.getScaledHeight()
    ),

    rotation: Math.round(
      object.angle ?? 0
    ),

    fill:
      typeof object.fill === "string"
        ? object.fill
        : "#000000",

    stroke:
      typeof object.stroke === "string"
        ? object.stroke
        : "#000000",

    strokeWidth: Number(
      object.strokeWidth ?? 0
    ),

    opacity: Number(
      object.opacity ?? 1
    ),

    fontSize:
      object.type === "textbox"
        ? Number(
            object.fontSize ?? 32
          )
        : null,

    fontFamily:
      object.type === "textbox"
        ? object.fontFamily || "Arial"
        : null,

    fontWeight:
      object.type === "textbox"
        ? object.fontWeight || "normal"
        : null,

    fontStyle:
      object.type === "textbox"
        ? object.fontStyle || "normal"
        : null,

    underline:
      object.type === "textbox"
        ? Boolean(object.underline)
        : null,

    linethrough:
      object.type === "textbox"
        ? Boolean(object.linethrough)
        : null,

    textAlign:
      object.type === "textbox"
        ? object.textAlign || "left"
        : null,

    charSpacing:
      object.type === "textbox"
        ? Number(
            object.charSpacing ?? 0
          )
        : null,

    lineHeight:
      object.type === "textbox"
        ? Number(
            object.lineHeight ?? 1.16
          )
        : null,
  };
  selectionCallbackRef.current?.(
    objectData
  );
};

const clearGuideLines = () => {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  guideLinesRef.current.forEach(
    (line) => {
      canvas.remove(line);
    }
  );

  guideLinesRef.current = [];
};

const drawGuideLine = (
  x1,
  y1,
  x2,
  y2
) => {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const line = new Line(
    [x1, y1, x2, y2],
    {
      stroke: "#ff1493",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
    }
  );

  guideLinesRef.current.push(line);

  canvas.add(line);

  canvas.sendObjectToBack(line);
};

const notifyHistoryState = () => {
 
    const history =
      historyManagerRef.current;

    historyCallbackRef.current?.(
      history.getState()
    );
  };

  const createSnapshot = () => {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return null;
    }

    const canvasJSON = canvas.toJSON([
      "customType",
      "id",
      "animations",
    ]);

    return JSON.stringify(canvasJSON);
  };

  const saveHistory = () => {
    if (
      isRestoringHistoryRef.current
    ) {
      return;
    }

    const snapshot = createSnapshot();

    if (!snapshot) {
      return;
    }

    historyManagerRef.current.push(
      snapshot
    );

    notifyHistoryState();
  };

  const restoreSnapshot = async (
    snapshot
  ) => {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas || !snapshot) {
      return;
    }

    isRestoringHistoryRef.current = true;

    try {
      canvas.discardActiveObject();

      selectionCallbackRef.current?.(null);

      const canvasJSON =
        JSON.parse(snapshot);

      await canvas.loadFromJSON(
        canvasJSON
      );

      canvas.getObjects().forEach(
         (object) => {
            configureObjectControls(object);
            if (!object.id) {
              object.id = `obj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            }
            if (!object.animations) {
              object.animations = [];
            }
        }
     );


      canvas.requestRenderAll();
    } catch (error) {
      console.error(
        "History restore failed:",
        error
      );
    } finally {
      isRestoringHistoryRef.current = false;
    }
  };

  const undoHistory = async () => {
    const snapshot =
      historyManagerRef.current.undo();

    if (!snapshot) {
      return;
    }

    await restoreSnapshot(snapshot);

    notifyHistoryState();
  };

  const redoHistory = async () => {
    const snapshot =
      historyManagerRef.current.redo();

    if (!snapshot) {
      return;
    }

    await restoreSnapshot(snapshot);

    notifyHistoryState();
  };

  const copyActiveObject = async () => {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  try {
    clipboardRef.current =
      await activeObject.clone([
        "customType",
      ]);
  } catch (error) {
    console.error(
      "Copy object failed:",
      error
    );
  }
};

const pasteClipboardObject =
  async () => {
    const canvas =
      fabricCanvasRef.current;

    const clipboard =
      clipboardRef.current;

    if (!canvas || !clipboard) {
      return;
    }

    try {
      const clonedObject =
        await clipboard.clone([
          "customType",
        ]);

      canvas.discardActiveObject();

      clonedObject.set({
        left:
          Number(
            clonedObject.left ?? 0
          ) + 20,

        top:
          Number(
            clonedObject.top ?? 0
          ) + 20,
      });

      configureObjectControls(
        clonedObject
      );

      canvas.add(clonedObject);

      canvas.setActiveObject(
        clonedObject
      );

      clipboardRef.current =
        await clonedObject.clone([
          "customType",
        ]);

      canvas.requestRenderAll();

      sendSelectionData(
        clonedObject
      );

      saveHistory();
    } catch (error) {
      console.error(
        "Paste object failed:",
        error
      );
    }
  };

const cutActiveObject = async () => {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  try {
    clipboardRef.current =
      await activeObject.clone([
        "customType",
      ]);

    canvas.discardActiveObject();

    canvas.remove(activeObject);

    selectionCallbackRef.current?.(
      null
    );

    canvas.requestRenderAll();

    saveHistory();
  } catch (error) {
    console.error(
      "Cut object failed:",
      error
    );
  }
};

const duplicateActiveObject =
  async () => {
    const canvas =
      fabricCanvasRef.current;

    if (!canvas) {
      return;
    }

    const activeObject =
      canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    try {
      const clonedObject =
        await activeObject.clone([
          "customType",
        ]);

      canvas.discardActiveObject();

      clonedObject.set({
        left:
          Number(
            activeObject.left ?? 0
          ) + 20,

        top:
          Number(
            activeObject.top ?? 0
          ) + 20,
      });

      configureObjectControls(
        clonedObject
      );

      canvas.add(clonedObject);

      canvas.setActiveObject(
        clonedObject
      );

      canvas.requestRenderAll();

      sendSelectionData(
        clonedObject
      );

      saveHistory();
    } catch (error) {
      console.error(
        "Duplicate object failed:",
        error
      );
    }
  };

  useEffect(() => {
    const fabricCanvas = new Canvas(
  canvasElementRef.current,
  {
    width: 960,
    height: 540,

    backgroundColor: "#ffffff",

    selection: true,

    preserveObjectStacking: true,

    selectionKey: "ctrlKey",

    altSelectionKey: "altKey",
  }
);

    fabricCanvasRef.current =
      fabricCanvas;

    const updateSelection = () => {
      const activeObject =
        fabricCanvas.getActiveObject();

      sendSelectionData(activeObject);
    };

    const clearSelection = () => {
      selectionCallbackRef.current?.(null);
    };

    const handleObjectModified = () => {
      updateSelection();

      saveHistory();
    };

    fabricCanvas.on(
      "selection:created",
      updateSelection
    );

    fabricCanvas.on(
      "selection:updated",
      updateSelection
    );

    fabricCanvas.on(
      "selection:cleared",
      clearSelection
    );

   fabricCanvas.on(
  "object:moving",
  (event) => {
    const object = event.target;

    if (!object) {
      return;
    }

    clearGuideLines();

    const GRID = 10;

    object.set({
      left:
        Math.round(
          object.left / GRID
        ) * GRID,

      top:
        Math.round(
          object.top / GRID
        ) * GRID,
    });

    object.setCoords();

    const canvasCenterX =
      fabricCanvas.getWidth() / 2;

    const canvasCenterY =
      fabricCanvas.getHeight() / 2;

    const bounds =
      object.getBoundingRect();

    const objectCenterX =
      bounds.left +
      bounds.width / 2;

    const objectCenterY =
      bounds.top +
      bounds.height / 2;

    if (
      Math.abs(
        objectCenterX -
          canvasCenterX
      ) < SNAP_DISTANCE
    ) {
      object.set({
        left:
          canvasCenterX -
          bounds.width / 2,
      });

      drawGuideLine(
        canvasCenterX,
        0,
        canvasCenterX,
        fabricCanvas.getHeight()
      );
    }

    if (
      Math.abs(
        objectCenterY -
          canvasCenterY
      ) < SNAP_DISTANCE
    ) {
      object.set({
        top:
          canvasCenterY -
          bounds.height / 2,
      });

      drawGuideLine(
        0,
        canvasCenterY,
        fabricCanvas.getWidth(),
        canvasCenterY
      );
    }

    object.setCoords();

    updateSelection();

    fabricCanvas.requestRenderAll();
  }
);

fabricCanvas.on(
  "mouse:up",
  () => {
    clearGuideLines();
  }
);

    fabricCanvas.on(
      "object:scaling",
      updateSelection
    );

    fabricCanvas.on(
      "object:rotating",
      updateSelection
    );

    fabricCanvas.on(
      "object:modified",
      handleObjectModified
    );

    fabricCanvas.on(
      "text:changed",
      updateSelection
    );

    const handleTextEditingExited = () => {
      updateSelection();

      saveHistory();
    };

    fabricCanvas.on(
      "text:editing:exited",
      handleTextEditingExited
    );
    const handleKeyDown = async (event) => {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeElement =
    document.activeElement;

  const isInputFocused =
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    activeElement?.tagName === "SELECT";

  if (isInputFocused) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  const isTextEditing =
    activeObject?.type === "textbox" &&
    activeObject?.isEditing;

  if (isTextEditing) {
    return;
  }

  const isControlKey =
    event.ctrlKey ||
    event.metaKey;

  if (!isControlKey) {
    const isDeleteKey =
      event.key === "Delete" ||
      event.key === "Backspace";

    if (
      isDeleteKey &&
      activeObject
    ) {
      event.preventDefault();

      const selectedObjects =
        canvas.getActiveObjects();

      canvas.discardActiveObject();

      selectedObjects.forEach(
        (object) => {
          canvas.remove(object);
        }
      );

      selectionCallbackRef.current?.(
        null
      );

      canvas.requestRenderAll();

      saveHistory();
    }

    return;
  }

  const key =
    event.key.toLowerCase();

  console.log(
    "Keyboard shortcut:",
    key
  );

  // CTRL + C

  if (
    key === "c" &&
    !event.shiftKey
  ) {
    if (!activeObject) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    try {
      const clonedObject =
        await activeObject.clone([
          "customType",
        ]);

      clipboardRef.current =
        clonedObject;

      console.log(
        "Object copied"
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }

    return;
  }

  // CTRL + X

  if (
    key === "x" &&
    !event.shiftKey
  ) {
    if (!activeObject) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    try {
      const clonedObject =
        await activeObject.clone([
          "customType",
        ]);

      clipboardRef.current =
        clonedObject;

      canvas.discardActiveObject();

      canvas.remove(activeObject);

      selectionCallbackRef.current?.(
        null
      );

      canvas.requestRenderAll();

      saveHistory();

      console.log(
        "Object cut"
      );
    } catch (error) {
      console.error(
        "Cut failed:",
        error
      );
    }

    return;
  }

  // CTRL + V

  if (
    key === "v" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    event.stopPropagation();

    const clipboard =
      clipboardRef.current;

    if (!clipboard) {
      console.log(
        "Clipboard is empty"
      );

      return;
    }

    try {
      const clonedObject =
        await clipboard.clone([
          "customType",
        ]);

      canvas.discardActiveObject();

      clonedObject.set({
        left:
          Number(
            clipboard.left ?? 0
          ) + 20,

        top:
          Number(
            clipboard.top ?? 0
          ) + 20,
      });

      configureObjectControls(
        clonedObject
      );

      canvas.add(clonedObject);

      canvas.setActiveObject(
        clonedObject
      );

      canvas.requestRenderAll();

      sendSelectionData(
        clonedObject
      );

      clipboardRef.current =
        await clonedObject.clone([
          "customType",
        ]);

      saveHistory();

      console.log(
        "Object pasted"
      );
    } catch (error) {
      console.error(
        "Paste failed:",
        error
      );
    }

    return;
  }

  // CTRL + D

  if (
    key === "d" &&
    !event.shiftKey
  ) {
    if (!activeObject) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    try {
      const clonedObject =
        await activeObject.clone([
          "customType",
        ]);

      clonedObject.set({
        left:
          Number(
            activeObject.left ?? 0
          ) + 20,

        top:
          Number(
            activeObject.top ?? 0
          ) + 20,
      });

      configureObjectControls(
        clonedObject
      );

      canvas.discardActiveObject();

      canvas.add(clonedObject);

      canvas.setActiveObject(
        clonedObject
      );

      canvas.requestRenderAll();

      sendSelectionData(
        clonedObject
      );

      saveHistory();

      console.log(
        "Object duplicated"
      );
    } catch (error) {
      console.error(
        "Duplicate failed:",
        error
      );
    }

    return;
  }
  // CTRL + SHIFT + ] = BRING TO FRONT

if (
  isControlKey &&
  event.shiftKey &&
  event.key === "]"
) {
  event.preventDefault();
  event.stopPropagation();

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  canvas.bringObjectToFront(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();

  return;
}

// CTRL + ] = BRING FORWARD

if (
  isControlKey &&
  !event.shiftKey &&
  event.key === "]"
) {
  event.preventDefault();
  event.stopPropagation();

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  canvas.bringObjectForward(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();

  return;
}

// CTRL + SHIFT + [ = SEND TO BACK

if (
  isControlKey &&
  event.shiftKey &&
  event.key === "["
) {
  event.preventDefault();
  event.stopPropagation();

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  canvas.sendObjectToBack(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();

  return;
}

// CTRL + [ = SEND BACKWARD

if (
  isControlKey &&
  !event.shiftKey &&
  event.key === "["
) {
  event.preventDefault();
  event.stopPropagation();

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  canvas.sendObjectBackwards(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();

  return;
}
// CTRL + G

if (
  key === "g" &&
  !event.shiftKey
) {
  event.preventDefault();

  const activeObject =
    canvas.getActiveObject();

  if (
    activeObject &&
    activeObject.type ===
      "activeSelection"
  ) {
    activeObject.toGroup();

    canvas.requestRenderAll();

    saveHistory();
  }

  return;
}

// CTRL + SHIFT + G

if (
  key === "g" &&
  event.shiftKey
) {
  event.preventDefault();

  const activeObject =
    canvas.getActiveObject();

  if (
    activeObject &&
   String(activeObject.type).toLowerCase() ===
   "group"
  ) {
    const items = activeObject.removeAll();

canvas.remove(activeObject);

items.forEach((obj) => {
    canvas.add(obj);
});

const selection = new ActiveSelection(items, {
    canvas,
});

canvas.setActiveObject(selection);

    canvas.requestRenderAll();

    saveHistory();
  }

  return;
}

  // CTRL + SHIFT + Z

  if (
    key === "z" &&
    event.shiftKey
  ) {
    event.preventDefault();
    event.stopPropagation();

    await redoHistory();

    return;
  }

  // CTRL + Z

  if (
    key === "z" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    event.stopPropagation();

    await undoHistory();

    return;
  }

  // CTRL + Y

  if (
    key === "y" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    event.stopPropagation();

    await redoHistory();

    return;
  }
};

    window.addEventListener(
      "keydown",
      handleKeyDown,
      true
    );

    fabricCanvas.requestRenderAll();

    const initialSnapshot =
      JSON.stringify(
        fabricCanvas.toJSON([
          "customType",
        ])
      );

    historyManagerRef.current.reset(
      initialSnapshot
    );

    notifyHistoryState();

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
        true
      );

      fabricCanvas.off();

      fabricCanvas.dispose();

      fabricCanvasRef.current = null;
    };
  }, []);

  // =========================================
// Apply PowerPoint Theme
// =========================================
const applyTheme = (themeId) => {
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  console.log("Theme:", themeId);

  const theme = themeDefinitions.find(
  (t) => t.id === themeId
);

if (!theme) return;


 canvas.backgroundColor = theme.colors.bg;

  canvas.getObjects().forEach((obj) => {

    if (
      obj.type === "textbox" ||
      obj.type === "text" ||
      obj.type === "i-text"
    ) {
      obj.set({
        fill: theme.colors.text,
      });
    }

    if (
      obj.type === "rect" ||
      obj.type === "circle" ||
      obj.type === "triangle"
    ) {
      obj.set({
        fill: theme.colors.primary,
      });
    }

    if (obj.type === "line") {
      obj.set({
        stroke: theme.colors.primary,
      });
    }
  });

  canvas.requestRenderAll();

  saveHistory();
};

  useImperativeHandle(
    ref,
    () => ({
      setZoom(value) {
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  const zoom = Math.min(
    4,
    Math.max(0.25, value)
  );

  zoomRef.current = zoom;

  canvas.setZoom(zoom);

  canvas.requestRenderAll();
},
zoomIn() {
  const current =
    zoomRef.current;

  this.setZoom(
    current + 0.1
  );
},
zoomOut() {
  const current =
    zoomRef.current;

  this.setZoom(
    current - 0.1
  );
},
fitToScreen() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) return;

  zoomRef.current = 1;

  canvas.setZoom(1);

  canvas.requestRenderAll();
},
       getCanvasPreview() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return null;
  }

  try {
    return canvas.toDataURL({
      format: "png",

      multiplier: 0.25,

      enableRetinaScaling: false,
    });
  } catch (error) {
    console.error(
      "Canvas preview failed:",
      error
    );

    return null;
  }
}, 
      getCanvasJSON() {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return null;
        }

        return canvas.toJSON([
          "customType",
          "id",
          "animations",
        ]);
      },

      async loadCanvasJSON(canvasJSON) {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        isRestoringHistoryRef.current = true;

        try {
          canvas.discardActiveObject();

          selectionCallbackRef.current?.(
            null
          );

          canvas.clear();

          if (canvasJSON) {
            await canvas.loadFromJSON(
              canvasJSON
            );
          }

          canvas.getObjects().forEach(
            (object) => {
                configureObjectControls(object);
                if (!object.id) {
                  object.id = `obj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                }
                if (!object.animations) {
                  object.animations = [];
                }
            }
        );

          canvas.backgroundColor =
            "#ffffff";

          canvas.requestRenderAll();

          const snapshot =
            JSON.stringify(
              canvas.toJSON([
                "customType",
                "id",
                "animations",
              ])
            );

          historyManagerRef.current.reset(
            snapshot
          );

          notifyHistoryState();
        } catch (error) {
          console.error(
            "Slide load failed:",
            error
          );
        } finally {
          isRestoringHistoryRef.current =
            false;
        }
      },

      clearCanvas() {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        isRestoringHistoryRef.current =
          true;

        try {
          canvas.discardActiveObject();

          canvas.clear();

          canvas.backgroundColor =
            "#ffffff";

          canvas.requestRenderAll();

          selectionCallbackRef.current?.(
            null
          );

          const snapshot =
            JSON.stringify(
              canvas.toJSON([
                "customType",
              ])
            );

          historyManagerRef.current.reset(
            snapshot
          );

          notifyHistoryState();
        } finally {
          isRestoringHistoryRef.current =
            false;
        }
      },

      addText() {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        const text = new Textbox(
          "Click to edit text",
          {
            left: 100,

            top: 100,

            width: 300,

            fontSize: 32,

            fontFamily: "Arial",

            fontWeight: "normal",

            fontStyle: "normal",

            underline: false,

            linethrough: false,

            textAlign: "left",

            charSpacing: 0,

            lineHeight: 1.16,

            fill: "#111827",

            editable: true,

            selectable: true,

            evented: true,

          }
        );

        configureObjectControls(text);

        canvas.add(text);

        canvas.setActiveObject(text);

        canvas.requestRenderAll();

        sendSelectionData(text);

        saveHistory();
      },

      addShape(shapeType) {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        let shape = null;

        if (
          shapeType === "rectangle"
        ) {
          shape = new Rect({
            left: 150,

            top: 150,

            width: 220,

            height: 140,

            fill: "#2563eb",

            rx: 8,

            ry: 8,
          });
        }

        if (shapeType === "circle") {
          shape = new Circle({
            left: 150,

            top: 150,

            radius: 80,

            fill: "#7c3aed",
          });
        }

        if (
          shapeType === "triangle"
        ) {
          shape = new Triangle({
            left: 150,

            top: 150,

            width: 180,

            height: 160,

            fill: "#ea580c",
          });
        }

        if (shapeType === "line") {
          shape = new Line(
            [100, 100, 350, 100],
            {
              stroke: "#111827",

              strokeWidth: 4,

              fill: "#111827",
            }
          );
        }

        if (shapeType === "arrow") {
          shape = new Line(
            [100, 100, 350, 100],
            {
              stroke: "#dc2626",

              strokeWidth: 5,

              fill: "#dc2626",
            }
          );

          shape.set({
            customType: "arrow",
          });
        }

        if (!shape) {
          return;
        }

        configureObjectControls(shape);

        canvas.add(shape);

        canvas.setActiveObject(shape);

        canvas.requestRenderAll();

        sendSelectionData(shape);

        saveHistory();
      },

      updateSelectedObject(
  property,
  value
) {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();
    const selectedObjects =
  canvas.getActiveObjects();

const isMultiple =
  selectedObjects.length > 1;

  if (!activeObject) {
    return;
  }

  const numericValue =
    Number(value);

if (property === "x") {

  if (!Number.isFinite(numericValue)) {
    return;
  }

  if (isMultiple) {

    const delta =
      numericValue -
      Number(activeObject.left ?? 0);

    selectedObjects.forEach((object) => {

      object.set({
        left:
          Number(object.left ?? 0) + delta,
      });

      object.setCoords();

    });

  } else {

    activeObject.set(
      "left",
      numericValue
    );

  }
}



  if (property === "y") {


  if (isMultiple) {

    const delta =
      numericValue -
      Number(activeObject.top ?? 0);

    selectedObjects.forEach((object) => {

      object.set({
        top:
          Number(object.top ?? 0) + delta,
      });

      object.setCoords();

    });

  } else {

    activeObject.set(
      "top",
      numericValue
    );

  }

}

  if (property === "width") {
    if (
      !Number.isFinite(numericValue) ||
      numericValue <= 0
    ) {
      return;
    }

    const baseWidth =
      Number(
        activeObject.width ?? 0
      );

    if (baseWidth <= 0) {
      return;
    }

    activeObject.set(
      "scaleX",
      numericValue / baseWidth
    );
  }

  if (property === "height") {
    if (
      !Number.isFinite(numericValue) ||
      numericValue <= 0
    ) {
      return;
    }

    const baseHeight =
      Number(
        activeObject.height ?? 0
      );

    if (baseHeight <= 0) {
      return;
    }

    activeObject.set(
      "scaleY",
      numericValue / baseHeight
    );
  }

  if (property === "rotation") {
    if (
      !Number.isFinite(numericValue)
    ) {
      return;
    }

    activeObject.set(
      "angle",
      numericValue
    );
  }

  if (
    property === "fill" ||
    property === "stroke"
  ) {
    const nextColor =
      value === null ||
      value === ""
        ? "transparent"
        : value;

    activeObject.set(
      property,
      nextColor
    );
  }

  if (property === "strokeWidth") {
    if (
      !Number.isFinite(numericValue) ||
      numericValue < 0
    ) {
      return;
    }

    activeObject.set(
      "strokeWidth",
      numericValue
    );
  }

  if (property === "opacity") {
    if (
      !Number.isFinite(numericValue)
    ) {
      return;
    }

    const nextOpacity = Math.min(
      1,
      Math.max(
        0,
        numericValue
      )
    );

    activeObject.set(
      "opacity",
      nextOpacity
    );
  }

  if (property === "fontSize") {
    if (
      activeObject.type !== "textbox" ||
      !Number.isFinite(numericValue) ||
      numericValue <= 0
    ) {
      return;
    }

    activeObject.set(
      "fontSize",
      numericValue
    );
  }

  if (property === "fontFamily") {
    if (
      activeObject.type !== "textbox"
    ) {
      return;
    }

    activeObject.set(
      "fontFamily",
      value
    );
  }

  if (property === "fontWeight") {
    if (
      activeObject.type !== "textbox"
    ) {
      return;
    }

    activeObject.set(
      "fontWeight",
      value
    );
  }

  if (property === "fontStyle") {
    if (
      activeObject.type !== "textbox"
    ) {
      return;
    }

    activeObject.set(
      "fontStyle",
      value
    );
  }

  if (property === "underline") {
    if (
      activeObject.type !== "textbox"
    ) {
      return;
    }

    activeObject.set(
      "underline",
      Boolean(value)
    );
  }

  if (property === "linethrough") {
    if (
      activeObject.type !== "textbox"
    ) {
      return;
    }

    activeObject.set(
      "linethrough",
      Boolean(value)
    );
  }

  if (property === "textAlign") {
    if (
      activeObject.type !== "textbox"
    ) {
      return;
    }

    activeObject.set(
      "textAlign",
      value
    );
  }

  if (property === "charSpacing") {
    if (
      activeObject.type !== "textbox" ||
      !Number.isFinite(numericValue)
    ) {
      return;
    }

    activeObject.set(
      "charSpacing",
      numericValue
    );
  }

  if (property === "lineHeight") {
    if (
      activeObject.type !== "textbox" ||
      !Number.isFinite(numericValue) ||
      numericValue <= 0
    ) {
      return;
    }

    activeObject.set(
      "lineHeight",
      numericValue
    );
  }

  if (property === "animations") {
    activeObject.set("animations", value);
  }

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

      async addPicture(file) {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas || !file) {
          return;
        }

        const imageUrl =
          URL.createObjectURL(file);

        try {
          const image =
            await FabricImage.fromURL(
              imageUrl
            );

          const maxWidth = 500;

          const maxHeight = 350;

          const imageWidth =
            image.width || 1;

          const imageHeight =
            image.height || 1;

          const scale = Math.min(
            maxWidth / imageWidth,

            maxHeight / imageHeight,

            1
          );

          image.set({
            left: 100,

            top: 80,

            scaleX: scale,

            scaleY: scale,

          });

          configureObjectControls(image);

          canvas.add(image);

          canvas.setActiveObject(image);

          canvas.requestRenderAll();

          sendSelectionData(image);

          saveHistory();
        } catch (error) {
          console.error(
            "Failed to add picture:",
            error
          );
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      },
   alignLeft() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  const selectedObjects =
    canvas.getActiveObjects();

  if (selectedObjects.length > 1) {
    const leftPositions =
      selectedObjects.map(
        (object) =>
          object.getBoundingRect().left
      );

    const targetLeft =
      Math.min(...leftPositions);

    selectedObjects.forEach(
      (object) => {
        const bounds =
          object.getBoundingRect();

        const difference =
          targetLeft - bounds.left;

        object.set({
          left:
            Number(object.left ?? 0) +
            difference,
        });

        object.setCoords();
      }
    );

    canvas.requestRenderAll();

    sendSelectionData(
      canvas.getActiveObject()
    );

    saveHistory();

    return;
  }

  const bounds =
    activeObject.getBoundingRect();

  activeObject.set({
    left:
      Number(activeObject.left ?? 0) -
      bounds.left,
  });

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

alignCenter() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  const selectedObjects =
    canvas.getActiveObjects();

  if (selectedObjects.length > 1) {
    const selectionBounds =
      activeObject.getBoundingRect();

    const targetCenter =
      selectionBounds.left +
      selectionBounds.width / 2;

    selectedObjects.forEach(
      (object) => {
        const bounds =
          object.getBoundingRect();

        const objectCenter =
          bounds.left +
          bounds.width / 2;

        const difference =
          targetCenter -
          objectCenter;

        object.set({
          left:
            Number(
              object.left ?? 0
            ) + difference,
        });

        object.setCoords();
      }
    );

    canvas.requestRenderAll();

    sendSelectionData(
      canvas.getActiveObject()
    );

    saveHistory();

    return;
  }

  const bounds =
    activeObject.getBoundingRect();

  const targetLeft =
    (
      canvas.getWidth() -
      bounds.width
    ) / 2;

  const difference =
    targetLeft - bounds.left;

  activeObject.set({
    left:
      Number(
        activeObject.left ?? 0
      ) + difference,
  });

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

alignRight() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  const selectedObjects =
    canvas.getActiveObjects();

  if (selectedObjects.length > 1) {
    const rightPositions =
      selectedObjects.map(
        (object) => {
          const bounds =
            object.getBoundingRect();

          return (
            bounds.left +
            bounds.width
          );
        }
      );

    const targetRight = Math.max(
      ...rightPositions
    );

    selectedObjects.forEach(
      (object) => {
        const bounds =
          object.getBoundingRect();

        const objectRight =
          bounds.left +
          bounds.width;

        const difference =
          targetRight -
          objectRight;

        object.set({
          left:
            Number(
              object.left ?? 0
            ) + difference,
        });

        object.setCoords();
      }
    );

    canvas.requestRenderAll();

    sendSelectionData(
      canvas.getActiveObject()
    );

    saveHistory();

    return;
  }

  const bounds =
    activeObject.getBoundingRect();

  const targetLeft =
    canvas.getWidth() -
    bounds.width;

  const difference =
    targetLeft - bounds.left;

  activeObject.set({
    left:
      Number(
        activeObject.left ?? 0
      ) + difference,
  });

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

alignTop() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  const selectedObjects =
    canvas.getActiveObjects();

  // Multiple Objects
  if (selectedObjects.length > 1) {
    const topPositions =
      selectedObjects.map(
        (object) =>
          object.getBoundingRect().top
      );

    const targetTop =
      Math.min(...topPositions);

    selectedObjects.forEach(
      (object) => {
        const bounds =
          object.getBoundingRect();

        const difference =
          targetTop - bounds.top;

        object.set({
          top:
            Number(object.top ?? 0) +
            difference,
        });

        object.setCoords();
      }
    );

    canvas.requestRenderAll();

    sendSelectionData(
      canvas.getActiveObject()
    );

    saveHistory();

    return;
  }

  // Single Object
  const bounds =
    activeObject.getBoundingRect();

  activeObject.set({
    top:
      Number(activeObject.top ?? 0) -
      bounds.top,
  });

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},
  
alignMiddle() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  const selectedObjects =
    canvas.getActiveObjects();

  // Multiple Objects
  if (selectedObjects.length > 1) {
    const centers =
      selectedObjects.map((object) => {
        const bounds =
          object.getBoundingRect();

        return (
          bounds.top +
          bounds.height / 2
        );
      });

    const targetCenter =
      centers.reduce(
        (sum, value) => sum + value,
        0
      ) / centers.length;

    selectedObjects.forEach(
      (object) => {
        const bounds =
          object.getBoundingRect();

        const currentCenter =
          bounds.top +
          bounds.height / 2;

        const difference =
          targetCenter -
          currentCenter;

        object.set({
          top:
            Number(object.top ?? 0) +
            difference,
        });

        object.setCoords();
      }
    );

    canvas.requestRenderAll();

    sendSelectionData(
      canvas.getActiveObject()
    );

    saveHistory();

    return;
  }

  // Single Object
  const bounds =
    activeObject.getBoundingRect();

 const targetTop =
(
canvas.getHeight() -
bounds.height
) / 2;

const difference =
targetTop - bounds.top;



activeObject.set({
top:
Number(activeObject.top ?? 0) +
difference,
});

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

alignBottom() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject = canvas.getActiveObject();

  if (!activeObject) {
    return;
  }

  const selectedObjects =
    canvas.getActiveObjects();

  // Multiple Objects
  if (selectedObjects.length > 1) {
    const bottoms =
      selectedObjects.map((object) => {
        const bounds =
          object.getBoundingRect();

        return (
          bounds.top +
          bounds.height
        );
      });

    const targetBottom =
      Math.max(...bottoms);

    selectedObjects.forEach(
      (object) => {
        const bounds =
          object.getBoundingRect();

        const currentBottom =
          bounds.top +
          bounds.height;

        const difference =
          targetBottom -
          currentBottom;

        object.set({
          top:
            Number(object.top ?? 0) +
            difference,
        });

        object.setCoords();
      }
    );

    canvas.requestRenderAll();

    sendSelectionData(
      canvas.getActiveObject()
    );

    saveHistory();

    return;
  }

  // Single Object
  const bounds =
    activeObject.getBoundingRect();

 const targetTop =
  canvas.getHeight() -
  bounds.height;

const difference =
  targetTop - bounds.top;

activeObject.set({
  top:
    Number(activeObject.top ?? 0) +
    difference,
});

  activeObject.setCoords();

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

  
    bringToFront() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  const objects = canvas.getActiveObjects();

  if (!objects.length) return;

  objects.forEach((obj) => {
    canvas.remove(obj);
    canvas.add(obj);
  });

  canvas.setActiveObject(
    objects.length === 1
      ? objects[0]
      : new ActiveSelection(objects, { canvas })
  );

  canvas.requestRenderAll();

  saveHistory();
},

bringForward() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  const objects = canvas.getActiveObjects();

  if (!objects.length) return;

  objects.forEach((obj) => {
    const index = canvas.getObjects().indexOf(obj);

    if (index < canvas.getObjects().length - 1) {
      canvas.moveObjectTo(obj, index + 1);
    }
  });

  canvas.requestRenderAll();

  saveHistory();
},
  
sendBackward() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  const objects = canvas.getActiveObjects();

  if (!objects.length) return;

  objects.forEach((obj) => {
    const index = canvas.getObjects().indexOf(obj);

    if (index > 0) {
      canvas.moveObjectTo(obj, index - 1);
    }
  });

  canvas.requestRenderAll();

  saveHistory();
},

sendToBack() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) return;

  const objects = canvas.getActiveObjects();

  if (!objects.length) return;

  // Selection remove करू नका
  objects.forEach((obj) => {
    canvas.remove(obj);
  });

  // उलट क्रमाने insert करा
  [...objects].reverse().forEach((obj) => {
    canvas.insertAt(0, obj);
  });

  if (objects.length === 1) {
    canvas.setActiveObject(objects[0]);
  } else {
    canvas.setActiveObject(
      new ActiveSelection(objects, { canvas })
    );
  }

  canvas.requestRenderAll();

  saveHistory();
},

groupSelected() {
  console.log("Group Click");
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (
    !activeObject ||
    String(activeObject.type).toLowerCase() !==
    "activeselection"
){
    return;
}

  const objects = activeObject.getObjects();

canvas.discardActiveObject();

objects.forEach((obj) => obj.group = undefined);
const group = new Group(objects, {
  left: activeObject.left,
  top: activeObject.top,
});

objects.forEach((obj) => canvas.remove(obj));
canvas.add(group);
group.setCoords();

canvas.setActiveObject(group);

canvas.requestRenderAll();

saveHistory();
},

ungroupSelected() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (
  !activeObject ||
  String(activeObject.type).toLowerCase() !== "group"
) {
  return;
}

  const items = activeObject.removeAll();

canvas.remove(activeObject);

items.forEach((obj) => {
    canvas.add(obj);
});

const selection = new ActiveSelection(items, {
    canvas,
});

canvas.setActiveObject(selection);

  canvas.requestRenderAll();

  saveHistory();
},

distributeHorizontal() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) return;

  const objects =
    canvas.getActiveObjects();

  if (objects.length < 3) return;

  const sorted =
    [...objects].sort(
      (a, b) => a.left - b.left
    );

  const first =
    sorted[0];

  const last =
    sorted[
      sorted.length - 1
    ];

  const firstRight =
    first.left +
    first.getScaledWidth();

  const lastLeft =
    last.left;

  const totalWidth =
    sorted
      .slice(1, -1)
      .reduce(
        (sum, obj) =>
          sum +
          obj.getScaledWidth(),
        0
      );

  const available =
    lastLeft -
    firstRight;

  const gap =
    (
      available -
      totalWidth
    ) /
    (sorted.length - 1);

  let current =
    firstRight + gap;

  for (
    let i = 1;
    i < sorted.length - 1;
    i++
  ) {
    sorted[i].set({
      left: current,
    });

    sorted[i].setCoords();

    current +=
      sorted[
        i
      ].getScaledWidth() + gap;
  }

  canvas.requestRenderAll();

  saveHistory();
},

distributeVertical() {
  const canvas =
    fabricCanvasRef.current;

  if (!canvas) return;

  const objects =
    canvas.getActiveObjects();

  if (objects.length < 3) return;

  const sorted =
    [...objects].sort(
      (a, b) => a.top - b.top
    );

  const first =
    sorted[0];

  const last =
    sorted[
      sorted.length - 1
    ];

  const firstBottom =
    first.top +
    first.getScaledHeight();

  const lastTop =
    last.top;

  const totalHeight =
    sorted
      .slice(1, -1)
      .reduce(
        (sum, obj) =>
          sum +
          obj.getScaledHeight(),
        0
      );

  const available =
    lastTop -
    firstBottom;

  const gap =
    (
      available -
      totalHeight
    ) /
    (sorted.length - 1);

  let current =
    firstBottom + gap;

  for (
    let i = 1;
    i < sorted.length - 1;
    i++
  ) {
    sorted[i].set({
      top: current,
    });

    sorted[i].setCoords();

    current +=
      sorted[
        i
      ].getScaledHeight() + gap;
  }

  canvas.requestRenderAll();

  saveHistory();
},
copySelected() {
  copyActiveObject();
},

pasteSelected() {
  pasteClipboardObject();
},

cutSelected() {
  cutActiveObject();
},

duplicateSelected() {
  duplicateActiveObject();
},
      deleteSelected() {
        const canvas =
          fabricCanvasRef.current;

        if (!canvas) {
          return;
        }

        const selectedObjects =
          canvas.getActiveObjects();

        if (
          selectedObjects.length === 0
        ) {
          return;
        }

        canvas.discardActiveObject();

        selectedObjects.forEach(
          (object) => {
            canvas.remove(object);
          }
        );

        selectionCallbackRef.current?.(
          null
        );

        canvas.requestRenderAll();

        saveHistory();
      },

      finishEditing() {
  const canvas = fabricCanvasRef.current;

  if (!canvas) {
    return;
  }

  const activeObject =
    canvas.getActiveObject();

  if (
    activeObject &&
    activeObject.type === "textbox" &&
    activeObject.isEditing
  ) {
    activeObject.exitEditing();

    activeObject.setCoords();

    canvas.requestRenderAll();

    saveHistory();
  }
},

      undo() {
        undoHistory();
      },

      redo() {
        redoHistory();
      },

      applyTheme(themeId) {
  applyTheme(themeId);
},

      getAnimatedObjectsCoords() {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return [];
        return canvas.getObjects()
          .filter(obj => obj.animations && obj.animations.length > 0)
          .flatMap(obj => {
            const sorted = [...obj.animations].sort((a, b) => (a.order || 0) - (b.order || 0));
            const rect = obj.getBoundingRect(true);
            return sorted.map((anim, idx) => ({
              id: `${obj.id}-${anim.id}`,
              order: anim.order,
              left: rect.left + (idx * 20),
              top: rect.top - 15,
            }));
          });
      },
    }),
    []
  );

  return (
    <div className="canvas-workspace">
      <div className="slide-canvas-container">
        <canvas
          ref={canvasElementRef}
        />
      </div>
    </div>
  );
});

export default EditorCanvas;