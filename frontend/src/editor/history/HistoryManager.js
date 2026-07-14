class HistoryManager {
  constructor(limit = 100) {
    this.undoStack = [];
    this.redoStack = [];

    this.limit = limit;
  }

  push(snapshot) {
    if (!snapshot) {
      return;
    }

    const lastSnapshot =
      this.undoStack[
        this.undoStack.length - 1
      ];

    if (lastSnapshot === snapshot) {
      return;
    }

    this.undoStack.push(snapshot);

    if (
      this.undoStack.length > this.limit
    ) {
      this.undoStack.shift();
    }

    this.redoStack = [];
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  undo() {
    if (!this.canUndo()) {
      return null;
    }

    const currentSnapshot =
      this.undoStack.pop();

    this.redoStack.push(
      currentSnapshot
    );

    return this.undoStack[
      this.undoStack.length - 1
    ];
  }

  redo() {
    if (!this.canRedo()) {
      return null;
    }

    const snapshot =
      this.redoStack.pop();

    this.undoStack.push(snapshot);

    return snapshot;
  }

  reset(snapshot = null) {
    this.undoStack = [];
    this.redoStack = [];

    if (snapshot) {
      this.undoStack.push(snapshot);
    }
  }

  getState() {
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }
}

export default HistoryManager;