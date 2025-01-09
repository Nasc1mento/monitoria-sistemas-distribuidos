package main

import (
	"bufio"
	"fmt"
	"log"
	"math/rand"
	"monitoria/classwork/local_socket_and_threads/util"
	"net"
	"os"
	"strings"
	"time"
)

func main() {

	conn, err := net.Dial("unix", util.Socketpath)
	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close()

	id := make([]byte, util.IdSize)
	generateId(&id)

	_, err = conn.Write(id)
	if err != nil {
		panic(err)
	}

	for {
		fmt.Println("Escreva alguma coisa: ")
		buffer, err := bufio.NewReader(os.Stdin).ReadBytes('\n')
		if err != nil {
			panic(err)
		}

		fmt.Fprint(conn, strings.TrimSpace(string(buffer)))

		if strings.TrimSpace(string(buffer)) == "EXIT" {
			return
		}
	}

}

func generateId(id *[]byte) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	(*id)[0] = byte(time.Now().UnixNano())

	for i := 1; i < len(*id); i++ {
		(*id)[i] = byte(r.Intn(100))
	}
}
