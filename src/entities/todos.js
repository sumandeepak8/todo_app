const Todo = require('./todo');

class Todos {
  constructor(lists, initialID) {
    this.lists = lists;
    this.latestListID = initialID;
  }

  static parse({ lists, latestListID }) {
    const todos = lists.map(Todo.parse);
    return new Todos(todos, latestListID);
  }

  addTodo(title, description) {
    this.latestListID = this.latestListID + 1;
    const todoList = new Todo(this.latestListID, title, description, [], 0);
    this.lists.push(todoList);
  }

  getTodos() {
    return this.lists;
  }

  getListByID(id) {
    return this.lists.find(list => list.getId() == id);
  }

  deleteListByID(id) {
    this.lists = this.lists.filter(list => list.id != id);
  }
}

module.exports = Todos;
