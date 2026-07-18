import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as fabric from "fabric";
import "./SlideShowPlayer.css";

function SlideShowPlayer({
  onClose,
  slides,
  activeSlideId,
}) {
    const canvasRef = useRef(null);

    const fabricCanvasRef = useRef(null);

  useEffect(() => {

   const handleKeyDown = (event) => {
  switch (event.key) {
    case "Escape":
      onClose?.();
      break;

    case "ArrowRight":
    case " ":
    case "PageDown":
      setCurrentIndex((prev) =>
        Math.min(prev + 1, slides.length - 1)
      );
      break;

    case "ArrowLeft":
    case "PageUp":
      setCurrentIndex((prev) =>
        Math.max(prev - 1, 0)
      );
      break;

    case "Home":
      setCurrentIndex(0);
      break;

    case "End":
      setCurrentIndex(slides.length - 1);
      break;

    default:
      break;
  }
};

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [onClose, slides]);

  const [currentIndex, setCurrentIndex] = useState(
  slides.findIndex(
    (s) => s.id === activeSlideId
  )
);

const currentSlide =
  slides[currentIndex] || null;

  useEffect(() => {
  if (!canvasRef.current) return;

  fabricCanvasRef.current = new fabric.Canvas(
    canvasRef.current,
    {
      width: 1280,
      height: 720,
      selection: false,
    }
  );
fabricCanvasRef.current.requestRenderAll();
  

  return () => {
    fabricCanvasRef.current?.dispose();
  };
}, []);

useEffect(() => {
  setCurrentIndex(
    slides.findIndex(
      (s) => s.id === activeSlideId
    )
  );
}, [activeSlideId, slides]);

useEffect(() => {

  const loadSlide = async () => {

    console.log("Slides:", slides);
    console.log("Current Index:", currentIndex);
    console.log("Current Slide:", currentSlide);

    if (
      !fabricCanvasRef.current ||
      !currentSlide?.canvasJSON
    ) {
      return;
    }

    try {

      await fabricCanvasRef.current.loadFromJSON(
        currentSlide.canvasJSON
      );

      fabricCanvasRef.current.requestRenderAll();

    } catch (err) {

      console.error(
        "Load Slide Error:",
        err
      );

    }

  };

  loadSlide();

}, [currentSlide]);

  return (

    <div className="slideshow-player">

      <div className="slideshow-slide">

<canvas
ref={canvasRef}
/>

      </div>

    </div>

  );

}

export default SlideShowPlayer;