import React, { useEffect, useRef } from "react";
import { animationEffects } from "./animationEffects";
import "./animations.css";

function AnimationGallery({
  selectedAnimationId,
  onSelectAnimation,
  onClose,
}) {
  const dropdownRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSelect = (effectId) => {
    onSelectAnimation(effectId);
    onClose();
  };

  const handleMoreClick = (category) => {
    alert(`More ${category.charAt(0).toUpperCase() + category.slice(1)} Effects list will be shown here.`);
    onClose();
  };

  const renderCategory = (categoryKey, title, cssClass) => {
    const list = animationEffects[categoryKey] || [];
    return (
      <div className={`animations-dropdown-category ${cssClass}`}>
        <div className="animations-dropdown-title">{title}</div>
        <div className="animations-dropdown-grid">
          {list.map((effect) => (
            <button
              key={effect.id}
              type="button"
              title={effect.name}
              className={`animation-item-btn ${
                selectedAnimationId === effect.id ? "selected" : ""
              }`}
              onClick={() => handleSelect(effect.id)}
            >
              <span className="animation-item-icon">{effect.icon}</span>
              <span className="animation-item-name">{effect.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="animations-dropdown-overlay" onClick={onClose} />
      <div className="animations-dropdown-menu" ref={dropdownRef}>
        {renderCategory("entrance", "Entrance Animations", "category-entrance")}
        {renderCategory("emphasis", "Emphasis Animations", "category-emphasis")}
        {renderCategory("exit", "Exit Animations", "category-exit")}
        {renderCategory("motion_path", "Motion Paths", "category-motion_path")}

        <div 
          style={{
            display: "flex", 
            justifyContent: "space-between", 
            borderTop: "1px solid #eaeaea", 
            paddingTop: "10px", 
            marginTop: "10px"
          }}
        >
          <button 
            type="button" 
            className="animations-btn-flat" 
            onClick={() => handleMoreClick("entrance")}
          >
            More Entrance Effects...
          </button>
          <button 
            type="button" 
            className="animations-btn-flat" 
            onClick={() => handleMoreClick("emphasis")}
          >
            More Emphasis Effects...
          </button>
          <button 
            type="button" 
            className="animations-btn-flat" 
            onClick={() => handleMoreClick("exit")}
          >
            More Exit Effects...
          </button>
          <button 
            type="button" 
            className="animations-btn-flat" 
            onClick={() => handleMoreClick("motion_path")}
          >
            More Motion Paths...
          </button>
        </div>
      </div>
    </>
  );
}

export default AnimationGallery;
