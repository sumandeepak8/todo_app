const TODOList = require('./todo_list');

class TODOLists {
  constructor(lists) {
    this.lists = lists;
  }

  static parse(todoListsData) {
    const todoLists = todoListsData.map(TODOList.parse);
    return new TODOLists(todoLists);
  }

  addTODOList(list) {
    this.lists.push(list);
  }

  getTODOLists() {
    return this.lists;
  }
}

module.exports = TODOLists;
