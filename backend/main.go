package main
//   "container/list"

import (
    "fmt"
    "net/http"
    "github.com/evanreid88/go-react-chat/pkg/websocket"
)

type ChatServer struct {
    messageList []websocket.MessageData 
}

func (c *ChatServer) ServeWebSocket(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
    fmt.Println("WebSocket Endpoint Hit")
    conn, err := websocket.Upgrade(w, r)
    if err != nil {
        fmt.Fprintf(w, "%+v\n", err)
    }

    client := &websocket.Client{
        Conn: conn,
        Pool: pool,
    }

    pool.Register <- client
    client.Read()
}
    
func (c *ChatServer) SetupRoutes() {
    fmt.Println("Distributed Chat App v0.01")
    pool := websocket.NewPool()
    go pool.Start()
    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        c.ServeWebSocket(pool, w, r)
    })
}

func main() {
    chatServer := ChatServer{ make([]websocket.MessageData, 0) }

    chatServer.SetupRoutes();
    http.ListenAndServe(":8080", nil)
}