package main

import (
	"log"

	"github.com/gofiber/fiber/v2"

	"github.com/daniel-d-truong/whohacks/stream"
	sdk "github.com/pion/ion-sdk-go"
)

type JoinRequest struct {
	Room string `json:"room"`
	Name string `json:"name"`
}

func main() {
	// Create client and join the session

	roomsDB := make(map[string]*sdk.Client, 0)

	app := fiber.New()

	// GET request with roomID and name in body
	// /join
	app.Post("/join", func(c *fiber.Ctx) error {
		// if room didn't exist, create client
		var joinReq JoinRequest
		c.BodyParser(joinReq)

		if _, ok := roomsDB[c.Params("roomID")]; !ok {
			_, err := stream.CreateClient("localhost:50051", c.Params("room"))
			if err != nil {
				return err
			}
			return c.SendString("Joined room")
		}

		return c.SendString("Already joined room")
	})

	log.Fatal(app.Listen(":3000"))
}
