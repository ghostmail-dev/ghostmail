package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/jb-1980/ghostmail/go-gql-server/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

const defaultPort = "4040"

func main() {
	godotenv.Load(".env")
	router := chi.NewRouter()

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	// Add CORS middleware around every request
	// See https://github.com/rs/cors for full option listing
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   strings.Split(allowedOrigins, ","),
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))
	srv.AddTransport(&transport.Websocket{
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				// Check against your desired domains here
				return r.Host == "example.org"
			},
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	})

	router.Handle("/graphql", srv)
	log.Printf("🚀 GraphQL server running on port %s", port)
	err := http.ListenAndServe(":4040", router)
	if err != nil {
		panic(err)
	}
}
