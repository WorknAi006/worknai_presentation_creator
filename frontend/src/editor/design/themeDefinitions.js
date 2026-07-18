export const themeDefinitions = [
  {
    id: "office",
    name: "Office",
    fonts: { heading: "Calibri", body: "Calibri" },
    colors: { bg: "#ffffff", text: "#000000", primary: "#4472c4", accent1: "#ed7d31", accent2: "#a5a5a5", accent3: "#ffc000" },
    variants: [
      { name: "Light", bg: "#ffffff", text: "#000000", primary: "#4472c4", accent1: "#ed7d31" },
      { name: "Dark", bg: "#262626", text: "#ffffff", primary: "#2f5597", accent1: "#c55a11" },
      { name: "Blue", bg: "#e9eef4", text: "#1f4e79", primary: "#2f5597", accent1: "#ed7d31" },
      { name: "Green", bg: "#ebf1e2", text: "#375623", primary: "#548235", accent1: "#ed7d31" },
      { name: "Orange", bg: "#fce4d6", text: "#c65911", primary: "#c55a11", accent1: "#2f5597" },
      { name: "Purple", bg: "#f2edf9", text: "#6015a1", primary: "#7030a0", accent1: "#ed7d31" },
      { name: "Monochrome", bg: "#f2f2f2", text: "#333333", primary: "#595959", accent1: "#7f7f7f" }
    ]
  },
  {
    id: "facet",
    name: "Facet",
    fonts: { heading: "Trebuchet MS", body: "Arial" },
    colors: { bg: "#f2f4f7", text: "#2c3e50", primary: "#16a085", accent1: "#e67e22", accent2: "#bdc3c7", accent3: "#2980b9" },
    variants: [
      { name: "Light", bg: "#f2f4f7", text: "#2c3e50", primary: "#16a085", accent1: "#e67e22" },
      { name: "Dark", bg: "#1a252f", text: "#ecf0f1", primary: "#1abc9c", accent1: "#f39c12" },
      { name: "Blue", bg: "#eef2f7", text: "#1a252f", primary: "#2980b9", accent1: "#e67e22" },
      { name: "Green", bg: "#edf5e1", text: "#05386b", primary: "#5cdb95", accent1: "#379683" }
    ]
  },
  {
    id: "integral",
    name: "Integral",
    fonts: { heading: "Georgia", body: "Garamond" },
    colors: { bg: "#faf8f5", text: "#4a3c31", primary: "#c0392b", accent1: "#d35400", accent2: "#f39c12", accent3: "#7f8c8d" },
    variants: [
      { name: "Light", bg: "#faf8f5", text: "#4a3c31", primary: "#c0392b", accent1: "#d35400" },
      { name: "Dark", bg: "#2c2c2c", text: "#f5f5f5", primary: "#e74c3c", accent1: "#e67e22" }
    ]
  },
  {
    id: "ion",
    name: "Ion",
    fonts: { heading: "Century Gothic", body: "Century Gothic" },
    colors: { bg: "#f5f7fa", text: "#333333", primary: "#00b4d8", accent1: "#0077b6", accent2: "#90e0ef", accent3: "#caf0f8" },
    variants: [
      { name: "Light", bg: "#f5f7fa", text: "#333333", primary: "#00b4d8", accent1: "#0077b6" },
      { name: "Dark", bg: "#03045e", text: "#ffffff", primary: "#90e0ef", accent1: "#00b4d8" }
    ]
  },
  {
    id: "slice",
    name: "Slice",
    fonts: { heading: "Impact", body: "Arial Black" },
    colors: { bg: "#ffffff", text: "#111111", primary: "#e84393", accent1: "#fdcb6e", accent2: "#ffeaa7", accent3: "#6c5ce7" },
    variants: [
      { name: "Light", bg: "#ffffff", text: "#111111", primary: "#e84393", accent1: "#fdcb6e" },
      { name: "Dark", bg: "#2d3436", text: "#ffffff", primary: "#fd79a8", accent1: "#ffeaa7" }
    ]
  },
  {
    id: "retrospect",
    name: "Retrospect",
    fonts: { heading: "Courier New", body: "Courier New" },
    colors: { bg: "#f4efe6", text: "#2e2528", primary: "#d2b48c", accent1: "#8b4513", accent2: "#cd853f", accent3: "#deb887" },
    variants: [
      { name: "Light", bg: "#f4efe6", text: "#2e2528", primary: "#d2b48c", accent1: "#8b4513" },
      { name: "Dark", bg: "#1e1a1b", text: "#f4efe6", primary: "#8b4513", accent1: "#cd853f" }
    ]
  },
  {
    id: "gallery",
    name: "Gallery",
    fonts: { heading: "Palatino", body: "Book Antiqua" },
    colors: { bg: "#fdfefe", text: "#1b2631", primary: "#7d6608", accent1: "#b7950b", accent2: "#f4d03f", accent3: "#7d6608" },
    variants: [
      { name: "Light", bg: "#fdfefe", text: "#1b2631", primary: "#7d6608", accent1: "#b7950b" },
      { name: "Dark", bg: "#151b26", text: "#fdfefe", primary: "#b7950b", accent1: "#f4d03f" }
    ]
  },
  {
    id: "madison",
    name: "Madison",
    fonts: { heading: "Arial", body: "Arial" },
    colors: { bg: "#f4f6f9", text: "#212529", primary: "#007bff", accent1: "#6c757d", accent2: "#28a745", accent3: "#dc3545" },
    variants: [
      { name: "Light", bg: "#f4f6f9", text: "#212529", primary: "#007bff", accent1: "#6c757d" },
      { name: "Dark", bg: "#343a40", text: "#f8f9fa", primary: "#3b5998", accent1: "#adb5bd" }
    ]
  },
  {
    id: "berlin",
    name: "Berlin",
    fonts: { heading: "Franklin Gothic Medium", body: "Calibri" },
    colors: { bg: "#f9f9f9", text: "#1a1a1a", primary: "#ff4d4d", accent1: "#ffa3a3", accent2: "#333333", accent3: "#888888" },
    variants: [
      { name: "Light", bg: "#f9f9f9", text: "#1a1a1a", primary: "#ff4d4d", accent1: "#ffa3a3" },
      { name: "Dark", bg: "#121212", text: "#f9f9f9", primary: "#ff4d4d", accent1: "#ffa3a3" }
    ]
  },
  {
    id: "wood-type",
    name: "Wood Type",
    fonts: { heading: "Copperplate", body: "Times New Roman" },
    colors: { bg: "#faf4eb", text: "#5c3d2e", primary: "#865439", accent1: "#c68b59", accent2: "#d7a86e", accent3: "#faf4eb" },
    variants: [
      { name: "Light", bg: "#faf4eb", text: "#5c3d2e", primary: "#865439", accent1: "#c68b59" },
      { name: "Dark", bg: "#3d2e25", text: "#faf4eb", primary: "#c68b59", accent1: "#d7a86e" }
    ]
  },
  {
    id: "wisp",
    name: "Wisp",
    fonts: { heading: "Lucida Sans Unicode", body: "Lucida Grande" },
    colors: { bg: "#f5fdfb", text: "#2c3e3a", primary: "#20b2aa", accent1: "#afeeee", accent2: "#e0eeee", accent3: "#7fffd4" },
    variants: [
      { name: "Light", bg: "#f5fdfb", text: "#2c3e3a", primary: "#20b2aa", accent1: "#afeeee" },
      { name: "Dark", bg: "#1f2a28", text: "#f5fdfb", primary: "#afeeee", accent1: "#20b2aa" }
    ]
  },
  {
    id: "frame",
    name: "Frame",
    fonts: { heading: "Garamond", body: "Garamond" },
    colors: { bg: "#ffffff", text: "#2b2b2b", primary: "#3e2723", accent1: "#d7ccc8", accent2: "#8d6e63", accent3: "#4e342e" },
    variants: [
      { name: "Light", bg: "#ffffff", text: "#2b2b2b", primary: "#3e2723", accent1: "#d7ccc8" },
      { name: "Dark", bg: "#1c0d0a", text: "#ffffff", primary: "#d7ccc8", accent1: "#8d6e63" }
    ]
  },
  {
    id: "parcel",
    name: "Parcel",
    fonts: { heading: "Consolas", body: "Lucida Console" },
    colors: { bg: "#fbfcfc", text: "#2e4053", primary: "#f39c12", accent1: "#e67e22", accent2: "#d35400", accent3: "#f5b041" },
    variants: [
      { name: "Light", bg: "#fbfcfc", text: "#2e4053", primary: "#f39c12", accent1: "#e67e22" },
      { name: "Dark", bg: "#212f3d", text: "#fbfcfc", primary: "#f5b041", accent1: "#f39c12" }
    ]
  },
  {
    id: "organic",
    name: "Organic",
    fonts: { heading: "Palatino Linotype", body: "Georgia" },
    colors: { bg: "#f4f9f4", text: "#1b361b", primary: "#2e7d32", accent1: "#81c784", accent2: "#c8e6c9", accent3: "#4caf50" },
    variants: [
      { name: "Light", bg: "#f4f9f4", text: "#1b361b", primary: "#2e7d32", accent1: "#81c784" },
      { name: "Dark", bg: "#1b361b", text: "#f4f9f4", primary: "#81c784", accent1: "#2e7d32" }
    ]
  },
  {
    id: "celestial",
    name: "Celestial",
    fonts: { heading: "Georgia", body: "Verdana" },
    colors: { bg: "#f5f3fa", text: "#341f4b", primary: "#6a1b9a", accent1: "#ba68c8", accent2: "#e1bee7", accent3: "#8e24aa" },
    variants: [
      { name: "Light", bg: "#f5f3fa", text: "#341f4b", primary: "#6a1b9a", accent1: "#ba68c8" },
      { name: "Dark", bg: "#24113b", text: "#f5f3fa", primary: "#ba68c8", accent1: "#6a1b9a" }
    ]
  },
  {
    id: "breeze",
    name: "Breeze",
    fonts: { heading: "Segoe UI", body: "Segoe UI" },
    colors: { bg: "#f7f9fb", text: "#2f3e46", primary: "#3b82f6", accent1: "#60a5fa", accent2: "#93c5fd", accent3: "#1d4ed8" },
    variants: [
      { name: "Light", bg: "#f7f9fb", text: "#2f3e46", primary: "#3b82f6", accent1: "#60a5fa" },
      { name: "Dark", bg: "#1e293b", text: "#f7f9fb", primary: "#60a5fa", accent1: "#3b82f6" }
    ]
  },
  {
    id: "executive",
    name: "Executive",
    fonts: { heading: "Times New Roman", body: "Times New Roman" },
    colors: { bg: "#fdfefe", text: "#1c2833", primary: "#2c3e50", accent1: "#95a5a6", accent2: "#bdc3c7", accent3: "#2c3e50" },
    variants: [
      { name: "Light", bg: "#fdfefe", text: "#1c2833", primary: "#2c3e50", accent1: "#95a5a6" },
      { name: "Dark", bg: "#1c2833", text: "#fdfefe", primary: "#95a5a6", accent1: "#2c3e50" }
    ]
  },
  {
    id: "savon",
    name: "Savon",
    fonts: { heading: "Palatino", body: "Palatino" },
    colors: { bg: "#fdfaf7", text: "#3e2f1e", primary: "#8c6239", accent1: "#c69c6d", accent2: "#e5cbb2", accent3: "#8c6239" },
    variants: [
      { name: "Light", bg: "#fdfaf7", text: "#3e2f1e", primary: "#8c6239", accent1: "#c69c6d" },
      { name: "Dark", bg: "#2a1e12", text: "#fdfaf7", primary: "#c69c6d", accent1: "#e5cbb2" }
    ]
  },
  {
    id: "badge",
    name: "Badge",
    fonts: { heading: "Impact", body: "Calibri" },
    colors: { bg: "#ffffff", text: "#1b2631", primary: "#f1c40f", accent1: "#e67e22", accent2: "#e74c3c", accent3: "#2ecc71" },
    variants: [
      { name: "Light", bg: "#ffffff", text: "#1b2631", primary: "#f1c40f", accent1: "#e67e22" },
      { name: "Dark", bg: "#2c3e50", text: "#ffffff", primary: "#f1c40f", accent1: "#e67e22" }
    ]
  },
  {
    id: "aspect",
    name: "Aspect",
    fonts: { heading: "Segoe UI", body: "Arial" },
    colors: { bg: "#f9ebea", text: "#641e16", primary: "#c0392b", accent1: "#e74c3c", accent2: "#f5b7b1", accent3: "#922b21" },
    variants: [
      { name: "Light", bg: "#f9ebea", text: "#641e16", primary: "#c0392b", accent1: "#e74c3c" },
      { name: "Dark", bg: "#4a150e", text: "#f9ebea", primary: "#e74c3c", accent1: "#c0392b" }
    ]
  },
  {
    id: "atlas",
    name: "Atlas",
    fonts: { heading: "Century Gothic", body: "Arial" },
    colors: { bg: "#eaf2f8", text: "#1b4f72", primary: "#2980b9", accent1: "#5499c7", accent2: "#a9cce3", accent3: "#1a5276" },
    variants: [
      { name: "Light", bg: "#eaf2f8", text: "#1b4f72", primary: "#2980b9", accent1: "#5499c7" },
      { name: "Dark", bg: "#112e42", text: "#eaf2f8", primary: "#5499c7", accent1: "#2980b9" }
    ]
  },
  {
    id: "circuit",
    name: "Circuit",
    fonts: { heading: "Courier New", body: "Consolas" },
    colors: { bg: "#ebf5fb", text: "#154360", primary: "#2e86c1", accent1: "#3498db", accent2: "#85c1e9", accent3: "#1b4f72" },
    variants: [
      { name: "Light", bg: "#ebf5fb", text: "#154360", primary: "#2e86c1", accent1: "#3498db" },
      { name: "Dark", bg: "#0d2636", text: "#ebf5fb", primary: "#3498db", accent1: "#2e86c1" }
    ]
  }
];
export default themeDefinitions;
