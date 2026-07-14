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
} from "fabric";

import HistoryManager from "../history/HistoryManager";

const EditorCanvas = forwardRef(function EditorCanvas(
  {
    onSelectionChange,
    onHistoryChange,
  },
  ref
) {
  const canvasElementRef = useRef(null);

  const fabricCanvasRef = useRef(null);

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
    selectionCallbackRef.current?.(null);

    return;
  }

  const objectData = {
    type:
      object.customType ||
      object.type,

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
      updateSelection
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

  useImperativeHandle(
    ref,
    () => ({
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
            }
        );

          canvas.backgroundColor =
            "#ffffff";

          canvas.requestRenderAll();

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

  if (!activeObject) {
    return;
  }

  const numericValue =
    Number(value);

  if (property === "x") {
    if (
      !Number.isFinite(numericValue)
    ) {
      return;
    }

    activeObject.set(
      "left",
      numericValue
    );
  }

  if (property === "y") {
    if (
      !Number.isFinite(numericValue)
    ) {
      return;
    }

    activeObject.set(
      "top",
      numericValue
    );
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
      bringToFront() {
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

  canvas.bringObjectToFront(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

bringForward() {
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

  canvas.bringObjectForward(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

sendBackward() {
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

  canvas.sendObjectBackwards(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

  saveHistory();
},

sendToBack() {
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

  canvas.sendObjectToBack(
    activeObject
  );

  canvas.requestRenderAll();

  sendSelectionData(
    activeObject
  );

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

      undo() {
        undoHistory();
      },

      redo() {
        redoHistory();
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