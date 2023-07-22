package main

import (
	"go-backend/database"
	"go-backend/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.ConnectDB()
	app := fiber.New()

	app.Use(cors.New())

	router.SetupUserRoutes(app)
	router.SetupBooksRoutes(app)

	app.Listen(":3000")
}
