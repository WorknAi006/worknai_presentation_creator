import { generateId } from "./generateId";

export const createElement = (type, properties = {}) => {
  return {
    id: generateId(),
    type,

    x: 100,
    y: 100,
    width: type === "text" ? 300 : 200,
    height: type === "text" ? 60 : 150,

    rotation: 0,
    zIndex: 1,

    locked: false,
    visible: true,

    properties: {
      ...properties,
    },
  };
};