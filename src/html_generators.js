const getToDoItemHTML = function(listid, todoItem) {
  return `<div>${todoItem.getContent()}
  <form method="post" action="/edititem" style="display:inline">
  <input type='hidden' name='listid' value='${listid}'/>
  <input type='hidden' name='itemid' value='${todoItem.getId()}'/>
  <input value="Edit" type="submit"/> 
  </form>
  <form method="post" action="/deleteitem" style="display:inline">
    <input type='hidden' name='listid' value='${listid}'/>
    <input type='hidden' name='itemid' value='${todoItem.getId()}'/>
    <input value="Delete" type="submit"/> 
    </form>
  </div>`;
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
