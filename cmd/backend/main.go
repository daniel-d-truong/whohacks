package main

import (
	"github.com/daniel-d-truong/whohacks/pkg/stream"
)

func main() {
	stream.CreateClient("localhost:50051", "test session")
	select {}
}
