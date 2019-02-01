const Todos = require('../src/entities/todos');
const expect = require('chai').expect;

describe('Todos', function() {
  it('addTodo : should add new Todo list to todo lists', function() {
    const todos = new Todos([], 0);
    todos.addTodo('title', 'description');
    expect(todos)
      .to.have.property('lists')
      .to.have.lengthOf(1);
  });

  it('parse: should return new todo lists given raw todo lists data', function() {
    const todosData = {
      lists: [
        {
          id: 1,
          title: 'title',
          description: 'description',
          items: [],
          latestItemId: 0
        }
      ],
      latestListId: 1
    };
    const todos = Todos.parse(todosData);
    expect(todos).to.be.a.instanceOf(Todos);
  });

  it('getListByID: should return a todo list of specified id', function() {
    const todos = new Todos([], 0);
    todos.addTodo('title1', 'description1');
    todos.addTodo('title2', 'description2');
    todos.addTodo('title3', 'description3');

    const todoListOfID1 = todos.getListByID(1);
    expect(todoListOfID1)
      .to.have.property('id')
      .to.equal(1);
  });

  it('deleteListById: should delete a todo list of specified id', function() {
    const todos = new Todos([], 0);
    todos.addTodo('title1', 'description1');
    todos.addTodo('title2', 'description2');
    todos.addTodo('title3', 'description3');

    todos.deleteListByID(1);
    const todoListOfID1 = todos.getListByID(1);
    expect(todoListOfID1).to.be.undefined;
  });
});
