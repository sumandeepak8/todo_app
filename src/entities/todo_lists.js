const TODOList = require('./todo_list');

class TODOLists {
  constructor(lists, initialID) {
    this.lists = lists;
    this.latestListID = initialID;
  }

  static parse({ lists, latestListID }) {
    const todoLists = lists.map(TODOList.parse);
    return new TODOLists(todoLists, latestListID);
  }

  addTODOList(title, description) {
    this.latestListID = this.latestListID + 1;
    const todoList = new TODOList(this.latestListID, title, description, [], 0);
    this.lists.push(todoList);
  }

  getTODOLists() {
    return this.lists;
  }

  getListByID(id) {
    return this.lists.find(list => list.getId() == id);
  }

  deleteListByID(id) {
    this.lists = this.lists.filter(list => list.id != id);
  }
}

module.exports = TODOLists;
