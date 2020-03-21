class ChatSocket {

  _socketEndpoint;
  _socket;

  // TODO allow user to pass option
  // which will dissallow users from the same ip
  constructor(socketEndpoint, 
              userName,
              userId,
              connect = false) {
    this._socketEndpoint = `${socketEndpoint}?user=${userName}&userId=${userId}`;
    this._socket = connect ? new WebSocket(this._socketEndpoint) : null;
  }

  createSocket() {
    if (this._socket == null) {
      this._socket = new WebSocket(this._socketEndpoint)
    }
  }

  closeSocket() {
    if (this._socket != null) {
      this._socket.close();
      this._socket = null;
    }
  }

  connect(cb) {
    console.log("Attempting Connection...");
  
    this._socket.onopen = () => {
      console.log("Successfully Connected");
    };
  
    this._socket.onmessage = (msg) => {
      cb(msg)
    };
  
    this._socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
      cb(event)
    };
  
    this._socket.onerror = (error) => {
      console.log("Socket Error: ", error);
    };
  };

  sendMsg(msg, userId) {
    console.log("sending msg: ", msg);
  
    let messageData = {
      "message": msg,
      "id": userId
    }
    this._socket.send(JSON.stringify(messageData));
  };
}

export default ChatSocket;