import ColorPicker from "./ColorPicker";

function PropertiesPanel({
  selectedObject,
  onUpdateObject,
}) {
  if (!selectedObject) {
    return (
      <aside className="properties-panel">
        <div className="properties-header">
          Properties
        </div>

        <div className="properties-empty">
          <div className="empty-icon">
            ◇
          </div>

          <p>No object selected</p>

          <span>
            Select an element on the slide
            to edit its properties.
          </span>
        </div>
      </aside>
    );
  }

  const update = (
    property,
    value
  ) => {
    onUpdateObject?.(
      property,
      value
    );
  };

  return (
    <aside className="properties-panel">
      <div className="properties-header">
        Properties
      </div>

      <div className="property-content">
        <div className="property-type">
          <span>
            Selected object
          </span>

          <strong>
            {selectedObject.type}
          </strong>
        </div>

        <PropertySection title="Position">
          <PropertyField
            label="X"
            value={selectedObject.x}
          />

          <PropertyField
            label="Y"
            value={selectedObject.y}
          />
        </PropertySection>

        <PropertySection title="Size">
          <PropertyField
            label="Width"
            value={selectedObject.width}
          />

          <PropertyField
            label="Height"
            value={selectedObject.height}
          />
        </PropertySection>

        <PropertySection title="Transform">
          <PropertyField
            label="Rotation"
            value={`${selectedObject.rotation}°`}
          />
        </PropertySection>

       {selectedObject.fontSize !==
  null && (
  <PropertySection title="Text">
    <PropertySelect
      label="Font"
      value={
        selectedObject.fontFamily
      }
      options={[
        "Arial",
        "Calibri",
        "Times New Roman",
        "Georgia",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Courier New",
      ]}
      onChange={(value) =>
        update(
          "fontFamily",
          value
        )
      }
    />

    <PropertyNumberInput
      label="Font Size"
      value={
        selectedObject.fontSize
      }
      min={1}
      max={500}
      step={1}
      onChange={(value) =>
        update(
          "fontSize",
          value
        )
      }
    />

    <div className="text-format-buttons">
      <button
        type="button"
        className={
          selectedObject.fontWeight ===
          "bold"
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "fontWeight",
            selectedObject.fontWeight ===
              "bold"
              ? "normal"
              : "bold"
          )
        }
        title="Bold"
      >
        <strong>B</strong>
      </button>

      <button
        type="button"
        className={
          selectedObject.fontStyle ===
          "italic"
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "fontStyle",
            selectedObject.fontStyle ===
              "italic"
              ? "normal"
              : "italic"
          )
        }
        title="Italic"
      >
        <em>I</em>
      </button>

      <button
        type="button"
        className={
          selectedObject.underline
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "underline",
            !selectedObject.underline
          )
        }
        title="Underline"
      >
        <u>U</u>
      </button>

      <button
        type="button"
        className={
          selectedObject.linethrough
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "linethrough",
            !selectedObject.linethrough
          )
        }
        title="Strikethrough"
      >
        <s>S</s>
      </button>
    </div>

    <div className="text-align-buttons">
      <button
        type="button"
        className={
          selectedObject.textAlign ===
          "left"
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "textAlign",
            "left"
          )
        }
      >
        Left
      </button>

      <button
        type="button"
        className={
          selectedObject.textAlign ===
          "center"
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "textAlign",
            "center"
          )
        }
      >
        Center
      </button>

      <button
        type="button"
        className={
          selectedObject.textAlign ===
          "right"
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "textAlign",
            "right"
          )
        }
      >
        Right
      </button>

      <button
        type="button"
        className={
          selectedObject.textAlign ===
          "justify"
            ? "active"
            : ""
        }
        onClick={() =>
          update(
            "textAlign",
            "justify"
          )
        }
      >
        Justify
      </button>
    </div>

    <PropertyNumberInput
      label="Character Spacing"
      value={
        selectedObject.charSpacing
      }
      min={-1000}
      max={5000}
      step={10}
      onChange={(value) =>
        update(
          "charSpacing",
          value
        )
      }
    />

    <PropertyNumberInput
      label="Line Height"
      value={
        selectedObject.lineHeight
      }
      min={0.1}
      max={10}
      step={0.1}
      onChange={(value) =>
        update(
          "lineHeight",
          value
        )
      }
    />
  </PropertySection>
)}

        <PropertySection title="Appearance">
          <ColorPicker
            label="Fill"
            value={
              selectedObject.fill ||
              "#000000"
            }
            onChange={(color) =>
              update(
                "fill",
                color
              )
            }
            allowNoColor
          />
        </PropertySection>
      </div>
    </aside>
  );
}

function PropertySection({
  title,
  children,
}) {
  return (
    <div className="property-section">
      <div className="property-section-title">
        {title}
      </div>

      <div className="property-section-body">
        {children}
      </div>
    </div>
  );
}

function PropertyField({
  label,
  value,
}) {
  return (
    <div className="property-row">
      <label>{label}</label>

      <div className="property-value">
        {value}
      </div>
    </div>
  );
}
function PropertyNumberInput({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}) {
  return (
    <div className="property-row">
      <label>{label}</label>

      <div className="property-number-wrapper">
        <input
          type="number"
          value={value ?? 0}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue =
              Number(
                event.target.value
              );

            onChange?.(nextValue);
          }}
        />

        {suffix && (
          <span>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function PropertySelect({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div className="property-row">
      <label>{label}</label>

      <select
        className="property-select"
        value={value || ""}
        onChange={(event) =>
          onChange?.(
            event.target.value
          )
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PropertiesPanel;