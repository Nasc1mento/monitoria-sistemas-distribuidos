package main

import (
	"fmt"
	"net"
	"net/rpc"
)

const (
	SERVER_IP   = "127.0.0.1"
	SERVER_PORT = "3000"
)

type Args struct {
	A, B float64
}

func main() {
	conn, err := net.Dial("tcp", SERVER_IP+":"+SERVER_PORT)
	if err != nil {
		fmt.Printf("failed to connect to server: %v\n", err)
		return
	}

	defer conn.Close()

	client := rpc.NewClient(conn)

	var result float64
	args := Args{A: 10, B: 20}

	err = client.Call("Calculator.Divide", args, &result)
	if err != nil {
		fmt.Printf("failed calling method: %v\n", err)
		return
	}

	fmt.Printf("result: %v\n", result)
}
