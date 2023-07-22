package handlers

import (
	"context"
	"fmt"
	"go-backend/database"
	"go-backend/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetBooks(c *fiber.Ctx) error {
	var bookquery *mongo.Cursor = &mongo.Cursor{}
	books := []models.Book{}
	pageSize := c.QueryInt("pagesize")
	currentPage := c.QueryInt("page")

	if pageSize > 0 && currentPage > 0 {
		paginationResult, err := database.BooksCollection.Find(c.Context(), bson.M{}, options.Find().SetSkip(int64(pageSize*(currentPage-1))).SetLimit(int64(pageSize)))

		if err != nil {
			return err
		}
		bookquery = paginationResult
	} else {
		result, err := database.BooksCollection.Find(c.Context(), bson.M{})
		if err != nil {
			return err
		}
		bookquery = result
	}

	bookquery.All(c.Context(), &books)
	fmt.Println("books cont", books)
	countDocs, err := database.BooksCollection.CountDocuments(c.Context(), bson.M{})
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":  "Books fetched successfully",
		"books":    books,
		"maxBooks": countDocs,
	})
}

func GetBook(c *fiber.Ctx) error {
	var book models.Book
	bookId, _ := primitive.ObjectIDFromHex(c.Params("id"))

	err := database.BooksCollection.FindOne(context.Background(), bson.M{"_id": bookId}).Decode(&book)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": fmt.Sprintf("book %s not found", bookId)})
	}

	return c.Status(fiber.StatusOK).JSON(book)
}

func GetCart(c *fiber.Ctx) error {
	userId, err := primitive.ObjectIDFromHex(c.Params("userId"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid user ID",
		})
	}

	user := models.User{}
	err = database.UsersCollection.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"cart":    user.Cart,
		"message": "Cart fetched successfully",
	})
}

func CreateBook(c *fiber.Ctx) error {
	book := new(models.Book)

	if err := c.BodyParser(book); err != nil {
		return err
	}
	book.Id = primitive.NewObjectID()

	result, err := database.BooksCollection.InsertOne(context.Background(), book)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Creating a book failed"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Book added successfully",
		"book": result})
}

func UpdateBook(c *fiber.Ctx) error {
	book := new(models.Book)
	if err := c.BodyParser(book); err != nil {
		return err
	}

	_, err := database.BooksCollection.ReplaceOne(context.Background(), bson.M{"_id": book.Id}, book)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Could not update book"})
	}

	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Updated successfully"})
}

func DeleteBook(c *fiber.Ctx) error {
	bookId, _ := primitive.ObjectIDFromHex(c.Params("id"))

	result, err := database.BooksCollection.DeleteOne(context.Background(), bson.M{"_id": bookId})

	if err != nil || result.DeletedCount == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "deleting book failed",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Book deleted successfully",
	})
}

func AddToCart(c *fiber.Ctx) error {
	var book models.Book
	var user models.User

	bookId, _ := primitive.ObjectIDFromHex(c.Params("id"))

	var requestBody map[string]string
	c.BodyParser(&requestBody)

	userId, _ := primitive.ObjectIDFromHex(requestBody["userId"])

	errBook := database.BooksCollection.FindOne(context.Background(), bson.M{"_id": bookId}).Decode(&book)
	if errBook != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": fmt.Sprintf("book %s not found", bookId)})
	}

	errUser := database.UsersCollection.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)
	if errUser != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": fmt.Sprintf("user %s not found", userId)})
	}

	err := user.AddToCart(&book)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "adding item to cart Failed",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "item added to cart",
	})
}

func ClearCart(c *fiber.Ctx) error {
	var user models.User
	userId, _ := primitive.ObjectIDFromHex(c.Params("id"))

	err := database.UsersCollection.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "user not found :("})
	}

	err = user.ClearCart()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "failed clearing cart",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "cart cleared successfully",
	})
}

func RemoveFromCart(c *fiber.Ctx) error {
	var user models.User
	var book models.Book
	bookId, _ := primitive.ObjectIDFromHex(c.Query("bookId"))
	userId, _ := primitive.ObjectIDFromHex(c.Params("id"))

	database.BooksCollection.FindOne(context.Background(), bson.M{"_id": bookId}).Decode(&book)

	database.UsersCollection.FindOne(context.Background(), bson.M{"_id": userId}).Decode(&user)

	err := user.RemoveFromCart(&book)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "remove failed"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "item removed successfully"})
}