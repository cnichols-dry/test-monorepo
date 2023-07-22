package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func JwtMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the token from the Authorization header
		authHeader := c.Get("Authorization")
		if len(authHeader) <= 7 || authHeader[:7] != "Bearer " {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "You are not authenticated",
			})
		}

		tokenString := authHeader[7:]

		// Parse and verify the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_KEY")), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "You are not authenticated",
			})
		}

		// Extract the claims from the token
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "You are not authenticated",
			})
		}

		// Add the user data to the request context
		c.Locals("userData", claims)

		return c.Next()
	}
}
