package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"map-api/config"
	"map-api/models"
)

func GetConfig(c *gin.Context) {
	cfg := config.Load()
	c.JSON(http.StatusOK, models.ConfigResponse{
		MapTilerKey:  cfg.MapTilerKey,
		MapStyle:     cfg.MapStyle + "?key=" + cfg.MapTilerKey,
		NominatimAPI: cfg.NominatimAPI,
		OverpassAPI:  cfg.OverpassAPI,
	})
}
