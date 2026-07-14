const createSlideId = () => {
  return `slide-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const createBlankCanvasState = () => {
  return {
    version: "6.0.0",

    objects: [],

    background: "#ffffff",
  };
};

export const createBlankSlide = () => {
  return {
    id: createSlideId(),

    name: "Untitled Slide",

    canvasJSON: createBlankCanvasState(),

    preview: null,
  };
};

export const duplicateSlide = (slide) => {
  if (!slide) {
    return createBlankSlide();
  }

  return {
    ...slide,

    id: createSlideId(),

    name: `${slide.name} Copy`,

    canvasJSON: JSON.parse(
      JSON.stringify(slide.canvasJSON)
    ),

    preview: slide.preview || null,
  };
};