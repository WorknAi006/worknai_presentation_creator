import { useRef, useState } from "react";

import ShapesMenu from "./ShapesMenu";

function InsertRibbon({
  onAddText,
  onAddShape,
  onAddPicture,
  onAddSlide,
  onAddMedia,
}) {
  const [showShapes, setShowShapes] =
    useState(false);

  const pictureInputRef = useRef(null);

  const handlePictureButton = () => {
    pictureInputRef.current?.click();
  };

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onAddPicture(file);

    event.target.value = "";
  };

  const mediaInputRef = useRef(null);

  const handleMediaButton = () => {
    mediaInputRef.current?.click();
  };

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Pass the file and the type (video or audio)
    const type = file.type.startsWith("video") ? "video" : "audio";
    onAddMedia?.(file, type);

    event.target.value = "";
  };

  return (
    <div className="insert-ribbon">
      <RibbonGroup label="Slides">
        <RibbonButton
          icon="+"
          label="New Slide"
          onClick={onAddSlide}
        />
      </RibbonGroup>

      <RibbonGroup label="Tables">
        <RibbonButton
          icon="▦"
          label="Table"
        />
      </RibbonGroup>

      <RibbonGroup label="Images">
        <RibbonButton
          icon="▧"
          label="Picture"
          onClick={handlePictureButton}
        />

        <input
          ref={pictureInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePictureChange}
        />
      </RibbonGroup>

      <RibbonGroup label="Illustrations">
        <div className="ribbon-dropdown-wrapper">
          <RibbonButton
            icon="◯"
            label="Shapes"
            dropdown
            onClick={() =>
              setShowShapes(
                (current) => !current
              )
            }
          />

          {showShapes && (
            <ShapesMenu
              onSelectShape={onAddShape}
              onClose={() =>
                setShowShapes(false)
              }
            />
          )}
        </div>

        <RibbonButton
          icon="◇"
          label="Icons"
        />

        <RibbonButton
          icon="▥"
          label="Chart"
        />
      </RibbonGroup>

      <RibbonGroup label="Text">
        <RibbonButton
          icon="A"
          label="Text Box"
          onClick={onAddText}
        />

        <RibbonButton
          icon="W"
          label="WordArt"
        />
      </RibbonGroup>

      <RibbonGroup label="Media">
        <RibbonButton
          icon="▶"
          label="Video"
          onClick={handleMediaButton}
        />

        <RibbonButton
          icon="♪"
          label="Audio"
          onClick={handleMediaButton}
        />

        <input
          ref={mediaInputRef}
          type="file"
          accept="video/*,audio/*"
          hidden
          onChange={handleMediaChange}
        />
      </RibbonGroup>
    </div>
  );
}

function RibbonGroup({
  label,
  children,
}) {
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-content">
        {children}
      </div>

      <div className="ribbon-group-label">
        {label}
      </div>
    </div>
  );
}

function RibbonButton({
  icon,
  label,
  dropdown = false,
  onClick,
}) {
  return (
    <button
      className="ribbon-button"
      onClick={onClick}
    >
      <span className="ribbon-button-icon">
        {icon}
      </span>

      <span className="ribbon-button-label">
        {label}

        {dropdown && (
          <span className="dropdown-arrow">
            ▾
          </span>
        )}
      </span>
    </button>
  );
}

export default InsertRibbon;