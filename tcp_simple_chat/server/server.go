package main

import (
	"fmt"
	"monitoria/tcp_simple_chat/util"
	"net"
	"sync"
)

var (
	clients = make(map[net.Conn]struct{})
	mu      sync.Mutex
)

func main() {
	endpoint := util.SERVER_IP + ":" + util.SERVER_PORT
	conn, err := net.Listen("tcp", endpoint)
	if err != nil {
		fmt.Print(err)
		return
	}

	defer conn.Close()

	for {

		client, err := conn.Accept()
		if err != nil {
			fmt.Print(err)
			return
		}

		mu.Lock()
		clients[client] = struct{}{}
		mu.Unlock()

		go chatWorker(client)

	}

}

func chatWorker(conn net.Conn) {
	defer func() {
		mu.Lock()
		delete(clients, conn)
		mu.Unlock()
		conn.Close()
	}()

	for {
		buffer := make([]byte, util.BufferSize)
		_, err := conn.Read(buffer)
		if err != nil {
			return
		}

		mu.Lock()
		for client := range clients {
			if client != conn {
				_, err := client.Write(buffer)
				if err != nil {
					return
				}
			}
		}
		mu.Unlock()
	}

}
