class Auth {

  constructor() {
    this.authenticated = false;
    this.user = null;
  }

  login(name, cb) {
    this.authenticated = true;
    this.user = name;
    cb();
  }

  logout(cb) {
    this.authenticated = false;
    cb();
  }

  isAuthenticated() {
    return this.authenticated;
  }

  getUser() {
    return this.user;
  }
}

export default new Auth()