const TODOItem = require('../src/entities/todo_item');
const expect = require('chai').expect;
describe('TODOItem', function() {
  it('parse: it should return new todo item given raw item data', function() {
    const todoItemData = { id: 1, content: 'content', done: false };
    const todoItem = TODOItem.parse(todoItemData);
    expect(todoItem).to.be.a.instanceOf(TODOItem);
  });
});
