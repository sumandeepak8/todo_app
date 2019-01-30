const TODOLists = require('../src/entities/todo_lists');
const TODOList = require('../src/entities/todo_list');
const expect = require('chai').expect;

describe('TODOLists', function() {
  it('addTODOList : should add new Todo list to todo lists', function() {
    const todoLists = new TODOLists([], 0);
    todoLists.addTODOList('title', 'description');
    expect(todoLists)
      .to.have.property('lists')
      .to.have.lengthOf(1);
  });

  it('parse: should return new todo lists given raw todo lists data', function() {
    const todoListsData = {
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
    const todoLists = TODOLists.parse(todoListsData);
    expect(todoLists).to.be.a.instanceOf(TODOLists);
  });

  it('getListByID: should return a todo list of specified id', function() {
    const todoLists = new TODOLists([], 0);
    todoLists.addTODOList('title1', 'description1');
    todoLists.addTODOList('title2', 'description2');
    todoLists.addTODOList('title3', 'description3');

    const todoListOfID1 = todoLists.getListByID(1);
    expect(todoListOfID1)
      .to.have.property('id')
      .to.equal(1);
  });

  it('deleteListById: should delete a todo list of specified id', function() {
    const todoLists = new TODOLists([], 0);
    todoLists.addTODOList('title1', 'description1');
    todoLists.addTODOList('title2', 'description2');
    todoLists.addTODOList('title3', 'description3');

    todoLists.deleteListByID(1);
    const todoListOfID1 = todoLists.getListByID(1);
    expect(todoListOfID1).to.be.undefined;
  });
});
