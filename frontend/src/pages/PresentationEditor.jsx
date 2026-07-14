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

  const [slides, setSlides] = useState(
    slidesRef.current
  );

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

  return (
    <div className="presentation-editor">
      <TopToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyState.canUndo}
        canRedo={historyState.canRedo}
      />
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
    </div>
  );
}

export default PresentationEditor;