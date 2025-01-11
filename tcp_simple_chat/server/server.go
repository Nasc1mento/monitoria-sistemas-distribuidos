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
		fmt.Printf("Erro ao inicia o servidor: %v\n", err)
		return
	}

	defer conn.Close()

	fmt.Println("Servidor iniciado")

	for {

		client, err := conn.Accept()
		if err != nil {
			fmt.Printf("Erro ao aceitar conexão: %v\n", err)
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

	conn.Write([]byte("Bem-vindo ao chat!"))
	broadcast([]byte("Novo usuário conectado: " + conn.RemoteAddr().String()))

	for {
		buffer := make([]byte, util.BufferSize)
		_, err := conn.Read(buffer)
		if err != nil {
			fmt.Printf("Erro ao ler mensagem: %v\n", err)
		}

		mu.Lock()
		broadcast(buffer)
		mu.Unlock()
	}

}

func broadcast(message []byte) {
	mu.Lock()
	defer mu.Unlock()
	for client := range clients {
		_, err := client.Write(message)
		if err != nil {
			fmt.Printf("Erro ao enviar mensagem: %v\n", err)
		}
	}
}
