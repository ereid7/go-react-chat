package websocket
import "fmt"
import "time"

const messageLimit = 50
const expirationLimitHrs = 10

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
	MessageList []Message
}

func NewPool() *Pool {
	return &Pool{
			Register:   make(chan *Client),
			Unregister: make(chan *Client),
			Clients:    make(map[*Client]bool),
			Broadcast:  make(chan Message),
	}
}

// TODO prevent un-authenticated users from connecting
func (pool *Pool) Start() {
	for {
			select {
			case client := <-pool.Register:
					pool.Clients[client] = true
					fmt.Println("Size of Connection Pool: ", len(pool.Clients))
					for client, _ := range pool.Clients {
							fmt.Println(client)
							client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})

							pool.CleanupMessageList();

							for _, message := range pool.MessageList {
								client.Conn.WriteJSON(message);
							}
					}
					break
			case client := <-pool.Unregister:
					delete(pool.Clients, client)
					fmt.Println("Size of Connection Pool: ", len(pool.Clients))
					for client, _ := range pool.Clients {
							client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
					}
					break
			case message := <-pool.Broadcast:
					fmt.Println("Sending message to all clients in Pool")
					for client, _ := range pool.Clients {
				
						// TODO handle user color on frontend
						pool.CleanupMessageList();
						pool.MessageList = append(pool.MessageList, message)
						if err := client.Conn.WriteJSON(message); err != nil {
								fmt.Println(err)
								return
						}
					}
			}
	}
}

func (pool *Pool) CleanupMessageList() {
	if (len(pool.MessageList) > messageLimit) {
		pool.MessageList = pool.MessageList[len(pool.MessageList) - messageLimit:]
	}

	for index, message := range pool.MessageList {
		expirationTime := time.Now().Add(-expirationLimitHrs * time.Hour);
		if (message.TimeStamp.Before(expirationTime)) {
			pool.MessageList = pool.MessageList[len(pool.MessageList) - index:]
			return
		}
	}
}