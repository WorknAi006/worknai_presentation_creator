import {
  useEffect,
  useRef,
  useState,
} from "react";

const THEME_COLORS = [
  "#ffffff",
  "#000000",
  "#e7e6e6",
  "#44546a",
  "#4472c4",
  "#ed7d31",
  "#a5a5a5",
  "#ffc000",
  "#5b9bd5",
  "#70ad47",
];

const STANDARD_COLORS = [
  "#c00000",
  "#ff0000",
  "#ffc000",
  "#ffff00",
  "#92d050",
  "#00b050",
  "#00b0f0",
  "#0070c0",
  "#002060",
  "#7030a0",
];

const COLOR_PALETTE = [
  "#f2f2f2",
  "#d9e1f2",
  "#fce4d6",
  "#e2f0d9",
  "#fff2cc",
  "#d9eaf7",
  "#e4dfec",
  "#fde9d9",

  "#d9d9d9",
  "#b4c6e7",
  "#f8cbad",
  "#c6e0b4",
  "#ffe699",
  "#bdd7ee",
  "#d9e2f3",
  "#f4b183",

  "#bfbfbf",
  "#8ea9db",
  "#f4b084",
  "#a9d18e",
  "#ffd966",
  "#9dc3e6",
  "#b4c6e7",
  "#ed7d31",

  "#7f7f7f",
  "#4472c4",
  "#c65911",
  "#70ad47",
  "#bf9000",
  "#5b9bd5",
  "#8064a2",
  "#c55a11",

  "#3f3f3f",
  "#2f5597",
  "#843c0c",
  "#548235",
  "#806000",
  "#2e75b6",
  "#5b9bd5",
  "#833c0c",
];

function ColorPicker({
  value = "#000000",
  onChange,
  label = "Fill",
  allowNoColor = false,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [customColor, setCustomColor] =
    useState(value);

  const pickerRef = useRef(null);

  useEffect(() => {
    setCustomColor(value || "#000000");
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const selectColor = (color) => {
    onChange?.(color);

    setCustomColor(color);

    setIsOpen(false);
  };

  return (
    <div
      className="color-picker"
      ref={pickerRef}
    >
      <button
        type="button"
        className="color-picker-trigger"
        onClick={() =>
          setIsOpen((current) => !current)
        }
      >
        <span className="color-picker-label">
          {label}
        </span>

        <span className="color-picker-value">
          <span
            className="color-preview"
            style={{
              backgroundColor:
                value || "transparent",
            }}
          />

          <span className="color-hex">
            {value || "No Fill"}
          </span>

          <span className="color-arrow">
            ▾
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="color-picker-popup">
          {allowNoColor && (
            <button
              type="button"
              className="no-fill-button"
              onClick={() =>
                selectColor("transparent")
              }
            >
              <span className="no-fill-icon">
                ╱
              </span>

              No Fill
            </button>
          )}

          <div className="color-section-title">
            Theme Colors
          </div>

          <div className="theme-color-grid">
            {THEME_COLORS.map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  className="color-swatch"
                  style={{
                    backgroundColor: color,
                  }}
                  title={color}
                  onClick={() =>
                    selectColor(color)
                  }
                />
              )
            )}
          </div>

          <div className="color-shade-grid">
            {COLOR_PALETTE.map(
              (color, index) => (
                <button
                  key={`${color}-${index}`}
                  type="button"
                  className="color-swatch"
                  style={{
                    backgroundColor: color,
                  }}
                  title={color}
                  onClick={() =>
                    selectColor(color)
                  }
                />
              )
            )}
          </div>

          <div className="color-section-title">
            Standard Colors
          </div>

          <div className="theme-color-grid">
            {STANDARD_COLORS.map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  className="color-swatch"
                  style={{
                    backgroundColor: color,
                  }}
                  title={color}
                  onClick={() =>
                    selectColor(color)
                  }
                />
              )
            )}
          </div>

          <div className="custom-color-section">
            <label>
              Custom Color
            </label>

            <div className="custom-color-row">
              <input
                type="color"
                value={
                  customColor === "transparent"
                    ? "#000000"
                    : customColor
                }
                onChange={(event) => {
                  setCustomColor(
                    event.target.value
                  );
                }}
              />

              <input
                type="text"
                value={customColor}
                onChange={(event) =>
                  setCustomColor(
                    event.target.value
                  )
                }
                placeholder="#000000"
              />

              <button
                type="button"
                onClick={() =>
                  selectColor(customColor)
                }
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;