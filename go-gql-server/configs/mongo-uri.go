package configs

import (
	"os"

	"go.mongodb.org/mongo-driver/x/mongo/driver/connstring"
)

func EnvMongoURI() *connstring.ConnString {
	uri := os.Getenv("MONGO_CONNECTION_STRING")
	cs, err := connstring.ParseAndValidate(uri)
	if err != nil {
		panic(err)
	}
	return cs
}
