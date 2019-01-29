const itemManipulationForm = function(listId, itemId, action, buttonLabel) {
  return `<form method="post" action="${action}" style="display:inline">
  <input type='hidden' name='listid' value='${listId}'/>
  <input type='hidden' name='itemid' value='${itemId}'/>
  <input value="${buttonLabel}" type="submit"/> 
  </form>`;
};

const listManipulationForm = function(listId, action, buttonLabel) {
  return `<form method="post" action="${action}" style="display:inline">
<input type='hidden' name='listid' value='${listId}'/>
<input value="${buttonLabel}" type="submit"/> 
</form>
`;
};

const getToDoItemHTML = function(listId, todoItem) {
  const itemId = todoItem.getId();
  return `<div>${todoItem.getContent()}
  ${itemManipulationForm(listId, itemId, '/edititem', 'Edit')}
  ${itemManipulationForm(listId, itemId, '/deleteitem', 'Delete')}
  </div>`;
};

const getToDoListHTML = function(todoList) {
  const listId = todoList.getId();
  return `<div>
    <h1>${todoList.getTitle()}</h1>
    <h3>${todoList.getDescription()}</h3>
    ${listManipulationForm(listId, '/editlist', 'Edit List')}
    ${listManipulationForm(listId, '/deletelist', 'Delete List')}
    <a href='/additems?listid=${listId}'>Add Items</a>
    ${todoList
      .getItems()
      .map(getToDoItemHTML.bind(null, listId))
      .join('')}
      <hr>
  </div>`;
};

const getToDoListsHTML = function(todoLists) {
  return todoLists
    .getTODOLists()
    .map(getToDoListHTML)
    .join('');
};

module.exports = getToDoListsHTML;
