class ChatSocket {

  _socketEndpoint;
  _socket;

  constructor(socketEndpoint, connect = false) {
    this._socketEndpoint = socketEndpoint;
    this._socket = connect ? new WebSocket(this._socketEndpoint) : null;
  }

  createSocket() {
    if (this._socket = null) {
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
      console.log(msg);
      cb(msg)
    };
  
    this._socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
    };
  
    this._socket.onerror = (error) => {
      console.log("Socket Error: ", error);
    };
  };

  sendMsg(user, msg) {
    console.log("sending msg: ", msg);
  
    let messageData = {
      "message": msg,
      "user": user
    }
    this._socket.send(JSON.stringify(messageData));
  };
}

export default ChatSocket;