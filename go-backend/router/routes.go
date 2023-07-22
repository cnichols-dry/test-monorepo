package router

import (
	"go-backend/handlers"
	"go-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupUserRoutes(app *fiber.App) {
	api := app.Group("/api/user")
	api.Post("/signup", handlers.CreateUser)
	api.Post("/login", handlers.UserLogin)
}

func SetupBooksRoutes(app *fiber.App) {
	api := app.Group("/api/books")

	api.Post("/", middleware.JwtMiddleware(), handlers.CreateBook)
	api.Post("/cart/:id", middleware.JwtMiddleware(), handlers.AddToCart)

	api.Put("/cart/:id", middleware.JwtMiddleware(), handlers.ClearCart)
	api.Put("/:id", middleware.JwtMiddleware(), handlers.UpdateBook)

	api.Delete("/cart/:id", middleware.JwtMiddleware(), handlers.RemoveFromCart)
	api.Delete("/:id", middleware.JwtMiddleware(), handlers.DeleteBook)

	api.Get("/", handlers.GetBooks)
	api.Get("/:id", handlers.GetBook)
	api.Get("/cart/:userId", handlers.GetCart)
}
