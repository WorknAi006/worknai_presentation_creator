const tabs = [
  "File",
  "Home",
  "Insert",
  "Draw",
  "Design",
  "Transitions",
  "Animations",
  "Slide Show",
  "Record",
  "Review",
  "View",
];

function TopToolbar({
  activeTab,
  onTabChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  return (
    <header className="top-toolbar">
      <div className="toolbar-brand">
        <div className="brand-logo">
          W
        </div>

        <span className="brand-name">
          WorknAI Presentation
        </span>
      </div>

      <nav className="toolbar-menu">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              activeTab === tab
                ? "toolbar-tab active"
                : "toolbar-tab"
            }
            onClick={() =>
              onTabChange(tab)
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="toolbar-actions">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>

        <button className="present-button">
          Present
        </button>
      </div>
    </header>
  );
}

export default TopToolbar;