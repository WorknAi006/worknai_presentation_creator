import {
  createPresentation,
  updatePresentation,
  getPresentations,
} from "../services/presentationApi";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import TopToolbar from "../editor/toolbar/TopToolbar";

import SlideSidebar from "../editor/sidebar/SlideSidebar";

import EditorCanvas from "../editor/canvas/EditorCanvas";

import PropertiesPanel from "../editor/properties/PropertiesPanel";

import InsertRibbon from "../editor/ribbon/InsertRibbon";

import HomeRibbon from "../editor/ribbon/HomeRibbon";
import {
  createBlankSlide,
  duplicateSlide,
} from "../editor/slides/SlideManager";

import "../styles/editor.css";

import FileBackstage from "../editor/file/FileBackstage";


function PresentationEditor() {
  const editorCanvasRef = useRef(null);

  const initialSlideRef = useRef(
    createBlankSlide()
  );

  const slidesRef = useRef([
    initialSlideRef.current,
  ]);

  const activeSlideIdRef = useRef(
    initialSlideRef.current.id
  );

  const [activeTab, setActiveTab] =
    useState("Home");

  const [
    presentationId,
    setPresentationId,
    ] = useState(null);

  const [slides, setSlides] = useState(
    slidesRef.current
  );

  const [
  presentationTitle,
  setPresentationTitle,
] = useState("My Presentation");

  const [
    activeSlideId,
    setActiveSlideId,
  ] = useState(
    activeSlideIdRef.current
  );

  const [
    selectedObject,
    setSelectedObject,
  ] = useState(null);

  const [
    historyState,
    setHistoryState,
  ] = useState({
    canUndo: false,
    canRedo: false,
  });

  const updateSlides = useCallback(
    (nextSlides) => {
      slidesRef.current = nextSlides;

      setSlides(nextSlides);
    },
    []
  );

  const updateActiveSlideId =
    useCallback((slideId) => {
      activeSlideIdRef.current =
        slideId;

      setActiveSlideId(slideId);
    }, []);

  const handleSelectionChange =
    useCallback((objectData) => {
      setSelectedObject(objectData);
    }, []);

  const handleHistoryChange =
    useCallback((newHistoryState) => {
      setHistoryState(newHistoryState);
    }, []);

  const getCurrentCanvasJSON =
    useCallback(() => {
      return (
        editorCanvasRef.current
          ?.getCanvasJSON() || null
      );
    }, []);

  const getCurrentCanvasPreview =
    useCallback(() => {
      return (
        editorCanvasRef.current
          ?.getCanvasPreview() || null
      );
    }, []);

  const saveCurrentSlide =
    useCallback(() => {
      const canvasJSON =
        getCurrentCanvasJSON();

      const preview =
        getCurrentCanvasPreview();

      if (!canvasJSON) {
        return slidesRef.current;
      }

      const currentActiveSlideId =
        activeSlideIdRef.current;

      const nextSlides =
        slidesRef.current.map(
          (slide) =>
            slide.id ===
            currentActiveSlideId
              ? {
                  ...slide,

                  canvasJSON,

                  preview:
                    preview ||
                    slide.preview,
                }
              : slide
        );

      updateSlides(nextSlides);

      return nextSlides;
    }, [
      getCurrentCanvasJSON,
      getCurrentCanvasPreview,
      updateSlides,
    ]);

  const handleAddText = () => {
    editorCanvasRef.current?.addText();
  };

  const handleAddShape = (
    shapeType
  ) => {
    editorCanvasRef.current?.addShape(
      shapeType
    );
  };

  const handleAddPicture = (file) => {
    editorCanvasRef.current?.addPicture(
      file
    );
  };

  const handleUndo = () => {
    editorCanvasRef.current?.undo();
  };

  const handleRedo = () => {
    editorCanvasRef.current?.redo();
  };
  const handleAlignLeft = () => {
  editorCanvasRef.current
    ?.alignLeft();
};

const handleAlignCenter = () => {
  editorCanvasRef.current
    ?.alignCenter();
};

const handleAlignRight = () => {
  editorCanvasRef.current
    ?.alignRight();
};

const handleAlignTop = () => {
  editorCanvasRef.current
    ?.alignTop();
};

const handleAlignMiddle = () => {
  editorCanvasRef.current
    ?.alignMiddle();
};

const handleAlignBottom = () => {
  editorCanvasRef.current
    ?.alignBottom();
};
  const handleBringToFront = () => {
  editorCanvasRef.current
    ?.bringToFront();
};

const handleCopy = () => {
  editorCanvasRef.current
    ?.copySelected();
};

const handleCut = () => {
  editorCanvasRef.current
    ?.cutSelected();
};

const handlePaste = () => {
  editorCanvasRef.current
    ?.pasteSelected();
};

const handleDuplicateObject = () => {
  editorCanvasRef.current
    ?.duplicateSelected();
};
const handleBringForward = () => {
  editorCanvasRef.current
    ?.bringForward();
};

const handleSendBackward = () => {
  editorCanvasRef.current
    ?.sendBackward();
};

const handleSendToBack = () => {
  editorCanvasRef.current
    ?.sendToBack();
};
const handleGroup = () => {
  editorCanvasRef.current?.groupSelected();
};

const handleUngroup = () => {
  editorCanvasRef.current?.ungroupSelected();
};

const handleDistributeHorizontal =
  () => {
    editorCanvasRef.current
      ?.distributeHorizontal();
  };

const handleDistributeVertical =
  () => {
    editorCanvasRef.current
      ?.distributeVertical();
  };

  const handleUpdateObject = (
  property,
  value
) => {
  editorCanvasRef.current
    ?.updateSelectedObject(
      property,
      value
    );
};

  const handleSelectSlide = async (
    slideId
  ) => {
    if (
      slideId ===
      activeSlideIdRef.current
    ) {
      return;
    }

    const savedSlides =
      saveCurrentSlide();

    const nextSlide =
      savedSlides.find(
        (slide) =>
          slide.id === slideId
      );

    if (!nextSlide) {
      return;
    }

    updateActiveSlideId(slideId);

    setSelectedObject(null);

    await editorCanvasRef.current
      ?.loadCanvasJSON(
        nextSlide.canvasJSON
      );
  };

  const handleAddSlide = async () => {
    const savedSlides =
      saveCurrentSlide();

    const newSlide =
      createBlankSlide();

    const nextSlides = [
      ...savedSlides,
      newSlide,
    ];

    updateSlides(nextSlides);

    updateActiveSlideId(
      newSlide.id
    );

    setSelectedObject(null);

    await editorCanvasRef.current
      ?.loadCanvasJSON(
        newSlide.canvasJSON
      );
  };

  const handleDuplicateSlide = async (
    slideId
  ) => {
    const savedSlides =
      saveCurrentSlide();

    const sourceIndex =
      savedSlides.findIndex(
        (slide) =>
          slide.id === slideId
      );

    if (sourceIndex === -1) {
      return;
    }

    const sourceSlide =
      savedSlides[sourceIndex];

    const copiedSlide =
      duplicateSlide(sourceSlide);

    const nextSlides = [
      ...savedSlides,
    ];

    nextSlides.splice(
      sourceIndex + 1,
      0,
      copiedSlide
    );

    updateSlides(nextSlides);

    updateActiveSlideId(
      copiedSlide.id
    );

    setSelectedObject(null);

    await editorCanvasRef.current
      ?.loadCanvasJSON(
        copiedSlide.canvasJSON
      );
  };

  const handleDeleteSlide = async (
    slideId
  ) => {
    const savedSlides =
      saveCurrentSlide();

    if (savedSlides.length === 1) {
      const replacementSlide =
        createBlankSlide();

      updateSlides([
        replacementSlide,
      ]);

      updateActiveSlideId(
        replacementSlide.id
      );

      setSelectedObject(null);

      await editorCanvasRef.current
        ?.loadCanvasJSON(
          replacementSlide.canvasJSON
        );

      return;
    }

    const slideIndex =
      savedSlides.findIndex(
        (slide) =>
          slide.id === slideId
      );

    if (slideIndex === -1) {
      return;
    }

    const remainingSlides =
      savedSlides.filter(
        (slide) =>
          slide.id !== slideId
      );

    updateSlides(remainingSlides);

    if (
      slideId !==
      activeSlideIdRef.current
    ) {
      return;
    }

    const nextSlide =
      remainingSlides[
        Math.min(
          slideIndex,
          remainingSlides.length - 1
        )
      ];

    updateActiveSlideId(
      nextSlide.id
    );

    setSelectedObject(null);

    await editorCanvasRef.current
      ?.loadCanvasJSON(
        nextSlide.canvasJSON
      );
  };

  const handleNewPresentation = async () => {
  const newSlide = createBlankSlide();

  // Reset presentation ID
  // Next Save will create NEW MongoDB document
  setPresentationId(null);

  // Reset slides
  updateSlides([newSlide]);

  // Set new slide active
  updateActiveSlideId(newSlide.id);

  // Clear selected object
  setSelectedObject(null);

  // Load blank canvas
  await editorCanvasRef.current
    ?.loadCanvasJSON(
      newSlide.canvasJSON
    );

  // Return to editor
  setActiveTab("Home");
};
  
  const handleSavePresentation = async () => {
  try {
    // Save latest canvas data of current slide
    const updatedSlides = saveCurrentSlide();

    const presentationData = {
      title: presentationTitle,
      slides: updatedSlides,
      thumbnail:
        updatedSlides[0]?.preview || "",
    };

    let result;

    // First save -> Create new presentation
    if (!presentationId) {
      result = await createPresentation(
        presentationData
      );

      // Store MongoDB presentation ID
      setPresentationId(result._id);

      console.log(
        "Presentation created:",
        result
      );
    } else {
      // Next saves -> Update same presentation
      result = await updatePresentation(
        presentationId,
        presentationData
      );

      console.log(
        "Presentation updated:",
        result
      );
    }

    alert(
      presentationId
        ? "Presentation updated successfully!"
        : "Presentation saved successfully!"
    );
  } catch (error) {
    console.error(
      "Presentation save failed:",
      error
    );

    alert("Failed to save presentation.");
  }
};

const handleSaveAsPresentation = async () => {
  try {
    const newTitle = window.prompt(
      "Enter presentation name:",
      presentationTitle
    );

    if (!newTitle || !newTitle.trim()) {
      return;
    }

    const updatedSlides = saveCurrentSlide();

    const presentationData = {
      title: newTitle.trim(),
      slides: updatedSlides,
      thumbnail:
        updatedSlides[0]?.preview || "",
    };

    // Save As always creates a NEW presentation
    const result = await createPresentation(
      presentationData
    );

    // New copy becomes current presentation
    setPresentationId(result._id);
    setPresentationTitle(newTitle.trim());

    alert(
      `"${newTitle.trim()}" saved successfully!`
    );

    // Return to editor
    setActiveTab("Home");
  } catch (error) {
    console.error(
      "Save As failed:",
      error
    );

    alert("Failed to save presentation.");
  }
};

 const handleOpenPresentation = async (
  presentation
) => {
  try {
    if (
      !presentation?.slides ||
      presentation.slides.length === 0
    ) {
      alert(
        "This presentation has no slides."
      );
      return;
    }

    // Current MongoDB ID
    setPresentationId(
      presentation._id
    );

    setPresentationTitle(
  presentation.title || "Untitled Presentation"
);

    // Load slides
    updateSlides(
      presentation.slides
    );

    // First slide
    const firstSlide =
      presentation.slides[0];

    updateActiveSlideId(
      firstSlide.id
    );

    setSelectedObject(null);

    // Return to editor first
    setActiveTab("Home");

    // Load Fabric canvas
    setTimeout(async () => {
      await editorCanvasRef.current
        ?.loadCanvasJSON(
          firstSlide.canvasJSON
        );
    }, 0);

  } catch (error) {
    console.error(
      "Open presentation failed:",
      error
    );

    alert(
      "Failed to open presentation."
    );
  }
};


const handleLoadPresentations = async () => {
  try {
    const presentations =
      await getPresentations();

    console.log(
      "Saved presentations:",
      presentations
    );

    if (!presentations.length) {
      alert("No saved presentations found.");
      return;
    }

    // आत्ता testing साठी latest presentation load करू
    const presentation =
      presentations[
        presentations.length - 1
      ];

    if (
      !presentation.slides ||
      presentation.slides.length === 0
    ) {
      alert(
        "This presentation has no slides."
      );
      return;
    }

    // Set current MongoDB presentation ID
    setPresentationId(
      presentation._id
    );

    // Load all slides
    updateSlides(
      presentation.slides
    );

    // Select first slide
    const firstSlide =
      presentation.slides[0];

    updateActiveSlideId(
      firstSlide.id
    );

    setSelectedObject(null);

    // Load first slide into Fabric canvas
    await editorCanvasRef.current
      ?.loadCanvasJSON(
        firstSlide.canvasJSON
      );

    alert(
      "Presentation loaded successfully!"
    );
  } catch (error) {
    console.error(
      "Presentation load failed:",
      error
    );

    alert(
      "Failed to load presentation."
    );
  }
};

const handleExport = async (format) => {
  if (!presentationId) {
    alert("Please save the presentation first.");
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/presentations/${presentationId}/export/${format}`
    );

    if (!response.ok) {
      throw new Error("Export failed");
    }

    const blob = await response.blob();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `presentation.${format}`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(
      "Export error:",
      error
    );

    alert(
      `Failed to export ${format.toUpperCase()}`
    );
  }
};

  return (
    <div className="presentation-editor">
      <TopToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
        onSave={handleSavePresentation}
      />
    {activeTab === "File" ? (
  <FileBackstage
    onBack={() => setActiveTab("Home")}
    onNew={handleNewPresentation}
    onSave={handleSavePresentation}
    onSaveAs={handleSaveAsPresentation}
    onOpenPresentation={
    handleOpenPresentation
  }
    onExport={handleExport}
  />
) : (
  <>
      {activeTab === "Home" && (
  <HomeRibbon
    selectedObject={
      selectedObject
    }
    onUpdateObject={
      handleUpdateObject
    }
    onCopy={handleCopy}
    onCut={handleCut}
    onPaste={handlePaste}
    onDuplicate={
      handleDuplicateObject
    }
    onAlignLeft={
  handleAlignLeft
}
onAlignCenter={
  handleAlignCenter
}
onAlignRight={
  handleAlignRight
}
onAlignTop={
  handleAlignTop
}
onAlignMiddle={
  handleAlignMiddle
}
onAlignBottom={
  handleAlignBottom
}
    onBringToFront={
      handleBringToFront
    }
    onBringForward={
      handleBringForward
    }
    onSendBackward={
      handleSendBackward
    }
    onSendToBack={
      handleSendToBack
    }
    onGroup={handleGroup}
    onUngroup={handleUngroup}
    
    onDistributeHorizontal={
    handleDistributeHorizontal
    }
    onDistributeVertical={
      handleDistributeVertical
    }
  />
)}

      {activeTab === "Insert" && (
        <InsertRibbon
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddPicture={
            handleAddPicture
          }
          onAddSlide={
            handleAddSlide
          }
        />
      )}

      <main
        className={
        activeTab === "Insert" ||
        activeTab === "Home"
            ? "editor-layout ribbon-open"
            : "editor-layout"
  }
>
        <SlideSidebar
          slides={slides}
          activeSlideId={
            activeSlideId
          }
          onSelectSlide={
            handleSelectSlide
          }
          onAddSlide={handleAddSlide}
          onDuplicateSlide={
            handleDuplicateSlide
          }
          onDeleteSlide={
            handleDeleteSlide
          }
        />

        <section className="editor-workspace">
          <EditorCanvas
            ref={editorCanvasRef}
            onSelectionChange={
              handleSelectionChange
            }
            onHistoryChange={
              handleHistoryChange
            }
          />
        </section>

        <PropertiesPanel
          selectedObject={
            selectedObject
          }
          onUpdateObject={
            handleUpdateObject
          }
        />
      </main>
        </>
  )}
    </div>
  );
}

export default PresentationEditor;