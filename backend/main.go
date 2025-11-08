package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"map-api/config"
	"map-api/handlers"
)

func main() {
	_ = godotenv.Load()

	config.Load()

	r := gin.Default()

	// ✅ ДОБАВЬ ПРАВИЛЬНЫЙ CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           3600,
	}))

	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// Health & Config
	r.GET("/health", handlers.Health)
	r.GET("/config", handlers.GetConfig)

	// API Routes
	api := r.Group("/api")
	{
		api.GET("/points/random", handlers.GetRandomPoints)
		api.POST("/route", handlers.PostRoute)
		api.GET("/city/:name", handlers.GetCity)
		api.GET("/address", handlers.GetAddress)
		api.GET("/pois", handlers.GetPOIs)
		api.GET("/elevation", handlers.GetElevation)
	}

	// Frontend
	r.Static("/assets", "./web/assets")
	r.NoRoute(func(c *gin.Context) {
		c.File("./web/index.html")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server listening on :%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
