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

func (pool *Pool) Start() {
	go pool.CleanupHeartBeat()
	for {
			select {
			// client connecting
			case client := <-pool.Register:
					pool.Clients[client] = true
					fmt.Println("Size of Connection Pool: ", len(pool.Clients))
					for client, _ := range pool.Clients {
							fmt.Println(client)
							client.Conn.WriteJSON(Message{Type: 1, Body: "New User Joined...", TimeStamp: time.Now().Format(time.RFC822)})
							client.Conn.WriteJSON(StateMessage{Type: 2, ClientList: pool.GetClientNames()})

							pool.CleanupMessageList();
							for _, message := range pool._messageList {
								client.Conn.WriteJSON(message);
							}
					}
					break
			// client disconnecting
			case client := <-pool.Unregister:
					delete(pool.Clients, client)
					fmt.Println("Size of Connection Pool: ", len(pool.Clients))
					for client, _ := range pool.Clients {
							client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected...", TimeStamp: time.Now().Format(time.RFC822)})
							client.Conn.WriteJSON(StateMessage{Type: 2, ClientList: pool.GetClientNames()})
					}
					break
			// client broadcasting message
			case message := <-pool.Broadcast:
					fmt.Println("Sending message to all clients in Pool")
					for client, _ := range pool.Clients {
				
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

func (pool *Pool) GetClientNames() []string {
	clients := make([]string, len(pool.Clients))
	i := 0
	for k := range pool.Clients {
		clients[i] = k.User
		i++
	}
	return clients;
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
		messageTime, _ := time.Parse(time.RFC822, message.TimeStamp)
		if (messageTime.Before(expirationTime)) {
			pool._messageList = pool._messageList[len(pool._messageList) - index:]
			return
		}
	}
}