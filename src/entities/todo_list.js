const TODOItem = require('./todo_item');

class TODOList {
  constructor(id, title, description, items) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.items = items;
  }

  static parse(todoListData) {
    const { id, title, description, items } = todoListData;
    const todoItems = items.map(TODOItem.parse);
    return new TODOList(id, title, description, todoItems);
  }

  addItem(item) {
    this.items.push(item);
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getId() {
    return this.id;
  }

  getItems() {
    return this.items;
  }
}

module.exports = TODOList;
