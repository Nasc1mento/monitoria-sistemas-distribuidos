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

type Calculator struct{}

func (c *Calculator) Sum(args *Args, result *float64) error {
	*result = args.A + args.B
	return nil
}

func (c *Calculator) Subtract(args *Args, result *float64) error {
	*result = args.A - args.B
	return nil
}

func (c *Calculator) Multiply(args *Args, result *float64) error {
	*result = args.A * args.B
	return nil
}

func (c *Calculator) Divide(args *Args, result *float64) error {
	if args.B == 0 {
		return fmt.Errorf("cannot divide by zero")
	}

	*result = args.A / args.B
	return nil
}

func main() {
	err := rpc.Register(new(Calculator))

	if err != nil {
		fmt.Printf("failed to start service: %v\n", err)
		return
	}

	endpoint := SERVER_IP + ":" + SERVER_PORT
	conn, err := net.Listen("tcp", endpoint)
	if err != nil {
		fmt.Printf("failed to start server: %v\n", err)
		return
	}

	defer conn.Close()

	for {
		client, err := conn.Accept()
		if err != nil {
			fmt.Printf("failed to accept connection: %v\n", err)
		}

		go rpc.ServeConn(client)
	}
}
