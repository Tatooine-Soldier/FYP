package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/gob"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserBSON struct {
	Username string `bson:"username"`
	Email    string `bson:"email"`
	Password string `bson:"password"`
}

// encode the string array into byte array
func encodeToByte(pw []string) []byte {
	buf := &bytes.Buffer{}
	bytedPw := buf.Bytes()
	if len(pw) != 0 {
		gob.NewEncoder(buf).Encode(pw)
		bytedPw = buf.Bytes()
		return bytedPw
	}
	return bytedPw
}

func CreateUser(user *User) (err error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var arr []string
	arr[0] = user.Password
	itemByted := encodeToByte(arr)

	hashedVal := sha256.New()
	hashedVal.Write([]byte(itemByted))
	userB := bson.D{{"fullName", user.Username}, {"email", user.Email}, {"password", hashedVal.Sum(nil)}}

	err = insertDB(context.TODO(), client, userB, "users")
	return err
}

func UserExists(user *User) (b bool) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var arr []string
	arr[0] = user.Password
	itemByted := encodeToByte(arr)

	hashedVal := sha256.New()
	hashedVal.Write([]byte(itemByted))

	userB := bson.D{{"fullName", user.Username}, {"password", hashedVal.Sum(nil)}}

	usersCollection := client.Database("fyp_test").Collection("users")

	cursor, err := usersCollection.Find(context.TODO(), userB)

	var results []bson.D
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	if len(results) != 0 {
		fmt.Println("user exists")
		return true
	}

	return false
}
