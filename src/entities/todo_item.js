class TODOItem {
  constructor(id, content, done) {
    this.id = id;
    this.content = content;
    this.done = done;
  }

  static parse(todoItemData) {
    const { id, content, done } = todoItemData;
    return new TODOItem(id, content, done);
  }

  MarkAsDone() {
    this.done = true;
  }

  MarkAsUndone() {
    this.done = false;
  }

  getContent() {
    return this.content;
  }

  isDone() {
    return this.done;
  }

  getId() {
    return this.id;
  }
}

module.exports = TODOItem;
