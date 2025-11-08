package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"map-api/models"
)

var startTime = time.Now()

func Health(c *gin.Context) {
	uptime := time.Since(startTime).Seconds()
	c.JSON(http.StatusOK, models.HealthResponse{
		Status:  "ok",
		Version: "1.0.0",
		Uptime:  int64(uptime),
	})
}
