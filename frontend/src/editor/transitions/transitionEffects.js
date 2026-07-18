export const transitionCategories = {
  subtle: [
    { id: "none", name: "None", icon: "🚫" },
    { id: "morph", name: "Morph", icon: "🌀" },
    { id: "fade", name: "Fade", icon: "🌫️" },
    { id: "push", name: "Push", icon: "➡️", directions: ["left", "right", "top", "bottom"] },
    { id: "wipe", name: "Wipe", icon: "🧹", directions: ["left", "right", "top", "bottom"] },
    { id: "split", name: "Split", icon: "✂️", directions: ["vertical-in", "vertical-out", "horizontal-in", "horizontal-out"] },
    { id: "reveal", name: "Reveal", icon: "👁️" },
    { id: "cut", name: "Cut", icon: "✀" },
    { id: "random-bars", name: "Random Bars", icon: "▤" },
    { id: "shape", name: "Shape", icon: "◯" },
    { id: "uncover", name: "Uncover", icon: "📁" },
    { id: "cover", name: "Cover", icon: "📂" },
    { id: "flash", name: "Flash", icon: "⚡" }
  ],
  exciting: [
    { id: "fall-over", name: "Fall Over", icon: "📉" },
    { id: "drape", name: "Drape", icon: "🎪" },
    { id: "curtains", name: "Curtains", icon: "🎭" },
    { id: "wind", name: "Wind", icon: "💨" },
    { id: "prestige", name: "Prestige", icon: "✨" },
    { id: "fracture", name: "Fracture", icon: "💥" },
    { id: "crush", name: "Crush", icon: "🗑️" },
    { id: "peel-off", name: "Peel Off", icon: "🍌" },
    { id: "page-curl", name: "Page Curl", icon: "📄" },
    { id: "aeroplane", name: "Aeroplane", icon: "✈️" },
    { id: "origami", name: "Origami", icon: "🐦" },
    { id: "dissolve", name: "Dissolve", icon: "🌫️" },
    { id: "checkerboard", name: "Checkerboard", icon: "🏁" },
    { id: "blinds", name: "Blinds", icon: "▤" },
    { id: "clock", name: "Clock", icon: "🕒" },
    { id: "ripple", name: "Ripple", icon: "🌊" },
    { id: "honeycomb", name: "Honeycomb", icon: "🍯" },
    { id: "glitter", name: "Glitter", icon: "❇️" },
    { id: "vortex", name: "Vortex", icon: "🌀" },
    { id: "shred", name: "Shred", icon: "✂️" },
    { id: "switch", name: "Switch", icon: "🎛️" },
    { id: "flip", name: "Flip", icon: "🔁" },
    { id: "gallery", name: "Gallery", icon: "🖼️" },
    { id: "cube", name: "Cube", icon: "📦" },
    { id: "doors", name: "Doors", icon: "🚪", directions: ["horizontal", "vertical"] },
    { id: "box", name: "Box", icon: "📥", directions: ["in", "out"] },
    { id: "comb", name: "Comb", icon: "💈" },
    { id: "zoom", name: "Zoom", icon: "🔍", directions: ["in", "out"] },
    { id: "random", name: "Random", icon: "🔀" }
  ],
  dynamic: [
    { id: "pan", name: "Pan", icon: "↔️", directions: ["left", "right", "top", "bottom"] },
    { id: "ferris-wheel", name: "Ferris Wheel", icon: "🎡" },
    { id: "conveyor", name: "Conveyor", icon: "🚜" },
    { id: "rotate", name: "Rotate", icon: "🔄", directions: ["clockwise", "counterclockwise"] },
    { id: "window", name: "Window", icon: "🔲" },
    { id: "orbit", name: "Orbit", icon: "🌍" },
    { id: "fly-through", name: "Fly Through", icon: "🚀" }
  ]
};

export const getTransitionConfig = (id) => {
  const allTransitions = [
    ...transitionCategories.subtle,
    ...transitionCategories.exciting,
    ...transitionCategories.dynamic
  ];
  return allTransitions.find(t => t.id === id) || null;
};
