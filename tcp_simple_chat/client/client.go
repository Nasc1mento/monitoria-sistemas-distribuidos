package main

import (
	"bufio"
	"bytes"
	"fmt"
	"monitoria/tcp_simple_chat/util"
	"net"
	"os"
	"sync"
)

func readWorker(conn net.Conn, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		buffer := make([]byte, util.BufferSize)
		n, err := conn.Read(buffer)
		if err != nil {
			continue
		}

		buffer = bytes.TrimSpace(buffer)

		fmt.Println(string(buffer[:n]))
	}
}

func writeWorker(conn net.Conn, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		message := make([]byte, util.BufferSize)
		_, err := bufio.NewReader(os.Stdin).Read(message)
		if err != nil {
			fmt.Print(err)
			return
		}

		message = bytes.TrimSpace(message)

		_, err = conn.Write(message)
		if err != nil {
			fmt.Printf("Erro ao enviar mensagem: %v\n", err)
			return
		}

	}
}

func main() {

	endpoint := util.SERVER_IP + ":" + util.SERVER_PORT
	conn, err := net.Dial("tcp", endpoint)
	if err != nil {
		fmt.Printf("Erro ao conectar ao servidor: %v\n", err)
		return
	}

	wg := sync.WaitGroup{}
	wg.Add(2)

	go readWorker(conn, &wg)
	go writeWorker(conn, &wg)

	wg.Wait()
}
