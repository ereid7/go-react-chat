package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// We'll need to define an Upgrader
// this will require a Read and Write buffer size
var upgrader = websocket.Upgrader{
  ReadBufferSize:  1024,
  WriteBufferSize: 1024,

  // We'll need to check the origin of our connection
  // this will allow us to make requests from our React
  // development server to here.
  // For now, we'll do no checking and just allow any connection
  CheckOrigin: func(r *http.Request) bool { return true },
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
			log.Println(err)
			return nil, err
	}
	return conn, nil
}


// func Writer(conn *websocket.Conn) {
// 	for {
// 			fmt.Println("Sending")
// 			messageType, r, err := conn.NextReader()
// 			if err != nil {
// 					fmt.Println(err)
// 					return
// 			}
// 			w, err := conn.NextWriter(messageType)
// 			if err != nil {
// 					fmt.Println(err)
// 					return
// 			}
// 			if _, err := io.Copy(w, r); err != nil {
// 					fmt.Println(err)
// 					return
// 			}
// 			if err := w.Close(); err != nil {
// 					fmt.Println(err)
// 					return
// 			}
// 	}
// }