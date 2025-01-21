gen:
	protoc -I=proto --go_out=pb --go_opt=paths=source_relative proto/*.proto
clean:
	rm pb/*.go
run:
	go run main.go
test:
	go test -cover -race ./...