// ===== WorknAI Design Integration START =====
import React, { useState } from "react";
import { themeDefinitions } from "./themeDefinitions";
import "./design.css";

/**
 * DesignRibbon Component
 * Renders the PowerPoint-style Design tab ribbon, featuring:
 * 1. Themes (Gallery of themes with More ▼ button)
 * 2. Variants (Color variations of the active theme)
 * 3. Customize options (Slide size, background format)
 */
function DesignRibbon({
  selectedThemeId = "office",
  onSelectTheme,
  selectedVariantIndex = 0,
  onSelectVariant,
  onSelectSlideSize,
  slideSize = "16:9",
  onToggleFormatBackground,
  formatBackgroundOpen,
  onHoverTheme,
  onHoverLeaveTheme,
}) {
  const [showGallery, setShowGallery] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  // Pick first 8 themes to show directly in ribbon gallery
  const quickThemes = themeDefinitions.slice(0, 12);
  const activeTheme = themeDefinitions.find(t => t.id === selectedThemeId) || themeDefinitions[0];

  const handleSelectTheme = (themeId) => {
    onSelectTheme?.(themeId);
    setShowGallery(false);
  };

  const handleSlideSizeChange = (size) => {
    onSelectSlideSize?.(size);
    setShowSizeMenu(false);
  };

  return (
    <div className="design-ribbon-wrapper" style={{ position: "relative" }}>
      <div className="design-ribbon">
        {/* 1. THEMES GROUP */}
        <div
  className="ribbon-group"
  style={{
    flex: 5,
    minWidth: 0
  }}
>
          <div className="ribbon-group-content">
            <div className="design-themes-gallery">
              <div 
                className="animations-gallery-container" 
                style={{ display: "flex", gap: "6px", overflow: "hidden" }}
              >
                {quickThemes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    title={t.name}
                    className={`design-theme-card ${selectedThemeId === t.id ? "selected" : ""}`}
                    onClick={() => handleSelectTheme(t.id)}
                    onMouseEnter={() => onHoverTheme?.(t.id)}
                    onMouseLeave={() => onHoverLeaveTheme?.()}
                  >
                    <div 
                      className="design-theme-preview-box" 
                      style={{ 
                        background: t.colors.bg, 
                        color: t.colors.text,
                        fontFamily: t.fonts.heading
                      }}
                    >
                      <div style={{ fontSize: "8px", fontWeight: "bold" }}>Aa</div>
                      <div className="design-theme-color-dots">
                        <div className="design-theme-dot" style={{ background: t.colors.primary }} />
                        <div className="design-theme-dot" style={{ background: t.colors.accent1 }} />
                        <div className="design-theme-dot" style={{ background: t.colors.accent2 }} />
                      </div>
                    </div>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="design-more-btn"
                onClick={() => setShowGallery(!showGallery)}
                title="More Themes"
              >
                ▼
              </button>
            </div>
          </div>
          <div className="ribbon-group-label">Themes</div>
        </div>

        {/* 2. VARIANTS GROUP */}
        <div
  className="ribbon-group"
  style={{
    flex:2
  }}
>
          <div className="ribbon-group-content">
            <div className="design-variants-gallery">
              {activeTheme.variants.slice(0, 4).map((variant, index) => (
                <button
                  key={variant.name}
                  type="button"
                  title={variant.name}
                  className={`design-variant-btn ${selectedVariantIndex === index ? "selected" : ""}`}
                  onClick={() => onSelectVariant?.(index)}
                >
                  <div 
                    className="design-variant-preview" 
                    style={{ 
                      background: variant.bg,
                      borderTopLeftRadius: "2px",
                      borderTopRightRadius: "2px",
                      position: "relative"
                    }}
                  >
                    <div 
                      style={{ 
                        position: "absolute",
                        bottom: "2px",
                        left: "2px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: variant.primary
                      }} 
                    />
                    <div 
                      style={{ 
                        position: "absolute",
                        bottom: "2px",
                        left: "10px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: variant.accent1
                      }} 
                    />
                  </div>
                  <div className="design-variant-label">{variant.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="ribbon-group-label">Variants</div>
        </div>

        {/* 3. CUSTOMIZE GROUP */}
        <div
className="ribbon-group"
style={{
flex:1,
borderRight:"none"
}}
>
          <div className="ribbon-group-content design-customize-group">
            {/* Slide Size */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ribbon-button"
                onClick={() => setShowSizeMenu(!showSizeMenu)}
                title="Change Slide Dimensions"
              >
                <span className="ribbon-button-icon">📐</span>
                <span className="ribbon-button-label">Slide Size ▼</span>
              </button>

              {showSizeMenu && (
                <>
                  <div className="design-dropdown-overlay" onClick={() => setShowSizeMenu(false)} />
                  <div 
                    className="animations-dropdown-menu" 
                    style={{ position: "absolute", top: "54px", right: "0", width: "160px", padding: "8px" }}
                  >
                    <button 
                      type="button" 
                      className={`animations-btn-flat ${slideSize === "4:3" ? "selected" : ""}`}
                      style={{ display: "block", width: "100%", textAlign: "left", marginBottom: "4px" }}
                      onClick={() => handleSlideSizeChange("4:3")}
                    >
                      Standard (4:3)
                    </button>
                    <button 
                      type="button" 
                      className={`animations-btn-flat ${slideSize === "16:9" ? "selected" : ""}`}
                      style={{ display: "block", width: "100%", textAlign: "left", marginBottom: "4px" }}
                      onClick={() => handleSlideSizeChange("16:9")}
                    >
                      Widescreen (16:9)
                    </button>
                    <button 
                      type="button" 
                      className={`animations-btn-flat ${slideSize === "custom" ? "selected" : ""}`}
                      style={{ display: "block", width: "100%", textAlign: "left" }}
                      onClick={() => handleSlideSizeChange("custom")}
                    >
                      Custom Size...
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Format Background */}
            <button
              type="button"
              className={`ribbon-button ${formatBackgroundOpen ? "selected" : ""}`}
              onClick={onToggleFormatBackground}
              title="Format Slide Background"
            >
              <span className="ribbon-button-icon">🎨</span>
              <span className="ribbon-button-label">Format Background</span>
            </button>
          </div>
          <div className="ribbon-group-label">Customize</div>
        </div>
      </div>

      {/* Dropdown Menu Gallery Overlay */}
      {showGallery && (
        <>
          <div className="design-dropdown-overlay" onClick={() => setShowGallery(false)} />
          <div className="design-dropdown-menu">
            <div className="animations-dropdown-title">Office & Custom Themes</div>
            <div className="design-dropdown-grid">
              {themeDefinitions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.name}
                  className={`design-theme-card ${selectedThemeId === t.id ? "selected" : ""}`}
                  style={{ width: "100%", height: "48px" }}
                  onClick={() => handleSelectTheme(t.id)}
                  onMouseEnter={() => onHoverTheme?.(t.id)}
                  onMouseLeave={() => onHoverLeaveTheme?.()}
                >
                  <div 
                    className="design-theme-preview-box" 
                    style={{ 
                      background: t.colors.bg, 
                      color: t.colors.text,
                      fontFamily: t.fonts.heading,
                      height: "32px"
                    }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: "bold" }}>Aa</div>
                  </div>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DesignRibbon;
// ===== WorknAI Design Integration END =====
