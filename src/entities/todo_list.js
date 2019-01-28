const TODOItem = require('./todo_item');

class TODOList {
  constructor(id, title, description, items, initialID) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.items = items;
    this.latestItemID = initialID;
  }

  static parse(todoListData) {
    const { id, title, description, items, latestItemID } = todoListData;
    const todoItems = items.map(TODOItem.parse);
    return new TODOList(id, title, description, todoItems, latestItemID);
  }

  addItem(content, done) {
    this.latestItemID = this.latestItemID + 1;
    const todoItem = new TODOItem(this.latestItemID, content, done);
    this.items.push(todoItem);
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

  deleteItem(itemid) {
    this.items = this.items.filter(item => item.id != itemid);
  }
}

module.exports = TODOList;
