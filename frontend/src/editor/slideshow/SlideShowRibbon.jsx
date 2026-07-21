import React from "react";

function SlideShowRibbon({
  onFromBeginning,
  onFromCurrentSlide,
  useTimings,
  setUseTimings,
  usePresenterView,
  setUsePresenterView,
}) {
  return (
    <div className="slideshow-ribbon" style={{ display: "flex", height: "100px", background: "#f3f4f6", padding: "5px 20px", gap: "20px", borderBottom: "1px solid #e5e7eb" }}>
      
      {/* 1. Start Slide Show */}
      <div className="ribbon-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid #ccc", paddingRight: "20px" }}>
        <div className="ribbon-group-content" style={{ display: "flex", gap: "10px", flexGrow: 1 }}>
          <button type="button" className="ribbon-button" onClick={onFromBeginning} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "5px" }}>
            <span className="ribbon-button-icon" style={{ fontSize: "24px", color: "#2e7d32" }}>▶️</span>
            <span className="ribbon-button-label" style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>From<br/>Beginning</span>
          </button>
          <button type="button" className="ribbon-button" onClick={onFromCurrentSlide} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: "5px" }}>
            <span className="ribbon-button-icon" style={{ fontSize: "24px", color: "#1976d2" }}>📺</span>
            <span className="ribbon-button-label" style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>From<br/>Current Slide</span>
          </button>
          <button type="button" className="ribbon-button" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", opacity: 0.5, padding: "5px" }}>
            <span className="ribbon-button-icon" style={{ fontSize: "24px", color: "#1976d2" }}>🔀</span>
            <span className="ribbon-button-label" style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>Custom Slide<br/>Show ▼</span>
          </button>
        </div>
        <div className="ribbon-group-label" style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>Start Slide Show</div>
      </div>

      {/* 2. Set Up */}
      <div className="ribbon-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid #ccc", paddingRight: "20px" }}>
        <div className="ribbon-group-content" style={{ display: "flex", gap: "10px", flexGrow: 1 }}>
           <button type="button" className="ribbon-button" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", opacity: 0.5, padding: "5px" }}>
            <span className="ribbon-button-icon" style={{ fontSize: "24px", color: "#1976d2" }}>⚙️</span>
            <span className="ribbon-button-label" style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>Set Up<br/>Slide Show</span>
          </button>
          <button type="button" className="ribbon-button" style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", opacity: 0.5, padding: "5px" }}>
            <span className="ribbon-button-icon" style={{ fontSize: "24px", color: "#666" }}>🚫</span>
            <span className="ribbon-button-label" style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>Hide<br/>Slide</span>
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", marginLeft: "10px", fontSize: "12px" }}>
             <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                <input type="checkbox" checked={true} readOnly /> Play Narrations
             </label>
             <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                <input type="checkbox" checked={useTimings} onChange={(e) => setUseTimings?.(e.target.checked)} /> Use Timings
             </label>
             <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                <input type="checkbox" checked={true} readOnly /> Show Media Controls
             </label>
          </div>
        </div>
        <div className="ribbon-group-label" style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>Set Up</div>
      </div>

      {/* 3. Monitors */}
      <div className="ribbon-group" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="ribbon-group-content" style={{ display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1, justifyContent: "center", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span>🖥️ Monitor:</span>
            <select style={{ padding: "2px", border: "1px solid #ccc", borderRadius: "3px" }}>
              <option>Automatic</option>
              <option>Primary Monitor</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
             <input type="checkbox" checked={usePresenterView} onChange={(e) => setUsePresenterView?.(e.target.checked)} /> Use Presenter View
          </label>
        </div>
        <div className="ribbon-group-label" style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>Monitors</div>
      </div>

    </div>
  );
}

export default SlideShowRibbon;