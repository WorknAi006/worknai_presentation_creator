import React, { useState } from "react";
import { animationEffects, getAnimationConfig } from "./animationEffects";
import AnimationGallery from "./AnimationGallery";
import "./animations.css";

function AnimationsRibbon({
  selectedObject,
  onUpdateObject,
  onPreviewAnimations,
  showAnimationPane,
  setShowAnimationPane,
  animationPainterActive,
  setAnimationPainterActive,
  selectedAnimationIndex,
  setSelectedAnimationIndex,
}) {
  const [showGallery, setShowGallery] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEffectMenu, setShowEffectMenu] = useState(false);

  // Disable controls if no object is selected
  const isDisabled = !selectedObject;
  const animations = selectedObject?.animations || [];
  
  // Currently active animation in the animations array
  const activeAnimation = animations[selectedAnimationIndex] || animations[0] || null;
  const activeConfig = activeAnimation ? getAnimationConfig(activeAnimation.type) : null;

  // Selected quick animations for the horizontal gallery
  const quickAnimations = [
    // Entrance
    { id: "appear", name: "Appear", category: "entrance", icon: "✨" },
    { id: "fade", name: "Fade", category: "entrance", icon: "🌫️" },
    { id: "fly-in", name: "Fly In", category: "entrance", icon: "🛫" },
    { id: "float-in", name: "Float In", category: "entrance", icon: "🎈" },
    { id: "split", name: "Split", category: "entrance", icon: "✂️" },
    { id: "wipe", name: "Wipe", category: "entrance", icon: "🧹" },
    { id: "shape", name: "Shape", category: "entrance", icon: "◯" },
    { id: "wheel", name: "Wheel", category: "entrance", icon: "🎡" },
    { id: "zoom", name: "Zoom", category: "entrance", icon: "🔍" },
    // Emphasis
    { id: "pulse", name: "Pulse", category: "emphasis", icon: "💓" },
    { id: "color-pulse", name: "Colour Pulse", category: "emphasis", icon: "🌈" },
    { id: "teeter", name: "Teeter", category: "emphasis", icon: "⚖️" },
    { id: "spin", name: "Spin", category: "emphasis", icon: "🔄" },
    { id: "grow-shrink", name: "Grow/Shrink", category: "emphasis", icon: "🔍" },
    // Exit
    { id: "disappear", name: "Disappear", category: "exit", icon: "❌" },
    { id: "fade-out", name: "Fade", category: "exit", icon: "🌫️" },
    { id: "fly-out", name: "Fly Out", category: "exit", icon: "🛫" },
  ];

  const handleSelectAnimation = (effectId) => {
    if (isDisabled) return;
    const config = getAnimationConfig(effectId);
    if (!config) return;

    const newAnim = {
      id: activeAnimation?.id || `anim-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category: config.category,
      type: config.id,
      effect: config.supportedEffectOptions[0] || null,
      start: activeAnimation?.start || "on-click",
      duration: config.defaultDuration,
      delay: activeAnimation?.delay || 0,
      order: activeAnimation?.order || (animations.length > 0 ? Math.max(...animations.map(a => a.order || 0)) + 1 : 1),
    };

    let nextAnimations = [...animations];
    if (activeAnimation && animations.length > 0) {
      // Replace currently active animation
      const activeIdx = animations.findIndex(a => a.id === activeAnimation.id);
      if (activeIdx !== -1) {
        nextAnimations[activeIdx] = newAnim;
      }
    } else {
      // Add first animation
      nextAnimations = [newAnim];
      setSelectedAnimationIndex(0);
    }

    onUpdateObject?.("animations", nextAnimations);
  };

  const handleAddAnimation = (effectId) => {
    if (isDisabled) return;
    const config = getAnimationConfig(effectId);
    if (!config) return;

    // Calculate unique order
    const maxOrder = animations.reduce((max, a) => Math.max(max, a.order || 0), 0);

    const newAnim = {
      id: `anim-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category: config.category,
      type: config.id,
      effect: config.supportedEffectOptions[0] || null,
      start: "on-click",
      duration: config.defaultDuration,
      delay: 0,
      order: maxOrder + 1,
    };

    const nextAnimations = [...animations, newAnim];
    onUpdateObject?.("animations", nextAnimations);
    setSelectedAnimationIndex(nextAnimations.length - 1);
    setShowAddMenu(false);
  };

  const handleEffectChange = (val) => {
    if (!activeAnimation) return;
    const nextAnimations = animations.map(a => 
      a.id === activeAnimation.id ? { ...a, effect: val } : a
    );
    onUpdateObject?.("animations", nextAnimations);
    setShowEffectMenu(false);
  };

  const handleTimingChange = (field, val) => {
    if (!activeAnimation) return;
    const nextAnimations = animations.map(a => 
      a.id === activeAnimation.id ? { ...a, [field]: val } : a
    );
    onUpdateObject?.("animations", nextAnimations);
  };

  const handleReorder = (direction) => {
    if (!activeAnimation || animations.length <= 1) return;
    const activeIdx = animations.findIndex(a => a.id === activeAnimation.id);
    if (activeIdx === -1) return;

    let targetIdx = activeIdx + direction;
    if (targetIdx < 0 || targetIdx >= animations.length) return;

    const nextAnimations = [...animations];
    // Swap orders
    const tempOrder = nextAnimations[activeIdx].order;
    nextAnimations[activeIdx].order = nextAnimations[targetIdx].order;
    nextAnimations[targetIdx].order = tempOrder;

    // Sort by order so they stay sequentially ordered in the array
    nextAnimations.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Re-index their orders to make sure they are unique 1, 2, 3...
    nextAnimations.forEach((a, idx) => {
      a.order = idx + 1;
    });

    onUpdateObject?.("animations", nextAnimations);
    // Track new index of the animation
    const newActiveIdx = nextAnimations.findIndex(a => a.id === activeAnimation.id);
    setSelectedAnimationIndex(newActiveIdx);
  };

  return (
    <div className="animations-ribbon-wrapper" style={{ position: "relative" }}>
      <div className="animations-ribbon">
        {/* 1. PREVIEW */}
        <div className="ribbon-group">
          <div className="ribbon-group-content">
            <button
              type="button"
              className="ribbon-button"
              onClick={onPreviewAnimations}
              title="Preview Animations on Slide"
            >
              <span className="ribbon-button-icon">▶</span>
              <span className="ribbon-button-label">Preview</span>
            </button>
          </div>
          <div className="ribbon-group-label">Preview</div>
        </div>

        {/* 2. GALLERY */}
        <div className="ribbon-group gallery-group">
          <div className="ribbon-group-content" style={{ alignItems: "center", width: "100%", position: "relative" }}>
            {isDisabled ? (
              <div 
                className="animations-gallery" 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: "#9ca3af",
                  fontSize: "12px",
                  background: "#f3f4f6"
                }}
                title="Select an object to apply an animation."
              >
                Select an object to apply an animation.
              </div>
            ) : (
              <div className="animations-gallery">
                <div className="animations-gallery-container">
                  {quickAnimations.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      title={t.name}
                      className={`animation-item-btn category-${t.category} ${
                        activeAnimation?.type === t.id ? "selected" : ""
                      }`}
                      onClick={() => handleSelectAnimation(t.id)}
                    >
                      <span className="animation-item-icon">{t.icon}</span>
                      <span className="animation-item-name">{t.name}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="animations-more-btn"
                  onClick={() => setShowGallery(!showGallery)}
                  title="More Animations"
                >
                  ▼
                </button>
              </div>
            )}
          </div>
          <div className="ribbon-group-label">Animation</div>
        </div>

        {/* 3. EFFECT OPTIONS */}
        <div className="ribbon-group">
          <div className="ribbon-group-content" style={{ position: "relative" }}>
            <button
              type="button"
              className="ribbon-button"
              disabled={isDisabled || !activeConfig?.supportedEffectOptions?.length}
              onClick={() => setShowEffectMenu(!showEffectMenu)}
              title="Effect Options"
            >
              <span className="ribbon-button-icon">🌓</span>
              <span className="ribbon-button-label">Effect Options ▼</span>
            </button>

            {showEffectMenu && activeConfig && (
              <>
                <div className="animations-dropdown-overlay" onClick={() => setShowEffectMenu(false)} />
                <div 
                  className="animations-dropdown-menu" 
                  style={{ 
                    position: "absolute", 
                    top: "54px", 
                    left: "0", 
                    width: "160px",
                    maxHeight: "200px" 
                  }}
                >
                  {activeConfig.supportedEffectOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className="animations-btn-flat"
                      style={{ display: "block", width: "100%", textAlign: "left", marginBottom: "4px" }}
                      onClick={() => handleEffectChange(opt)}
                    >
                      {opt.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="ribbon-group-label">Effect Options</div>
        </div>

        {/* 4. ADVANCED ANIMATION */}
        <div className="ribbon-group" style={{ minWidth: "220px" }}>
          <div className="ribbon-group-content" style={{ display: "flex", gap: "8px", position: "relative" }}>
            {/* Add Animation */}
            <button
              type="button"
              className="ribbon-button"
              disabled={isDisabled}
              onClick={() => setShowAddMenu(!showAddMenu)}
              title="Add Animation to selected object"
            >
              <span className="ribbon-button-icon">➕</span>
              <span className="ribbon-button-label">Add Animation ▼</span>
            </button>

            {showAddMenu && (
              <>
                <div className="animations-dropdown-overlay" onClick={() => setShowAddMenu(false)} />
                <div 
                  className="animations-dropdown-menu" 
                  style={{ 
                    position: "absolute", 
                    top: "54px", 
                    left: "0", 
                    width: "240px", 
                    maxHeight: "350px",
                    overflowY: "auto"
                  }}
                >
                  <div className="animations-dropdown-title">Entrance</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "8px" }}>
                    {animationEffects.entrance.slice(0, 10).map(e => (
                      <button key={e.id} type="button" className="animations-btn-flat" onClick={() => handleAddAnimation(e.id)}>
                        <span style={{ color: "#2e7d32", marginRight: "4px" }}>{e.icon}</span> {e.name}
                      </button>
                    ))}
                  </div>
                  <div className="animations-dropdown-title">Emphasis</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginBottom: "8px" }}>
                    {animationEffects.emphasis.slice(0, 8).map(e => (
                      <button key={e.id} type="button" className="animations-btn-flat" onClick={() => handleAddAnimation(e.id)}>
                        <span style={{ color: "#ef6c00", marginRight: "4px" }}>{e.icon}</span> {e.name}
                      </button>
                    ))}
                  </div>
                  <div className="animations-dropdown-title">Exit</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                    {animationEffects.exit.slice(0, 8).map(e => (
                      <button key={e.id} type="button" className="animations-btn-flat" onClick={() => handleAddAnimation(e.id)}>
                        <span style={{ color: "#c62828", marginRight: "4px" }}>{e.icon}</span> {e.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Animation Pane */}
            <button
              type="button"
              className={`ribbon-button ${showAnimationPane ? "selected" : ""}`}
              onClick={() => setShowAnimationPane(!showAnimationPane)}
              title="Toggle Animation Pane"
            >
              <span className="ribbon-button-icon">📋</span>
              <span className="ribbon-button-label">Animation Pane</span>
            </button>

            {/* Animation Painter */}
            <button
              type="button"
              className={`ribbon-button ${animationPainterActive ? "selected" : ""}`}
              disabled={isDisabled || animations.length === 0}
              onClick={() => setAnimationPainterActive(!animationPainterActive)}
              title="Copy animations to another object"
            >
              <span className="ribbon-button-icon">🖌️</span>
              <span className="ribbon-button-label">Animation Painter</span>
            </button>
          </div>
          <div className="ribbon-group-label">Advanced Animation</div>
        </div>

        {/* 5. TIMING */}
        <div className="ribbon-group" style={{ minWidth: "180px" }}>
          <div className="ribbon-group-content">
            <div className="animations-control-col">
              <div className="animations-control-row">
                <span style={{ width: "50px" }}>Start:</span>
                <select
                  className="animations-select"
                  disabled={!activeAnimation}
                  value={activeAnimation?.start || "on-click"}
                  onChange={(e) => handleTimingChange("start", e.target.value)}
                >
                  <option value="on-click">On Click</option>
                  <option value="with-previous">With Previous</option>
                  <option value="after-previous">After Previous</option>
                </select>
              </div>
              <div className="animations-control-row" style={{ marginTop: "4px" }}>
                <span style={{ width: "50px" }}>Duration:</span>
                <input
                  type="number"
                  className="animations-input-num"
                  step="0.1"
                  min="0"
                  disabled={!activeAnimation}
                  value={activeAnimation?.duration !== undefined ? activeAnimation.duration : 0.5}
                  onChange={(e) => handleTimingChange("duration", parseFloat(e.target.value) || 0)}
                />
                <span>s</span>
              </div>
              <div className="animations-control-row" style={{ marginTop: "4px" }}>
                <span style={{ width: "50px" }}>Delay:</span>
                <input
                  type="number"
                  className="animations-input-num"
                  step="0.1"
                  min="0"
                  disabled={!activeAnimation}
                  value={activeAnimation?.delay !== undefined ? activeAnimation.delay : 0}
                  onChange={(e) => handleTimingChange("delay", parseFloat(e.target.value) || 0)}
                />
                <span>s</span>
              </div>
            </div>
          </div>
          <div className="ribbon-group-label">Timing</div>
        </div>

        {/* 6. REORDER ANIMATION */}
        <div className="ribbon-group">
          <div className="ribbon-group-content" style={{ flexDirection: "column", gap: "4px", justifyContent: "center" }}>
            <button
              type="button"
              className="animations-btn-flat"
              style={{ padding: "2px 6px", fontSize: "10px", display: "flex", alignItems: "center", gap: "2px" }}
              disabled={!activeAnimation || activeAnimation.order <= 1}
              onClick={() => handleReorder(-1)}
              title="Move animation earlier in sequence"
            >
              ▲ Move Earlier
            </button>
            <button
              type="button"
              className="animations-btn-flat"
              style={{ padding: "2px 6px", fontSize: "10px", display: "flex", alignItems: "center", gap: "2px" }}
              disabled={!activeAnimation || activeAnimation.order >= animations.length}
              onClick={() => handleReorder(1)}
              title="Move animation later in sequence"
            >
              ▼ Move Later
            </button>
          </div>
          <div className="ribbon-group-label">Reorder Animation</div>
        </div>
      </div>

      {/* Complete Animation Gallery Overlay Dropdown */}
      {showGallery && (
        <AnimationGallery
          selectedAnimationId={activeAnimation?.type || null}
          onSelectAnimation={handleSelectAnimation}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}

export default AnimationsRibbon;
