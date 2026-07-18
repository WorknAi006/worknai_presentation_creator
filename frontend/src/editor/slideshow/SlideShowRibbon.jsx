function SlideShowRibbon({
  onFromBeginning,
}) {
  return (
    <div
      style={{
        height: 100,
        background: "#f3f3f3",
        padding: 20,
      }}
    >
      <button
        onClick={onFromBeginning}
      >
        From Beginning
      </button>
    </div>
  );
}

export default SlideShowRibbon;