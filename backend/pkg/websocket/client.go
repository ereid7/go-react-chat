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
	ClientCount int `json:"clientCount"`
}

type MessageData struct {
	Message string
	User string
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

		message := Message {
			Type: messageType, 
			Body: messageData.Message,
			User: messageData.User,
		  TimeStamp: time.Now() }
			
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
  }
}