package main

import (
	"fmt"
	"net/rpc"
)

const (
	SERVER_IP   = "127.0.0.1"
	SERVER_PORT = "3000"
)

type Args struct {
	A, B int
}

func main() {

	conn, err := rpc.Dial("tcp", SERVER_IP+":"+SERVER_PORT)
	if err != nil {
		fmt.Printf("Erro ao conectar ao servidor: %v\n", err)
		return
	}

	defer conn.Close()

	var result int
	args := Args{A: 10, B: 5}

	err = conn.Call("Calculator.Divide", args, &result)
	if err != nil {
		fmt.Printf("Erro ao chamar o método: %v\n", err)
		return
	}

	fmt.Printf("Resultado: %d\n", result)
}
