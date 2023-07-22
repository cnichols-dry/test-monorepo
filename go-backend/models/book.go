package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Book struct {
	Id          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `json:"title" validate:"required"`
	Author      string             `json:"author" validate:"required"`
	Price       float64            `json:"price" validate:"required"`
	ImageURL    string             `json:"imageURL" validate:"required"`
	Description string             `json:"description" validate:"required"`
	Creator     primitive.ObjectID `json:"creator" validate:"required"`
}
