package main

import (
	"fmt"
	"monitoria/local_socket_and_threads/util"
	"net"
	"os"
	"os/signal"
	"sync"
	"syscall"
)

var (
	clients = make(map[string]struct{})
	mu      sync.Mutex
)

func main() {

	_, err := os.Stat(util.Socketpath)
	if err == nil {
		os.Remove(util.Socketpath)
	}

	conn, err := net.Listen("unix", util.Socketpath)

	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		client, err := conn.Accept()

		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		go func() {
			<-c
			os.Remove(util.Socketpath)
			os.Exit(1)
		}()

		if err != nil {
			fmt.Println(err)
			return
		}

		go func(conn net.Conn) {
			id := make([]byte, util.IdSize)
			_, err := conn.Read(id)

			if err != nil {
				fmt.Println(err)
				return
			}

			defer func() {
				mu.Lock()
				delete(clients, string(id))
				mu.Unlock()
				conn.Close()
			}()

			mu.Lock()
			clients[string(id)] = struct{}{}
			mu.Unlock()

			for {
				buffer := make([]byte, util.BufferSize)

				_, err := conn.Read(buffer)
				if err != nil {
					fmt.Println(err)
					return
				}

				fmt.Println(string(id) + ": " + string(buffer))
			}

		}(client)
	}
}
