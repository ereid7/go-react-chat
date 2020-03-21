package websocket
import "encoding/json"

import (
	"fmt"
	"log"
	"time"
	"github.com/gorilla/websocket"
)

type Client struct {
	ID string
	User string
	Conn *websocket.Conn
	Pool *Pool
}
type Message struct {
	Type int `json:"type"`
	Body string `json:"body"`
	User string `json:"user"`
	TimeStamp time.Time `json:"timeStamp"`
}
type StateMessage struct {
	Type int `json:"type"`
	ClientList []string `json:"clientList"`
}

type MessageData struct {
	Message string
	Id string
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()
		 
	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return 
		}

		var messageData MessageData
		json.Unmarshal([]byte(p), &messageData)

		if messageData.Id != c.ID {
			log.Println("Unauthorized User")
			return
		}

		message := Message {
			Type: messageType, 
			Body: messageData.Message,
			User: c.User,
			TimeStamp: time.Now() }
			
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
  }
}