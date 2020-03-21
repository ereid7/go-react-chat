class Auth {

  constructor() {
    this.sessionStorageUser = 'reactgochatuser';
  }

  login(name, cb) {
    var userId = this.createGuid()
    sessionStorage.setItem(this.sessionStorageUser, JSON.stringify({
      _name: name,
      _userId: userId
    }));
    cb();
  }

  logout(cb) {
    sessionStorage.removeItem(this.sessionStorageUser)
    cb();
  }

  isAuthenticated() {
    var test = sessionStorage.getItem(this.sessionStorageUser);
    return test;
  }

  getUserName() {
    return JSON.parse(sessionStorage.getItem(this.sessionStorageUser))._name;
  }

  getUserId() {
    return JSON.parse(sessionStorage.getItem(this.sessionStorageUser))._userId;
  }

  createGuid() {  
    function S4() {  
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
    }  
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
  }  
}

export default new Auth()