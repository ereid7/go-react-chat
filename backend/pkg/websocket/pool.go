package websocket
import "fmt"
import "time"

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
	_messageList []Message
	_messageLimit int
	_expirationLimitHrs time.Duration
	_cleanupHeartbeatIntervalMins time.Duration
}

func NewPool(messageLimit int, expirationLimitHrs time.Duration, cleanupHeartbeatIntervalMins time.Duration) *Pool {
	return &Pool{
			Register:     make(chan *Client),
			Unregister:   make(chan *Client),
			Clients:      make(map[*Client]bool),
			Broadcast:    make(chan Message),
			_messageList: []Message{},
			_messageLimit: messageLimit,
			_expirationLimitHrs: expirationLimitHrs,
			_cleanupHeartbeatIntervalMins: cleanupHeartbeatIntervalMins,
	}
}

// TODO prevent un-authenticated users from connecting
func (pool *Pool) Start() {
	go pool.CleanupHeartBeat()
	for {
			select {
			case client := <-pool.Register:
					pool.Clients[client] = true
					fmt.Println("Size of Connection Pool: ", len(pool.Clients))
					for client, _ := range pool.Clients {
							fmt.Println(client)
							// TODO only connect once user logs in, add user name to this
							client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined..."})
							client.Conn.WriteJSON(StateMessage{Type: 2, ClientCount: len(pool.Clients)})

							pool.CleanupMessageList();

							for _, message := range pool._messageList {
								client.Conn.WriteJSON(message);
							}
					}
					break
			case client := <-pool.Unregister:
					delete(pool.Clients, client)
					fmt.Println("Size of Connection Pool: ", len(pool.Clients))
					for client, _ := range pool.Clients {
							client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected..."})
							client.Conn.WriteJSON(StateMessage{Type: 2, ClientCount: len(pool.Clients)})
					}
					break
			case message := <-pool.Broadcast:
					fmt.Println("Sending message to all clients in Pool")
					for client, _ := range pool.Clients {
				
						// TODO handle user color on frontend
						pool.CleanupMessageList();
						pool._messageList = append(pool._messageList, message)
						if err := client.Conn.WriteJSON(message); err != nil {
								fmt.Println(err)
								return
						}
					}
			}
	}
}

func (pool *Pool) CleanupHeartBeat() {
	for range time.Tick(time.Minute * pool._cleanupHeartbeatIntervalMins) {
		pool.CleanupMessageList()
	}
}

func (pool *Pool) CleanupMessageList() {
	if (len(pool._messageList) > pool._messageLimit) {
		pool._messageList = pool._messageList[len(pool._messageList) - pool._messageLimit:]
	}

	for index, message := range pool._messageList {
		expirationTime := time.Now().Add(-pool._expirationLimitHrs * time.Hour);
		if (message.TimeStamp.Before(expirationTime)) {
			pool._messageList = pool._messageList[len(pool._messageList) - index:]
			return
		}
	}
}