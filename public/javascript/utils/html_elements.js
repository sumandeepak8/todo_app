const createInputField = function(type, name, value) {
  const inputField = document.createElement('input');
  inputField.type = type;
  inputField.value = value;
  inputField.name = name;
  return inputField;
};

const createForm = function(method, action) {
  const form = document.createElement('form');
  form.method = method;
  form.action = action;
  return form;
};

const createHeading = function(level, content) {
  const heading = document.createElement(`h${level}`);
  heading.innerText = content;
  return heading;
};

const createAnchor = function(url, text) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.innerText = text;
  return anchor;
};

const appendChildren = function(parent, children) {
  children.forEach(child => parent.appendChild(child));
};
