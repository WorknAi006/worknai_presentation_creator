function HomeRibbon({
  selectedObject,
  onUpdateObject,
  onCopy,
  onCut,
  onPaste,
  onDuplicate,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
}) {
  const isText =
    selectedObject?.type === "textbox";

  const update = (property, value) => {
    onUpdateObject?.(
      property,
      value
    );
  };

  return (
    <div className="home-ribbon">
      <RibbonGroup title="Clipboard">
        <RibbonButton
          icon="📋"
          label="Paste"
          onClick={onPaste}
        />

        <RibbonButton
          icon="✂"
          label="Cut"
          onClick={onCut}
        />

        <RibbonButton
          icon="⧉"
          label="Copy"
          onClick={onCopy}
        />

        <RibbonButton
          icon="⧉"
          label="Duplicate"
          onClick={onDuplicate}
        />
      </RibbonGroup>

      <RibbonGroup title="Font">
        <select
          className="home-font-select"
          value={
            selectedObject?.fontFamily ||
            "Arial"
          }
          disabled={!isText}
          onChange={(event) =>
            update(
              "fontFamily",
              event.target.value
            )
          }
        >
          <option value="Arial">
            Arial
          </option>

          <option value="Calibri">
            Calibri
          </option>

          <option value="Times New Roman">
            Times New Roman
          </option>

          <option value="Georgia">
            Georgia
          </option>

          <option value="Verdana">
            Verdana
          </option>

          <option value="Tahoma">
            Tahoma
          </option>

          <option value="Courier New">
            Courier New
          </option>
        </select>

        <input
          className="home-font-size"
          type="number"
          min="1"
          max="500"
          value={
            selectedObject?.fontSize ||
            32
          }
          disabled={!isText}
          onChange={(event) =>
            update(
              "fontSize",
              Number(
                event.target.value
              )
            )
          }
        />

        <div className="home-format-buttons">
          <button
            type="button"
            className={
              selectedObject?.fontWeight ===
              "bold"
                ? "active"
                : ""
            }
            disabled={!isText}
            onClick={() =>
              update(
                "fontWeight",
                selectedObject
                  ?.fontWeight === "bold"
                  ? "normal"
                  : "bold"
              )
            }
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            className={
              selectedObject?.fontStyle ===
              "italic"
                ? "active"
                : ""
            }
            disabled={!isText}
            onClick={() =>
              update(
                "fontStyle",
                selectedObject
                  ?.fontStyle === "italic"
                  ? "normal"
                  : "italic"
              )
            }
          >
            <em>I</em>
          </button>

          <button
            type="button"
            className={
              selectedObject?.underline
                ? "active"
                : ""
            }
            disabled={!isText}
            onClick={() =>
              update(
                "underline",
                !selectedObject?.underline
              )
            }
          >
            <u>U</u>
          </button>

          <button
            type="button"
            className={
              selectedObject?.linethrough
                ? "active"
                : ""
            }
            disabled={!isText}
            onClick={() =>
              update(
                "linethrough",
                !selectedObject
                  ?.linethrough
              )
            }
          >
            <s>S</s>
          </button>
        </div>

        <input
          type="color"
          className="home-color-input"
          value={
            selectedObject?.fill &&
            selectedObject.fill !==
              "transparent"
              ? selectedObject.fill
              : "#000000"
          }
          disabled={!selectedObject}
          onChange={(event) =>
            update(
              "fill",
              event.target.value
            )
          }
          title="Fill / Text Color"
        />
      </RibbonGroup>

      <RibbonGroup title="Paragraph">
        <RibbonButton
          label="Left"
          disabled={!isText}
          active={
            selectedObject?.textAlign ===
            "left"
          }
          onClick={() =>
            update(
              "textAlign",
              "left"
            )
          }
        />

        <RibbonButton
          label="Center"
          disabled={!isText}
          active={
            selectedObject?.textAlign ===
            "center"
          }
          onClick={() =>
            update(
              "textAlign",
              "center"
            )
          }
        />

        <RibbonButton
          label="Right"
          disabled={!isText}
          active={
            selectedObject?.textAlign ===
            "right"
          }
          onClick={() =>
            update(
              "textAlign",
              "right"
            )
          }
        />

        <RibbonButton
          label="Justify"
          disabled={!isText}
          active={
            selectedObject?.textAlign ===
            "justify"
          }
          onClick={() =>
            update(
              "textAlign",
              "justify"
            )
          }
        />
      </RibbonGroup>

      <RibbonGroup title="Arrange">
        <RibbonButton
          label="Bring Front"
          disabled={!selectedObject}
          onClick={onBringToFront}
        />

        <RibbonButton
          label="Forward"
          disabled={!selectedObject}
          onClick={onBringForward}
        />

        <RibbonButton
          label="Backward"
          disabled={!selectedObject}
          onClick={onSendBackward}
        />

        <RibbonButton
          label="Send Back"
          disabled={!selectedObject}
          onClick={onSendToBack}
        />
      </RibbonGroup>
    </div>
  );
}

function RibbonGroup({
  title,
  children,
}) {
  return (
    <div className="home-ribbon-group">
      <div className="home-ribbon-content">
        {children}
      </div>

      <div className="home-ribbon-title">
        {title}
      </div>
    </div>
  );
}

function RibbonButton({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "home-ribbon-button active"
          : "home-ribbon-button"
      }
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <span className="home-ribbon-icon">
          {icon}
        </span>
      )}

      <span>{label}</span>
    </button>
  );
}

export default HomeRibbon;