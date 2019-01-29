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

  toggleStatus() {
    this.done = !this.done;
  }

  getContent() {
    return this.content;
  }

  setContent(content) {
    this.content = content;
  }

  isDone() {
    return this.done;
  }

  getId() {
    return this.id;
  }
}

module.exports = TODOItem;
