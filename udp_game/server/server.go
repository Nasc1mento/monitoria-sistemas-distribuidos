package main

import (
	"encoding/binary"
	"fmt"
	"math/rand"
	"monitoria/udp_game/util"
	"net"
	"time"
)

func main() {
	addr := net.UDPAddr{
		IP:   net.ParseIP(util.SERVER_IP),
		Port: util.SERVER_PORT,
	}

	r1, r2 := newInterval()

	conn, err := net.ListenUDP("udp", &addr)
	if err != nil {
		return
	}

	fmt.Println("Intervalo: ", r1, " - ", r2)

	defer conn.Close()
	for {
		var n int64
		err = binary.Read(conn, binary.LittleEndian, &n)
		if err != nil {
			fmt.Println(err)
		}

		if n >= r1 && n <= r2 {
			fmt.Println(n)
			fmt.Println("Parabéns pra vocês que não sei quem são. Aqui um suco de laranja pra cada um 🥤")
			fmt.Println("Sem garantia")
			r1, r2 := newInterval()
			fmt.Println("Novo intervalo: ", r1, " - ", r2)
		}
	}
}

func newInterval() (int64, int64) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	half := int64(util.MAX_N+util.MIN_N) / 2
	n1 := r.Int63n(half-util.DIFF-util.MIN_N) + util.MIN_N
	n2 := r.Int63n(util.MAX_N-half-util.DIFF) + half + util.DIFF
	return n1, n2
}
