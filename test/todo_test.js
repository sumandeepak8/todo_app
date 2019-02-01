const Todo = require('../src/entities/todo');
const TODOItem = require('../src/entities/todo_item');
const expect = require('chai').expect;

describe('Todo', function() {
  const item1 = new TODOItem(1, 'one', false);
  const item2 = new TODOItem(2, 'two', false);
  const item3 = new TODOItem(3, 'three', false);

  it('addItem : should add new item to TODO List', function() {
    const todoList = new Todo(
      1,
      'first list',
      'this contains a list of two items',
      [item1, item2]
    );
    todoList.addItem(item3);
    expect(todoList.getItems()).to.have.lengthOf(3);
  });

  it('parse: should return new todo list given raw todo list data', function() {
    const todoListData = {
      id: 1,
      title: 'title',
      description: 'this is a list',
      items: [
        { id: 1, content: 'one', done: false },
        { id: 2, content: 'two', done: false }
      ]
    };
    const todoList = Todo.parse(todoListData);
    expect(todoList).to.be.a.instanceOf(Todo);
  });

  it('getItemById: should return a todo item of specified id', function() {
    const items = [item1, item2, item3];
    const todoList = new Todo(1, 'title', 'description', items);
    const todoItemOfID1 = todoList.getItemById(1);
    expect(todoItemOfID1)
      .to.have.property('id')
      .to.equal(1);
  });

  it('deleteItemById: should delete a todo item of specified id', function() {
    const items = [item1, item2, item3];
    const todoList = new Todo(1, 'title', 'description', items);
    todoList.deleteItem(1);
    const todoItemOfID1 = todoList.getItemById(1);
    expect(todoItemOfID1).to.be.undefined;
  });
});
