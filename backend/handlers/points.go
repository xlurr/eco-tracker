package handlers

import (
	"math/rand"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"map-api/models"
)

func GetRandomPoints(c *gin.Context) {
	n := 20
	if q := c.Query("n"); q != "" {
		if v, err := strconv.Atoi(q); err == nil && v > 0 && v <= 100 {
			n = v
		}
	}

	points := make([]models.Point, n)
	for i := 0; i < n; i++ {
		points[i] = models.Point{
			Lng: 20.0 + rand.Float64()*40.0,
			Lat: 40.0 + rand.Float64()*30.0,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"count":  n,
		"points": points,
	})
}
