const HOME_PAGE_PATH = './public/index.html';
const ENCODING_UTF8 = 'utf-8';
const TODO_LISTS_PLACEHOLDER = '____TODO_LISTS____';
const USERS_DATA_PATH = './data/users.json';
const LIST_ID_PLACEHOLDER = '____LIST_ID____';
const EDIT_ITEM_PAGE_PATH = './public/edit_items.html';
const ITEM_CONTENT_PLACEHOLDER = '____ITEM_CONTENT____';
const ITEM_ID_PLACEHOLDER = '____ITEM_ID____';
const ERROR_404 = 'Resource not found';
const EDIT_LIST_PAGE_PATH = './public/edit_list.html';
const LIST_DESCRIPTION_PLACEHOLDER = '____LIST_DESCRIPTION____';
const LIST_TITLE_PLACEHOLDER = '____LIST_TITLE____';
const DATA_DIRECTORY = './data';
const PUBLIC_DIRECTORY = './public';
const DEFAULT_TODO_LISTS_JSON = '{"lists":[], "latestListID":0}';
const SESSIONS_DATA_PATH = './data/sessions.json';
const ERROR_500_MSG = 'Internal Server Error';
const MIME_TEXT_PLAIN = 'text/plain';
const MIME_TYPES = {
  css: 'text/css',
  html: 'text/html',
  js: 'text/javascript',
  csv: 'text/csv',
  gif: 'image/gif',
  htm: 'text/html',
  html: 'text/html',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  json: 'application/json',
  png: 'image/png',
  xml: 'text/xml',
  pdf: 'application/pdf'
};

module.exports = {
  HOME_PAGE_PATH,
  ENCODING_UTF8,
  TODO_LISTS_PLACEHOLDER,
  USERS_DATA_PATH,
  LIST_ID_PLACEHOLDER,
  ERROR_404,
  EDIT_ITEM_PAGE_PATH,
  ITEM_CONTENT_PLACEHOLDER,
  ITEM_ID_PLACEHOLDER,
  EDIT_LIST_PAGE_PATH,
  LIST_DESCRIPTION_PLACEHOLDER,
  LIST_TITLE_PLACEHOLDER,
  DATA_DIRECTORY,
  PUBLIC_DIRECTORY,
  DEFAULT_TODO_LISTS_JSON,
  MIME_TYPES,
  MIME_TEXT_PLAIN,
  SESSIONS_DATA_PATH,
  ERROR_500_MSG
};
