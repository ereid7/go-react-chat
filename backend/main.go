package main

import (
    "fmt"
    "net/http"
    "github.com/evanreid88/go-react-chat/pkg/websocket"
)

type ChatServer struct {
    ServeWebSocket func(*websocket.Pool, http.ResponseWriter, *http.Request)
    SetupRoutes func()
}

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
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

func setupRoutes() {
    fmt.Println("Distributed Chat App v0.01")
    pool := websocket.NewPool()
    go pool.Start()

    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        serveWs(pool, w, r)
    })
}

func main() {
    chatServer := ChatServer {
        ServeWebSocket: serveWs,
        SetupRoutes: setupRoutes,
    }

    chatServer.SetupRoutes();
    http.ListenAndServe(":8080", nil)
}