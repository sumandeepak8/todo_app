const getToDoItemHTML = function(listid, todoItem) {
  return `<p>${todoItem.getContent()}
  <form method="post" action="/deleteitem">
    <input type='hidden' name='listid' value='${listid}'/>
    <input type='hidden' name='itemid' value='${todoItem.getId()}'/>
    <input value="Delete item" type="submit"/> 
    </form>
  </p>`;
};

const getToDoListHTML = function(todoList) {
  return `<div>
    <h1>${todoList.getTitle()}</h1>
    <h3>${todoList.getDescription()}</h3>
    ${todoList
      .getItems()
      .map(getToDoItemHTML.bind(null, todoList.getId()))
      .join('')}
    <a href='/additems?listid=${todoList.getId()}'>Add Items</a>
    <form method="post" action="/deletelist">
    <input type='hidden' name='listid' value='${todoList.getId()}'/>
    <input value="Delete List" type="submit"/> 
    </form>
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
