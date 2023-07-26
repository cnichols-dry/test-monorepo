package main

import (
	"context"
	"go-backend/database"
	"go-backend/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/helmet"
)

func main() {
	database.ConnectDB()
	defer database.DB.Db.Disconnect(context.Background())

	app := fiber.New()

	app.Use(cors.New())
	app.Use(helmet.New(helmet.Config{XSSProtection: fiber.HeaderXXSSProtection}))

	router.SetupUserRoutes(app)
	router.SetupBooksRoutes(app)

	app.Listen(":3000")
}
