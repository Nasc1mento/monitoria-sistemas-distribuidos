package main

import (
	"encoding/binary"
	"fmt"
	"monitoria/udp_game/util"
	"net"
	"os"
	"os/exec"
	"time"
)

func main() {
	exec.Command("stty", "-F", "/dev/tty", "raw").Run()
	defer exec.Command("stty", "-F", "/dev/tty", "-raw").Run()

	addr := net.UDPAddr{
		IP:   net.ParseIP(util.SERVER_IP),
		Port: util.SERVER_PORT,
	}

	conn, err := net.DialUDP("udp", nil, &addr)
	if err != nil {
		fmt.Print(err)
		return
	}

	defer conn.Close()

	fmt.Println("Conectado ao servidor")

	b := make([]byte, 1)
	firstKeyTime := time.Time{}
	i := 0
	for {

		os.Stdin.Read(b)
		os.Stdout.Write(nil)

		if b[0] == 3 {
			os.Exit(1)
		}

		if i == 0 {
			firstKeyTime = time.Now()
			i++
			continue
		}

		elapsedTime := time.Since(firstKeyTime).Milliseconds()
		err := binary.Write(conn, binary.LittleEndian, elapsedTime)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(elapsedTime)
		i--
	}
}
