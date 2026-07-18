import React, { useState } from "react";
import { transitionCategories, getTransitionConfig } from "../transitions/transitionEffects";
import "../transitions/transitions.css";

function TransitionsRibbon({
  activeSlide,
  onUpdateSlideTransition,
  onUpdateSlideAdvance,
  onApplyToAll,
  onPreviewTransition,
}) {
  const [showMore, setShowMore] = useState(false);

  // Fallback default values
  const transition = activeSlide?.transition || {
    type: "none",
    duration: 0.70,
    direction: null,
  };

  const advance = activeSlide?.advance || {
    onClick: true,
    after: null,
  };

  // Currently selected transition metadata
  const selectedConfig = getTransitionConfig(transition.type);

  // Transitions visible on the ribbon itself (PowerPoint style quick-bar)
  const quickTransitions = transitionCategories.subtle;

  const handleSelectTransition = (type) => {
    const config = getTransitionConfig(type);
    const defaultDir = config?.directions ? config.directions[0] : null;
    
    // Set typical default duration if switching from 'none'
    let duration = transition.duration;
    if (transition.type === "none" && type !== "none") {
      duration = 0.70;
    }

    onUpdateSlideTransition?.({
      type,
      duration,
      direction: defaultDir,
    });
    setShowMore(false);
  };

  const handleDirectionChange = (e) => {
    onUpdateSlideTransition?.({
      ...transition,
      direction: e.target.value || null,
    });
  };

  const handleDurationChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      onUpdateSlideTransition?.({
        ...transition,
        duration: val,
      });
    }
  };

  const handleAdvanceClickChange = (e) => {
    onUpdateSlideAdvance?.({
      ...advance,
      onClick: e.target.checked,
    });
  };

  const handleAdvanceAfterToggle = (e) => {
    onUpdateSlideAdvance?.({
      ...advance,
      after: e.target.checked ? 5.00 : null, // Default 5 seconds
    });
  };

  const handleAdvanceAfterValChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) {
      onUpdateSlideAdvance?.({
        ...advance,
        after: val,
      });
    }
  };

  // Format helper for duration inputs
  const formatSeconds = (val) => {
    if (val === undefined || val === null) return "00.00";
    return val.toFixed(2);
  };

  return (
    <div className="transitions-ribbon">
      {/* 1. PREVIEW GROUP */}
      <div className="ribbon-group">
        <div className="ribbon-group-content">
          <button
            type="button"
            className="ribbon-button"
            onClick={onPreviewTransition}
            title="Preview Transition"
          >
            <span className="ribbon-button-icon">▶</span>
            <span className="ribbon-button-label">Preview</span>
          </button>
        </div>
        <div className="ribbon-group-label">Preview</div>
      </div>

      {/* 2. TRANSITIONS GALLERY */}
      <div className="ribbon-group gallery-group">
        <div className="ribbon-group-content" style={{ alignItems: "center", width: "100%" }}>
          <div className="transitions-gallery">
            <div className="transitions-gallery-container">
              {quickTransitions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.name}
                  className={`transition-item-btn ${
                    transition.type === t.id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectTransition(t.id)}
                >
                  <span className="transition-item-icon">{t.icon}</span>
                  <span className="transition-item-name">{t.name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="transitions-more-btn"
              onClick={() => setShowMore(!showMore)}
              title="More Transitions"
            >
              ▼
            </button>
          </div>
        </div>
        <div className="ribbon-group-label">Transition to This Slide</div>
      </div>

      {/* MORE TRANSITIONS DROPDOWN POPUP */}
      {showMore && (
        <>
          <div
            className="transitions-dropdown-overlay"
            onClick={() => setShowMore(false)}
          />
          <div className="transitions-dropdown-menu">
            <div className="transitions-dropdown-category">
              <div className="transitions-dropdown-title">Subtle</div>
              <div className="transitions-dropdown-grid">
                {transitionCategories.subtle.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    title={t.name}
                    className={`transition-item-btn ${
                      transition.type === t.id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectTransition(t.id)}
                  >
                    <span className="transition-item-icon">{t.icon}</span>
                    <span className="transition-item-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="transitions-dropdown-category">
              <div className="transitions-dropdown-title">Exciting</div>
              <div className="transitions-dropdown-grid">
                {transitionCategories.exciting.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    title={t.name}
                    className={`transition-item-btn ${
                      transition.type === t.id ? "selected" : ""
                    }`}
                    onClick={() => handleSelectTransition(t.id)}
                  >
                    <span className="transition-item-icon">{t.icon}</span>
                    <span className="transition-item-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3. EFFECT OPTIONS */}
      <div className="ribbon-group">
        <div className="ribbon-group-content">
          <div className="transitions-control-col">
            <div className="transitions-control-row">
              <span>Effect Options:</span>
            </div>
            <div className="transitions-control-row">
              <select
                className="transitions-select"
                value={transition.direction || ""}
                onChange={handleDirectionChange}
                disabled={!selectedConfig?.directions}
              >
                {!selectedConfig?.directions && (
                  <option value="">None</option>
                )}
                {selectedConfig?.directions?.map((dir) => (
                  <option key={dir} value={dir}>
                    {dir.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="ribbon-group-label">Effect Options</div>
      </div>

      {/* 4. TIMING */}
      <div className="ribbon-group" style={{ minWidth: "180px" }}>
        <div className="ribbon-group-content">
          <div className="transitions-control-col">
            <div className="transitions-control-row">
              <span style={{ width: "60px" }}>Duration:</span>
              <input
                type="number"
                className="transitions-input-num"
                step="0.05"
                min="0"
                max="60"
                value={transition.duration}
                onChange={handleDurationChange}
              />
              <span>s</span>
            </div>
            <div className="transitions-control-row" style={{ marginTop: "4px" }}>
              <button
                type="button"
                className="transitions-btn-flat"
                onClick={onApplyToAll}
              >
                Apply To All
              </button>
            </div>
          </div>
        </div>
        <div className="ribbon-group-label">Timing</div>
      </div>

      {/* 5. ADVANCE SLIDE */}
      <div className="ribbon-group" style={{ minWidth: "180px" }}>
        <div className="ribbon-group-content">
          <div className="transitions-control-col">
            <div className="transitions-control-row">
              <label className="transitions-advance-label">
                <input
                  type="checkbox"
                  checked={!!advance.onClick}
                  onChange={handleAdvanceClickChange}
                />
                On Mouse Click
              </label>
            </div>
            <div className="transitions-control-row">
              <label className="transitions-advance-label">
                <input
                  type="checkbox"
                  checked={advance.after !== null}
                  onChange={handleAdvanceAfterToggle}
                />
                After:
              </label>
              <input
                type="number"
                className="transitions-input-num"
                step="0.5"
                min="0.1"
                disabled={advance.after === null}
                value={advance.after !== null ? advance.after : 5.0}
                onChange={handleAdvanceAfterValChange}
              />
              <span>s</span>
            </div>
          </div>
        </div>
        <div className="ribbon-group-label">Advance Slide</div>
      </div>
    </div>
  );
}

export default TransitionsRibbon;
