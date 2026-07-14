const shapes = [
  {
    id: "rectangle",
    label: "Rectangle",
    icon: "▭",
  },
  {
    id: "circle",
    label: "Circle",
    icon: "○",
  },
  {
    id: "triangle",
    label: "Triangle",
    icon: "△",
  },
  {
    id: "line",
    label: "Line",
    icon: "╱",
  },
  {
    id: "arrow",
    label: "Arrow",
    icon: "→",
  },
];

function ShapesMenu({
  onSelectShape,
  onClose,
}) {
  const handleShapeClick = (shapeId) => {
    onSelectShape(shapeId);

    onClose();
  };

  return (
    <div className="shapes-menu">
      <div className="shapes-menu-title">
        Basic Shapes
      </div>

      <div className="shapes-grid">
        {shapes.map((shape) => (
          <button
            key={shape.id}
            className="shape-option"
            title={shape.label}
            onClick={() =>
              handleShapeClick(shape.id)
            }
          >
            <span className="shape-option-icon">
              {shape.icon}
            </span>

            <span className="shape-option-label">
              {shape.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ShapesMenu;