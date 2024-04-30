// simple Sum type for chainRec
export const Next = value => ({ isDone: false, value });
export const Done = value => ({ isDone: true, value });
