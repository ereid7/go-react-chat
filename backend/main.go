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

    users, ok := r.URL.Query()["user"]
    if !ok || len(users[0]) < 1 {
        fmt.Println("Url Param 'user' is missing")
        return
    }

    userIds, ok := r.URL.Query()["userId"]
    if !ok || len(userIds[0]) < 1 {
        fmt.Println("Url Param 'userId' is missing")
        return
    }

    user := users[0]
    userId := userIds[0]

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
    pool := websocket.NewPool(50, 10, 30)
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