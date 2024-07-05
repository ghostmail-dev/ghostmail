package mongodb

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB struct {
	Client *mongo.Client
	Ctx    context.Context
	Cancel context.CancelFunc
	Err    error
}

func Close(client *mongo.Client, ctx context.Context, cancel context.CancelFunc) {
	defer cancel()

	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()
}

func ConnectDB(uri string) *DB {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))

	db := &DB{
		Client: client,
		Ctx:    ctx,
		Cancel: cancel,
		Err:    err,
	}
	return db
}

func GetCollection(db *DB, collection string) *mongo.Collection {
	return db.Client.Database("ghostmail").Collection(collection)
}
