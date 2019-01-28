let itemID = 1;
const addNewItemField = function() {
  let itemsContainer = document.getElementById('items_div');
  const newItemContainer = createNewItemContainer(document, itemID);
  itemsContainer.appendChild(newItemContainer);
  itemID++;
};

const createNewItemField = function(document, itemID) {
  const newItemField = document.createElement('input');
  newItemField.type = 'text';
  newItemField.name = `item${itemID}`;
  return newItemField;
};

const createLabel = function(document, itemID) {
  const label = document.createElement('label');
  label.innerText = `Item${itemID} : `;
  return label;
};

const createNewItemContainer = function(document, itemID) {
  const newItemContainer = document.createElement('div');
  const label = createLabel(document, itemID);
  const newItemField = createNewItemField(document, itemID);
  newItemContainer.appendChild(label);
  newItemContainer.appendChild(newItemField);
  return newItemContainer;
};

window.onload = function() {
  addNewItemField();
  const newItemButton = document.getElementById('newitembutton');
  newItemButton.onclick = addNewItemField;
};
