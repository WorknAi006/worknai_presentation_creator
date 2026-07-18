import { useEffect, useState } from "react";
function FileBackstage({
  onBack,
  onNew,
  onSave,
  onSaveAs,
  onOpenPresentation,
  onExport,
}) {
    const [presentations, setPresentations] = useState([]);
const [loading, setLoading] = useState(true);

const [selectedMenu, setSelectedMenu] =
  useState("Home");

useEffect(() => {
  const loadPresentations = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/presentations/"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch presentations"
        );
      }

      const data = await response.json();

      setPresentations(data);
    } catch (error) {
      console.error(
        "Recent presentations failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadPresentations();
}, []);
  return (
    <div className="file-backstage">
      {/* LEFT SIDEBAR */}

      <aside className="file-backstage-sidebar">
        <button
          type="button"
          className="file-back-button"
          onClick={onBack}
          title="Back"
        >
          ←
        </button>

        <nav className="file-backstage-nav">
         <button
type="button"
className={
selectedMenu==="Home"
?"active":""
}
onClick={()=>
setSelectedMenu("Home")
}
>
Home
</button>

<button
type="button"
className={
selectedMenu==="New"
?"active":""
}
onClick={()=>{
setSelectedMenu("New");
onNew();
}}
>
New
</button>

          <button
type="button"
className={
selectedMenu==="Open"
?"active":""
}
onClick={()=>
setSelectedMenu("Open")
}
>
Open
</button>

          <div className="file-menu-divider" />

          <button type="button">
            Info
          </button>

          <button
  type="button"
  onClick={onSave}
>
  Save
</button>

          <button
  type="button"
  onClick={onSaveAs}
>
  Save As
</button>

          <button type="button">
            History
          </button>

          <button type="button">
            Print
          </button>

          <button type="button">
            Share
          </button>
<button
  type="button"
  className={
    selectedMenu === "Export"
      ? "active"
      : ""
  }
  onClick={() =>
    setSelectedMenu("Export")
  }
>
  Export
</button>
        
        </nav>

        <div className="file-backstage-bottom">
          <button type="button">
            Account
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="file-backstage-content">
        {selectedMenu === "Home" && (
          <>

        <h1>
          Welcome to WorknAI Presentation
        </h1>

        {/* NEW / THEMES */}

        <section className="backstage-section">
          <h2>New</h2>

          <div className="theme-row">

            <button
              type="button"
              className="theme-card"
            >
              <div className="theme-preview theme-placeholder">
                Theme
              </div>

              <span>
                WorknAI Business
              </span>
            </button>

            <button
              type="button"
              className="theme-card"
            >
              <div className="theme-preview theme-placeholder">
                Theme
              </div>

              <span>
                Professional
              </span>
            </button>

            <button
              type="button"
              className="theme-card"
            >
              <div className="theme-preview theme-placeholder">
                Theme
              </div>

              <span>
                Modern
              </span>
            </button>
          </div>

          <div className="more-themes-row">
            <button type="button">
              More themes →
            </button>
          </div>
        </section>

        {/* RECENT */}

        <section className="backstage-section recent-section">
          <div className="recent-tabs">
            <button
              type="button"
              className="active"
            >
              Recent
            </button>

            <button type="button">
              Favourites
            </button>
          </div>

          <div className="recent-table-header">
            <span>Name</span>
            <span>Date modified</span>
          </div>

          {loading ? (
  <div className="recent-empty">
    Loading presentations...
  </div>
) : presentations.length === 0 ? (
  <div className="recent-empty">
    No recent presentations found.
  </div>
) : (
  <div className="recent-presentations-list">
    {presentations.map(
      (presentation) => (
        <div
  key={presentation._id}
  className="recent-presentation-item"
  onClick={() =>
    onOpenPresentation?.(presentation)
  }
>
          <span>
            {presentation.title}
          </span>

          <span>
            {presentation.updated_at
              ? new Date(
                  presentation.updated_at
                ).toLocaleDateString()
              : "-"}
          </span>
        </div>
      )
    )}
  </div>
)}
        </section>
        </>
        )}
        {selectedMenu === "Open" && (
  <div className="open-presentation-screen">
    <h1>Open</h1>

    <h2>Recent Presentations</h2>

    {loading ? (
      <div className="recent-empty">
        Loading presentations...
      </div>
    ) : presentations.length === 0 ? (
      <div className="recent-empty">
        No presentations found.
      </div>
    ) : (
      <div className="open-presentation-list">
        {presentations.map(
          (presentation) => (
            <button
              type="button"
              key={presentation._id}
              className="open-presentation-item"
              onClick={() =>
                onOpenPresentation?.(
                  presentation
                )
              }
            >
              <span>
                {presentation.title}
              </span>

              <span>
                {presentation.updated_at
                  ? new Date(
                      presentation.updated_at
                    ).toLocaleDateString()
                  : "-"}
              </span>
            </button>
          )
        )}
      </div>
    )}
  </div>
)}

{selectedMenu === "Export" && (
  <div className="export-screen">
    <h1>Export</h1>

    <p>
      Download your presentation in your preferred format.
    </p>

    <div className="export-options">
      <button
  type="button"
  className="export-option"
  onClick={() => onExport?.("pptx")}
>
  <strong>PowerPoint Presentation</strong>
  <span>Download as .pptx</span>
</button>

      <button
        type="button"
        onClick={() => onExport?.("ppt")}
      >
        <strong>Download as</strong>
        <span>ppt</span>
      </button>

      <button
        type="button"
        onClick={() => onExport?.("pdf")}
      >
        <strong>Download </strong>
        <span>pdf</span>
      </button>
    </div>
  </div>
)}
      </main>
    </div>
  );
}

export default FileBackstage;