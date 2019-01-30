const TODOLists = require('./todo_lists');

class Users {
  constructor(users = {}) {
    this.users = users;
  }

  static parse(usersData) {
    const users = {};
    Object.keys(usersData).forEach(username => {
      const { password } = usersData[username];
      const todoLists = TODOLists.parse(usersData[username].todoLists);
      users[username] = { password, todoLists };
    });
    return new Users(users);
  }

  addUser(user) {
    const { username, password, todoLists } = user;
    this.users[username] = { password, todoLists };
  }

  getTodoLists(username) {
    return this.users[username].todoLists;
  }

  isUserValid(username, password) {
    return this.users[username] && this.users[username].password == password;
  }

  getAllUsers() {
    return this.users;
  }
}

module.exports = Users;
