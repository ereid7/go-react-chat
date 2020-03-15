package websocket
import "fmt"

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

							// TOOD create message cleanup system
							for message, _ := range pool.MessageList {
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
						pool.MessageList = append(pool.MessageList, message)
					  fmt.Println(pool.MessageList)
						if err := client.Conn.WriteJSON(message); err != nil {
								fmt.Println(err)
								return
						}
					}
			}
	}
}