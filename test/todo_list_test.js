const TODOList = require('../src/entities/todo_list');
const TODOItem = require('../src/entities/todo_item');
const expect = require('chai').expect;

describe('TODOList', function() {
  it('addItem : should add new item to TODO List', function() {
    const item1 = new TODOItem(1, 'one', false);
    const item2 = new TODOItem(2, 'two', false);
    const item3 = new TODOItem(3, 'three', false);
    const todoList = new TODOList(
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
    const todoList = TODOList.parse(todoListData);
    expect(todoList)
      .to.have.property('id')
      .equal(1);

    expect(todoList)
      .to.have.property('title')
      .equal('title');

    expect(todoList)
      .to.have.property('description')
      .equal('this is a list');

    expect(todoList)
      .to.have.property('items')
      .lengthOf(2);
  });
});
