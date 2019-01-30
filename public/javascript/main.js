const createItemEditor = function(listId, itemId, action, buttonLabel) {
  const form = createForm('POST', action);
  form.style.display = 'inline';

  const hiddenListId = createInputField('hidden', 'listid', listId);
  const hiddenItemId = createInputField('hidden', 'itemid', itemId);
  const submitButton = createInputField('submit', '', buttonLabel);
  const formElements = [hiddenListId, hiddenItemId, submitButton];
  appendChildren(form, formElements);

  return form;
};

const createListEditor = function(listId, action, buttonLabel) {
  const form = createForm('POST', action);
  form.style.display = 'inline';

  const hiddenListId = createInputField('hidden', 'listid', listId);
  const submitButton = createInputField('submit', '', buttonLabel);
  const formElements = [hiddenListId, submitButton];
  appendChildren(form, formElements);
  return form;
};

const getToDoItem = function(listId, todoItem) {
  const itemId = todoItem.id;
  const isDone = todoItem.done;
  let buttonLabel = 'Done';
  if (isDone) buttonLabel = 'Undone';

  const todoItemContainer = document.createElement('div');

  const itemInfoContainer = document.createElement('span');
  itemInfoContainer.innerText = `${todoItem.content}`;

  const editItemForm = createItemEditor(listId, itemId, '/edititem', 'Edit');
  const deleteItemForm = createItemEditor(
    listId,
    itemId,
    '/deleteitem',
    'Delete'
  );
  const toggleStatusForm = createItemEditor(
    listId,
    itemId,
    '/togglestatus',
    buttonLabel
  );

  const todoItemElements = [
    itemInfoContainer,
    editItemForm,
    deleteItemForm,
    toggleStatusForm
  ];
  appendChildren(todoItemContainer, todoItemElements);

  return todoItemContainer;
};

const createAddItemForm = function(listId) {
  const form = createForm('POST', '/additem');
  const listIdField = createInputField('hidden', 'listid', listId);
  const itemContentField = createInputField('text', 'itemcontent', '');
  const addButton = createInputField('submit', '', 'Add Item');
  const formElements = [listIdField, itemContentField, addButton];
  appendChildren(form, formElements);
  return form;
};

const getToDoList = function(todoList) {
  const listId = todoList.id;
  const listContainer = document.createElement('div');
  const title = createHeading(1, todoList.title);
  const description = createHeading(3, todoList.description);
  const addItemForm = createAddItemForm(listId);
  const editListForm = createListEditor(listId, '/editlist', 'Edit List');
  const deleteListForm = createListEditor(listId, '/deletelist', 'Delete List');
  const todoItems = todoList.items.map(getToDoItem.bind(null, listId));
  const listSeparator = document.createElement('hr');
  const listElements = [
    title,
    description,
    addItemForm,
    editListForm,
    deleteListForm
  ];

  appendChildren(listContainer, listElements);
  appendChildren(listContainer, todoItems);
  listContainer.appendChild(listSeparator);

  return listContainer;
};

const getToDoLists = function(todoLists) {
  return todoLists.lists.map(getToDoList);
};

const appendTodoLists = function(todoLists) {
  const todoListsContainer = document.getElementById('todo_lists');
  appendChildren(todoListsContainer, todoLists);
};

const fetchTODOLists = function() {
  fetch('/todolists')
    .then(response => response.json())
    .then(getToDoLists)
    .then(appendTodoLists);
};

window.onload = function() {
  fetchTODOLists();
};
