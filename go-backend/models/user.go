package models

import (
	"context"
	"fmt"
	"go-backend/database"
	"sort"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	Id       primitive.ObjectID `bson:"_id" json:"id" validate:"unique"`
	Email    string             `json:"email" validate:"required, unique"`
	Password string             `json:"password" validate:"required"`
	Cart     struct {
		Items []CartItem `json:"items" bson:"items"`
	} `json:"cart" bson:"cart"`
}

func (user *User) AddToCart(book *Book) error {
	bookId := book.Id
	cartBookIndex := -1

	for i, item := range user.Cart.Items {
		if item.BookId == bookId {
			cartBookIndex = i
			break
		}
	}

	if cartBookIndex >= 0 {
		user.Cart.Items[cartBookIndex].Quantity++
	} else {
		user.Cart.Items = append(user.Cart.Items, CartItem{
			Id:       primitive.NewObjectID(),
			BookId:   bookId,
			Quantity: 1,
			Price:    book.Price,
		})
	}

	// Filter for finding the user by Id
	filter := bson.M{"_id": user.Id}
	// Update with the cart items using upsert option
	update := bson.M{"$set": bson.M{"cart.items": user.Cart.Items}}
	opts := options.FindOneAndUpdate().SetUpsert(true)

	result := database.UsersCollection.FindOneAndUpdate(context.Background(), filter, update, opts)

	if result.Err() != nil {
		return result.Err()
	}

	return nil
}

func (user *User) RemoveFromCart(book *Book) error {
	bookId := book.Id

	cartBookIndex := sort.Search(len(user.Cart.Items), func(i int) bool {
		return user.Cart.Items[i].BookId.String() == bookId.String()
	})

	if cartBookIndex >= 0 {
		user.Cart.Items = append(user.Cart.Items[:cartBookIndex], user.Cart.Items[cartBookIndex+1:]...)
	}

	// Filter for finding the user by Id
	filter := bson.M{"_id": user.Id}
	// Update with the cart items using upsert option
	update := bson.M{"$set": bson.M{"cart.items": user.Cart.Items}}
	opts := options.FindOneAndUpdate().SetUpsert(true)

	result := database.UsersCollection.FindOneAndUpdate(context.Background(), filter, update, opts)
	if result.Err() != nil {
		return result.Err()
	}

	return nil
}

func (user *User) ClearCart() error {
	user.Cart.Items = []CartItem{}

	// Filter for finding the user by Id
	filter := bson.M{"_id": user.Id}
	// Update with the cart items using upsert option
	update := bson.M{"$set": bson.M{"cart.items": []CartItem{}}}
	opts := options.FindOneAndUpdate().SetUpsert(true)

	result := database.UsersCollection.FindOneAndUpdate(context.Background(), filter, update, opts)
	if result.Err() != nil {
		fmt.Println(result.Err())
		return result.Err()
	}
	return nil
}
