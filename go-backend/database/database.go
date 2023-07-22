package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DBInstance struct {
	Db *mongo.Client
}

var DB DBInstance
var BooksCollection *mongo.Collection
var UsersCollection *mongo.Collection

func ConnectDB() {
	mongoURI := fmt.Sprintf("mongodb+srv://%s:%s@%s/%s", os.Getenv("MONGO_ATLAS_USER"), os.Getenv("MONGO_ATLAS_PW"), os.Getenv("MONGO_ATLAS_CLUSTER"), os.Getenv("MONGO_DB_NAME"))

	clientOpts := options.Client().ApplyURI(mongoURI).SetTimeout(10 * time.Second)
	client, err := mongo.Connect(context.Background(), clientOpts)
	if err != nil {
		log.Fatal(err)
	}

	DB = DBInstance{
		Db: client,
	}

	BooksCollection = GetCollection(DB.Db, "books")
	UsersCollection = GetCollection(DB.Db, "users")
	fmt.Println("Connected to MongoDB Instance successfully")
}

// get database collection
func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	collection := client.Database(os.Getenv("MONGO_DB_NAME")).Collection(collectionName)
	return collection
}
