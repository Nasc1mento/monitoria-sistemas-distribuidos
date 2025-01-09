package main

import (
	"fmt"
	"sync"
)

// https://gobyexample.com/waitgroups
func main() {
	NumberThreads := 5
	Part := 80
	sum := 0

	var waitGroup sync.WaitGroup

	result := make(chan int, 1)

	for i := 0; i < NumberThreads; i++ {
		waitGroup.Add(1)
		go workerSum(&waitGroup, result, Part, i*Part)
		sum += <-result
	}

	waitGroup.Wait()
	fmt.Println("Total: ", sum)
}

func workerSum(waitgroup *sync.WaitGroup, result chan int, num1 int, num2 int) {
	defer waitgroup.Done()
	result <- num1 + num2
}
