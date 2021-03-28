package main

import (
	"log"

	"github.com/daniel-d-truong/whohacks/pkg/stream"
	"github.com/gofiber/fiber/v2"
)

func main() {
	// Create client and join the session

	app := fiber.New()
	app.Get("/join/:room", func(c *fiber.Ctx) error {
		go stream.CreateClient("localhost:50051", c.Params("room"))
		return c.SendString("Joined room")

	})

	log.Fatal(app.Listen(":3000"))

	select {}
}
