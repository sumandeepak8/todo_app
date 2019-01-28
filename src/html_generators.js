const getToDoItemHTML = function(todoItem) {
  return `<p>${todoItem.getContent()}</p>`;
};

const getToDoListHTML = function(todoList) {
  return `<div>
    <h1>${todoList.getTitle()}</h1>
    <h3>${todoList.getDescription()}</h3>
    ${todoList
      .getItems()
      .map(getToDoItemHTML)
      .join('')}
    <a href='/additems?listid=${todoList.getId()}'>Add Items</a>
    <h3><a href="/deletelist?listid=${todoList.getId()}">Delete</a></h3>
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
