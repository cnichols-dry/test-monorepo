package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CartItem struct {
	Id       primitive.ObjectID `json:"id" bson:"_id" validate:"unique"`
	BookId   primitive.ObjectID `json:"bookId" bson:"bookId" validate:"required"`
	Quantity int                `json:"quantity" validate:"required"`
	Price    float64            `json:"price" validate:"required"`
}
