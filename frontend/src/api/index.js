// api/index.js
// TODO remove this file once create socket service
// var socket = new WebSocket("ws://localhost:8080/ws");

// let connect = cb => {
//   console.log("Attempting Connection...");

//   socket.onopen = () => {
//     console.log("Successfully Connected");
//   };

//   socket.onmessage = (msg) => {
//     console.log(msg);
//     cb(msg)
//   };

//   socket.onclose = (event) => {
//     console.log("Socket Closed Connection: ", event);
//   };

//   socket.onerror = (error) => {
//     console.log("Socket Error: ", error);
//   };
// };

// let sendMsg = (user, msg) => {
//   console.log("sending msg: ", msg);

//   let messageData = {
//     "message": msg,
//     "user": user
//   }
//   socket.send(JSON.stringify(messageData));
// };

// export { connect, sendMsg };