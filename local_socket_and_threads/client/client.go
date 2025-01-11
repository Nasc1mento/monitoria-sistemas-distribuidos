package main

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"log"
	"math/rand"
	"monitoria/local_socket_and_threads/util"
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

	id := generateId()

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

func generateId() []byte {
	id := make([]byte, util.IdSize)
	now := time.Now().UnixNano()
	r := rand.New(rand.NewSource(now))
	binary.LittleEndian.PutUint64(id[:8], uint64(now))
	r.Read(id[8:util.IdSize])
	return id
}
