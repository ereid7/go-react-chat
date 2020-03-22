package main
//   "container/list"

import (
    "fmt"
    "net/http"
    "github.com/evanreid88/go-react-chat/pkg/websocket"
)

// TODO move to seperate file
type ChatServer struct {
    messageList []websocket.MessageData 
}

func (c *ChatServer) ServeWebSocket(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
    fmt.Println("WebSocket Endpoint Hit")
    conn, err := websocket.Upgrade(w, r)
    if err != nil {
        fmt.Fprintf(w, "%+v\n", err)
    }

    keys := r.URL.Query()
    user := keys.Get("user")
    if len(user) < 1 {
        fmt.Println("Url Param 'user' is missing")
        return
    }

    userId := keys.Get("userId")
    if len(userId) < 1 {
        fmt.Println("Url Param 'userId' is missing")
        return
    }

    client := &websocket.Client{
        ID: userId,
        User: user,
        Conn: conn,
        Pool: pool,
    }
    
    pool.Register <- client
    client.Read()
}
    
func (c *ChatServer) SetupRoutes() {
    fmt.Println("Distributed Chat App v0.01")
    pool := websocket.NewPool(10, 10, 30)
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