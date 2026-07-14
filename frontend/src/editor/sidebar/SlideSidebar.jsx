function SlideSidebar({
  slides,
  activeSlideId,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
}) {
  return (
    <aside className="slide-sidebar">
      <div className="slide-sidebar-header">
        <span>Slides</span>

        <button
          type="button"
          className="add-slide-button"
          onClick={onAddSlide}
          title="New Slide"
        >
          +
        </button>
      </div>

      <div className="slide-list">
        {slides.map((slide, index) => {
          const isActive =
            slide.id === activeSlideId;

          return (
            <div
              key={slide.id}
              className={
                isActive
                  ? "slide-item active"
                  : "slide-item"
              }
              onClick={() =>
                onSelectSlide(slide.id)
              }
            >
              <div className="slide-number">
                {index + 1}
              </div>

              <div className="slide-thumbnail">
                <div className="slide-thumbnail-paper">
                  {slide.preview ? (
                    <img
                      src={slide.preview}
                      alt={`Slide ${
                        index + 1
                      } preview`}
                      className="slide-preview-image"
                      draggable={false}
                    />
                  ) : null}
                </div>
              </div>

              {isActive && (
                <div
                  className="slide-item-actions"
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  <button
                    type="button"
                    title="Duplicate Slide"
                    onClick={() =>
                      onDuplicateSlide(
                        slide.id
                      )
                    }
                  >
                    ⧉
                  </button>

                  <button
                    type="button"
                    title="Delete Slide"
                    onClick={() =>
                      onDeleteSlide(
                        slide.id
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default SlideSidebar;