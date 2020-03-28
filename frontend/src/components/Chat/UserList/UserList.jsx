import React, { Component } from "react";
import "./UserList.scss";

class UserList extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      userList: []
    }
  }
  
  componentDidMount() {
    //this.state.userList = this.props.userList;
    this.state.userList = ["testuser1", "johnny2", "fishsteak"];
  }
  
  render() {
    let users = this.state.userList.map((user) => 
      <p class="user">{user}</p>
    );

    return (
    <div className="UserList">
        <div class="user-list">
        <h3>Users: </h3>
        {users}
        </div>
    </div>
    );
  }
}

export default UserList