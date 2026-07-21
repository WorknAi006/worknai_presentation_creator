import React from "react";

const shapeCategories = [
  {
    category: "Lines",
    shapes: [
      { id: "line", label: "Line", icon: "╱" },
      { id: "arrow", label: "Arrow", icon: "→" },
    ]
  },
  {
    category: "Rectangles",
    shapes: [
      { id: "rectangle", label: "Rectangle", icon: "▭" },
      { id: "rounded_rectangle", label: "Rounded Rectangle", icon: "▢" },
    ]
  },
  {
    category: "Basic Shapes",
    shapes: [
      { id: "circle", label: "Circle", icon: "○" },
      { id: "ellipse", label: "Oval", icon: "⬭" },
      { id: "triangle", label: "Triangle", icon: "△" },
      { id: "diamond", label: "Diamond", icon: "◇" },
      { id: "pentagon", label: "Pentagon", icon: "⬠" },
      { id: "hexagon", label: "Hexagon", icon: "⬡" },
      { id: "star", label: "Star", icon: "★" },
      { id: "heart", label: "Heart", icon: "♡" },
      { id: "cloud", label: "Cloud", icon: "☁" },
      { id: "sun", label: "Sun", icon: "☀" },
      { id: "moon", label: "Moon", icon: "🌙" },
    ]
  },
  {
    category: "Block Arrows",
    shapes: [
      { id: "block_arrow_right", label: "Right Arrow", icon: "➔" },
      { id: "block_arrow_left", label: "Left Arrow", icon: "⬅" },
      { id: "block_arrow_up", label: "Up Arrow", icon: "⬆" },
      { id: "block_arrow_down", label: "Down Arrow", icon: "⬇" },
    ]
  },
  {
    category: "Equation Shapes",
    shapes: [
      { id: "plus", label: "Plus", icon: "➕" },
      { id: "minus", label: "Minus", icon: "➖" },
      { id: "multiply", label: "Multiply", icon: "✖" },
      { id: "divide", label: "Divide", icon: "➗" },
      { id: "equal", label: "Equal", icon: "＝" },
    ]
  }
];

function ShapesMenu({ onSelectShape, onClose }) {
  const handleShapeClick = (shapeId) => {
    onSelectShape(shapeId);
    onClose();
  };

  return (
    <div className="shapes-menu" style={{ width: "320px", padding: "10px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", position: "absolute", zIndex: 9999 }}>
      {shapeCategories.map((categoryGroup, index) => (
        <div key={index} className="shape-category" style={{ marginBottom: "15px" }}>
          <div className="shapes-menu-title" style={{ fontSize: "12px", fontWeight: "bold", color: "#555", marginBottom: "8px", textTransform: "uppercase" }}>
            {categoryGroup.category}
          </div>
          <div className="shapes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px" }}>
            {categoryGroup.shapes.map((shape) => (
              <button
                key={shape.id}
                className="shape-option"
                title={shape.label}
                onClick={() => handleShapeClick(shape.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "36px",
                  border: "1px solid transparent",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span className="shape-option-icon" style={{ fontSize: "16px" }}>
                  {shape.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShapesMenu;