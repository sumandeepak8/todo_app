const Todos = require('./todos');

class Users {
  constructor(users = {}) {
    this.users = users;
  }

  static parse(usersData) {
    const users = {};
    Object.keys(usersData).forEach(username => {
      const { password } = usersData[username];
      const todos = Todos.parse(usersData[username].todos);
      users[username] = { password, todos };
    });
    return new Users(users);
  }

  addUser(user) {
    const { username, password, todos } = user;
    this.users[username] = { password, todos };
  }

  getTodoLists(username) {
    return this.users[username].todos;
  }

  isUserValid(username, password) {
    return this.users[username] && this.users[username].password == password;
  }

  getAllUsers() {
    return this.users;
  }
}

module.exports = Users;
