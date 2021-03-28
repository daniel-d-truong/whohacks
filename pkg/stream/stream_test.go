package stream

import (
	"testing"
)

func TestStream(t *testing.T) {
	_, err := CreateClient("localhost:50051", "test session")
	if err != nil {
		t.Log(err.Error())
		t.FailNow()
	}
	select {}
}
