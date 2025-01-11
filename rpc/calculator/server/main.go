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
	A, B int
}

type Calculator struct{}

func (c *Calculator) Sum(args *Args, result *int) error {
	*result = args.A + args.B
	return nil
}

func (c *Calculator) Divide(args *Args, result *int) error {
	*result = args.A / args.B
	return nil
}

func (c *Calculator) Multiply(args *Args, result *int) error {
	*result = args.A * args.B
	return nil
}

func (c *Calculator) Subtract(args *Args, result *int) error {
	*result = args.A - args.B
	return nil
}

func main() {
	err := rpc.Register(new(Calculator))

	if err != nil {
		fmt.Printf("Erro ao registrar o serviço: %v\n", err)
		return
	}

	endpoint := SERVER_IP + ":" + SERVER_PORT
	conn, err := net.Listen("tcp", endpoint)
	if err != nil {
		fmt.Printf("Erro ao iniciar o servidor: %v\n", err)
		return
	}

	defer conn.Close()

	for {
		client, err := conn.Accept()
		if err != nil {
			fmt.Printf("Erro ao aceitar conexão: %v\n", err)
		}

		go rpc.ServeConn(client)
	}

}
