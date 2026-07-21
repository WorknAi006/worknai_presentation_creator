import {
  useEffect,
  useRef,
  useState,
} from "react";

import * as fabric from "fabric";
import "./SlideShowPlayer.css";
import AnimationEngine from "./AnimationEngine";
import { DrawCanvas } from "../../features/draw";

function SlideShowPlayer({
  onClose,
  slides,
  startIndex = 0,
  useTimings = true,
  usePresenterView = false,
}) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [currentAnimationStepIndex, setCurrentAnimationStepIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const [outgoingSnapshot, setOutgoingSnapshot] = useState(null);
  const [transitionData, setTransitionData] = useState(null);
  const transitionTimeout = useRef(null);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // New features states
  const [isEndScreen, setIsEndScreen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [pointerMode, setPointerMode] = useState("arrow"); // 'arrow', 'pen', 'laser'
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  
  const [mediaOverlays, setMediaOverlays] = useState([]);

  // Fullscreen API
  useEffect(() => {
    const el = document.documentElement;
    if (!usePresenterView && el.requestFullscreen) {
      el.requestFullscreen().catch((err) => {
        console.warn("Could not activate full-screen mode:", err);
      });
    }
    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn(err));
      }
    };
  }, [usePresenterView]);

  useEffect(() => {
    if (!usePresenterView) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [usePresenterView]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const changeSlide = (nextIdx) => {
    if (nextIdx === currentIndex && !isEndScreen) return;
    setIsEndScreen(false);
    
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }

    if (fabricCanvasRef.current && !isEndScreen) {
      setOutgoingSnapshot(fabricCanvasRef.current.toDataURL({ format: 'png', multiplier: 1 }));
    } else {
      setOutgoingSnapshot(null);
    }

    const nextSlide = slides[nextIdx];
    const trans = nextSlide?.transition || { type: 'none', duration: 0.7 };
    setTransitionData(trans);
    setCurrentIndex(nextIdx);

    if (trans.type !== 'none') {
      transitionTimeout.current = setTimeout(() => {
        setOutgoingSnapshot(null);
        setTransitionData(null);
      }, trans.duration * 1000);
    } else {
      setOutgoingSnapshot(null);
      setTransitionData(null);
    }
  };

  const playAnimationStep = (stepIndex) => {
    if (stepIndex >= animationSteps.length) return;
    
    setIsAnimating(true);
    const stepAnimations = animationSteps[stepIndex];
    let maxDuration = 0;

    stepAnimations.forEach((anim) => {
      const obj = anim.targetObj;
      const durationMs = (anim.duration || 0.5) * 1000;
      const delayMs = (anim.delay || 0) * 1000;
      
      const totalTime = durationMs + delayMs;
      if (totalTime > maxDuration) maxDuration = totalTime;

      setTimeout(() => {
        AnimationEngine.play({
            animation: anim,
            object: obj,
            canvas: fabricCanvasRef.current,
            onComplete: () => {}
        });
      }, delayMs);
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, maxDuration);
  };

  const navigateToNext = (e) => {
    if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
    if (pointerMode === "pen") return; // Prevent navigation while drawing

    if (isEndScreen) {
      onClose?.();
      return;
    }

    if (isAnimating) return;

    if (currentAnimationStepIndex < animationSteps.length - 1) {
      const nextStepIndex = currentAnimationStepIndex + 1;
      setCurrentAnimationStepIndex(nextStepIndex);
      playAnimationStep(nextStepIndex);
    } else {
      if (currentIndex >= slides.length - 1) {
        setIsEndScreen(true);
      } else {
        changeSlide(currentIndex + 1);
      }
    }
  };

  const navigateToPrev = () => {
    if (isEndScreen) {
      setIsEndScreen(false);
      return;
    }
    changeSlide(Math.max(currentIndex - 1, 0));
  };

  const navigateToFirst = () => {
    changeSlide(0);
  };

  const navigateToLast = () => {
    changeSlide(slides.length - 1);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "Escape":
          onClose?.();
          break;
        case "ArrowRight":
        case " ":
        case "PageDown":
          navigateToNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          navigateToPrev();
          break;
        case "Home":
          navigateToFirst();
          break;
        case "End":
          navigateToLast();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, slides, currentIndex, isEndScreen, pointerMode]);

  const currentSlide = slides[currentIndex] || null;

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
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  // Pen Mode Effect
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    if (pointerMode === "pen") {
      fabricCanvasRef.current.isDrawingMode = true;
      fabricCanvasRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvasRef.current);
      fabricCanvasRef.current.freeDrawingBrush.color = "red";
      fabricCanvasRef.current.freeDrawingBrush.width = 4;
    } else {
      fabricCanvasRef.current.isDrawingMode = false;
    }
  }, [pointerMode, currentSlide]); // re-apply when slide changes

  useEffect(() => {
    setCurrentIndex(startIndex);
    setIsEndScreen(false);
  }, [startIndex]);

  useEffect(() => {
    if (!useTimings || isEndScreen) return;
    const currentSlide = slides[currentIndex];
    if (currentSlide?.advance?.after !== null && currentSlide?.advance?.after !== undefined) {
      const timer = setTimeout(() => {
        if (currentIndex < slides.length - 1) {
          changeSlide(currentIndex + 1);
        } else {
          setIsEndScreen(true);
        }
      }, currentSlide.advance.after * 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slides, useTimings, isEndScreen]);

  useEffect(() => {
    const loadSlide = async () => {
      if (!fabricCanvasRef.current || !currentSlide?.canvasJSON) return;

      try {
        await fabricCanvasRef.current.loadFromJSON(currentSlide.canvasJSON);

        const objects = fabricCanvasRef.current.getObjects();
        let allAnimations = [];
        let mediaItems = [];
        
        objects.forEach((obj) => {
          if (obj.customType === 'video' || obj.customType === 'audio') {
            const bounds = obj.getBoundingRect();
            mediaItems.push({
              id: obj.id,
              type: obj.customType,
              srcUrl: obj.srcUrl,
              left: bounds.left,
              top: bounds.top,
              width: bounds.width,
              height: bounds.height,
            });
            // Hide the placeholder in the slideshow
            obj.set('opacity', 0);
          }

          if (obj.animations && Array.isArray(obj.animations)) {
            obj.animations.forEach((anim) => {
              allAnimations.push({ ...anim, targetObj: obj });
            });
          }
        });

        setMediaOverlays(mediaItems);

        // Sort globally by order
        allAnimations.sort((a, b) => (a.order || 0) - (b.order || 0));

        // Hide objects with entrance animations initially
        const entranceAnimations = allAnimations.filter((a) => a.category === "entrance");
        entranceAnimations.forEach((anim) => {
          anim.targetObj.set('opacity', 0);
        });

        // Group into steps based on 'on-click'
        let steps = [];
        let currentStep = [];
        
        allAnimations.forEach((anim) => {
          if (anim.start === "on-click") {
            if (currentStep.length > 0) steps.push(currentStep);
            currentStep = [anim];
          } else {
            currentStep.push(anim);
          }
        });
        if (currentStep.length > 0) steps.push(currentStep);

        setAnimationSteps(steps);
        setCurrentAnimationStepIndex(-1);

        fabricCanvasRef.current.requestRenderAll();
      } catch (err) {
        console.error("Load Slide Error:", err);
      }
    };

    if (!isEndScreen) {
      loadSlide();
    }
  }, [currentSlide, isEndScreen]);

  const transitionClass = transitionData && transitionData.type !== 'none'
    ? `transition-${transitionData.type} ${transitionData.direction ? `direction-${transitionData.direction}` : ''}`
    : '';

  const durationStyle = transitionData
    ? { animationDuration: `${transitionData.duration}s` }
    : {};

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleMouseMove = (e) => {
    if (pointerMode === "laser") {
      setLaserPos({ x: e.clientX, y: e.clientY });
    }
  };

  const renderPresenterLayout = () => {
    const nextSlide = currentIndex < slides.length - 1 ? slides[currentIndex + 1] : null;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="presenter-layout" onContextMenu={handleContextMenu} onClick={closeContextMenu} onMouseMove={handleMouseMove}>
        <div className="presenter-header">
          <button className="presenter-end-btn" onClick={() => onClose?.()}>End Show</button>
          <div className="presenter-timer">Elapsed Time: {formatTime(elapsedSeconds)}</div>
          <div className="presenter-clock">{timeString}</div>
        </div>
        <div className="presenter-body">
          <div className="presenter-main">
             <div className="presenter-main-label">Current Slide ({currentIndex + 1} of {slides.length})</div>
             <div className={`presenter-canvas-wrapper ${pointerMode === 'laser' ? 'laser-pointer-active' : ''}`} onClick={navigateToNext}>
               
               {isEndScreen ? (
                 <div className="slideshow-end-screen" onClick={() => onClose?.()}>
                   End of slide show, click to exit.
                 </div>
               ) : (
                 <div className={`slideshow-slide ${transitionClass}`} style={durationStyle}>
                   {outgoingSnapshot && (
                      <img 
                        src={outgoingSnapshot} 
                        alt="outgoing slide" 
                        className="slideshow-outgoing" 
                        style={durationStyle}
                      />
                   )}
                   <div className="slideshow-incoming" style={durationStyle}>
                     <canvas ref={canvasRef} />
                     {mediaOverlays.map(media => (
                       media.type === 'video' ? (
                         <video 
                           key={media.id}
                           src={media.srcUrl} 
                           style={{ position: 'absolute', left: media.left, top: media.top, width: media.width, height: media.height, objectFit: 'contain' }}
                           autoPlay 
                           loop 
                           muted 
                         />
                       ) : (
                         <audio 
                           key={media.id}
                           src={media.srcUrl} 
                           autoPlay 
                           loop 
                           style={{ display: 'none' }}
                         />
                       )
                     ))}
                   </div>
                   <DrawCanvas
                     slideId={currentSlide?.id}
                     initialStrokes={currentSlide?.drawStrokes}
                     readOnly
                   />
                 </div>
               )}
             </div>
          </div>
          <div className="presenter-sidebar">
             <div className="presenter-next-slide">
                <div className="presenter-sidebar-label">Next Slide Preview</div>
                {nextSlide && !isEndScreen ? (
                   <img src={nextSlide.preview} alt="Next slide preview" className="presenter-preview-img" />
                ) : (
                   <div className="presenter-end-preview">End of Presentation</div>
                )}
             </div>
             <div className="presenter-notes">
                <div className="presenter-sidebar-label">Speaker Notes</div>
                <div className="presenter-notes-content">
                   {isEndScreen ? "" : (currentSlide?.notes || "No notes for this slide.")}
                </div>
             </div>
          </div>
        </div>
        {pointerMode === "laser" && (
          <div className="laser-dot" style={{ left: laserPos.x, top: laserPos.y }} />
        )}
        
        {/* Context Menu */}
        {contextMenu && (
          <div className="slideshow-context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={e => e.stopPropagation()}>
            <div className="slideshow-context-item" onClick={() => { navigateToNext(); closeContextMenu(); }}>Next</div>
            <div className="slideshow-context-item" onClick={() => { navigateToPrev(); closeContextMenu(); }}>Previous</div>
            <div style={{ borderTop: "1px solid #444", margin: "4px 0" }}></div>
            <div className="slideshow-context-item" onClick={() => { setPointerMode("arrow"); closeContextMenu(); }}>Arrow Pointer</div>
            <div className="slideshow-context-item" onClick={() => { setPointerMode("pen"); closeContextMenu(); }}>Pen Tool</div>
            <div className="slideshow-context-item" onClick={() => { setPointerMode("laser"); closeContextMenu(); }}>Laser Pointer</div>
            <div style={{ borderTop: "1px solid #444", margin: "4px 0" }}></div>
            <div className="slideshow-context-item" onClick={() => { onClose?.(); closeContextMenu(); }}>End Show</div>
          </div>
        )}
      </div>
    );
  };

  if (usePresenterView) {
    return renderPresenterLayout();
  }

  return (
    <div 
      className={`slideshow-player ${pointerMode === 'laser' ? 'laser-pointer-active' : ''}`} 
      onClick={(e) => {
        closeContextMenu();
        if (!contextMenu) navigateToNext(e);
      }}
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
    >
      {isEndScreen ? (
        <div className="slideshow-end-screen" onClick={() => onClose?.()}>
          End of slide show, click to exit.
        </div>
      ) : (
        <div className={`slideshow-slide ${transitionClass}`} style={durationStyle}>
          {outgoingSnapshot && (
            <img 
              src={outgoingSnapshot} 
              alt="outgoing slide" 
              className="slideshow-outgoing" 
              style={durationStyle}
            />
          )}
          <div className="slideshow-incoming" style={durationStyle}>
            <canvas ref={canvasRef} />
            {mediaOverlays.map(media => (
              media.type === 'video' ? (
                <video 
                  key={media.id}
                  src={media.srcUrl} 
                  style={{ position: 'absolute', left: media.left, top: media.top, width: media.width, height: media.height, objectFit: 'contain' }}
                  autoPlay 
                  loop 
                  muted 
                />
              ) : (
                <audio 
                  key={media.id}
                  src={media.srcUrl} 
                  autoPlay 
                  loop 
                  style={{ display: 'none' }}
                />
              )
            ))}
          </div>
          <DrawCanvas
            slideId={currentSlide?.id}
            initialStrokes={currentSlide?.drawStrokes}
            readOnly
          />
        </div>
      )}

      {/* On-screen Controls (hover) */}
      <div className="slideshow-controls" onClick={e => e.stopPropagation()}>
        <button className="slideshow-control-btn" onClick={navigateToPrev} title="Previous">◀</button>
        <button className={`slideshow-control-btn ${pointerMode === 'arrow' ? 'active' : ''}`} onClick={() => setPointerMode("arrow")} title="Arrow Pointer">↖</button>
        <button className={`slideshow-control-btn ${pointerMode === 'pen' ? 'active' : ''}`} onClick={() => setPointerMode("pen")} title="Pen">🖊️</button>
        <button className={`slideshow-control-btn ${pointerMode === 'laser' ? 'active' : ''}`} onClick={() => setPointerMode("laser")} title="Laser Pointer">🔴</button>
        <button className="slideshow-control-btn" onClick={navigateToNext} title="Next">▶</button>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div className="slideshow-context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={e => e.stopPropagation()}>
          <div className="slideshow-context-item" onClick={() => { navigateToNext(); closeContextMenu(); }}>Next</div>
          <div className="slideshow-context-item" onClick={() => { navigateToPrev(); closeContextMenu(); }}>Previous</div>
          <div style={{ borderTop: "1px solid #444", margin: "4px 0" }}></div>
          <div className="slideshow-context-item" onClick={() => { setPointerMode("arrow"); closeContextMenu(); }}>Arrow Pointer</div>
          <div className="slideshow-context-item" onClick={() => { setPointerMode("pen"); closeContextMenu(); }}>Pen Tool</div>
          <div className="slideshow-context-item" onClick={() => { setPointerMode("laser"); closeContextMenu(); }}>Laser Pointer</div>
          <div style={{ borderTop: "1px solid #444", margin: "4px 0" }}></div>
          <div className="slideshow-context-item" onClick={() => { onClose?.(); closeContextMenu(); }}>End Show</div>
        </div>
      )}

      {pointerMode === "laser" && (
        <div className="laser-dot" style={{ left: laserPos.x, top: laserPos.y }} />
      )}
    </div>
  );
}

export default SlideShowPlayer;