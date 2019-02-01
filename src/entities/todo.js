const TODOItem = require('./todo_item');

class Todo {
  constructor(id, title, description, items = [], initialID = 0) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.items = items;
    this.latestItemID = initialID;
  }

  static parse(todoListData) {
    const { id, title, description, items, latestItemID } = todoListData;
    const todoItems = items.map(TODOItem.parse);
    return new Todo(id, title, description, todoItems, latestItemID);
  }

  addItem(content) {
    this.latestItemID = this.latestItemID + 1;
    const todoItem = new TODOItem(this.latestItemID, content, false);
    this.items.push(todoItem);
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  setDescription(description) {
    this.description = description;
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

  getItemById(itemid) {
    return this.items.find(item => item.getId() == itemid);
  }

  deleteItem(itemid) {
    this.items = this.items.filter(item => item.id != itemid);
  }
}

module.exports = Todo;
