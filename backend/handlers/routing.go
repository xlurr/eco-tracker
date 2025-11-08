package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"map-api/config"
	"map-api/models"
)

var cfg = config.Load()

func PostRoute(c *gin.Context) {
	var req models.RouteRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.Coords) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "at least 2 coordinates required"})
		return
	}

	if cfg.ORSAPIKey == "" {
		c.JSON(http.StatusOK, straightLineGeoJSON(req.Coords))
		return
	}

	body := map[string]interface{}{"coordinates": req.Coords}
	bs, _ := json.Marshal(body)

	url := fmt.Sprintf("%s/%s/geojson", cfg.ORSUrl, req.Profile)
	httpReq, _ := http.NewRequestWithContext(context.Background(), "POST", url, bytes.NewReader(bs))
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", cfg.ORSAPIKey)

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	out, _ := io.ReadAll(resp.Body)
	c.Data(resp.StatusCode, "application/json", out)
}

func straightLineGeoJSON(coords [][]float64) gin.H {
	return gin.H{
		"type": "FeatureCollection",
		"features": []gin.H{
			{
				"type": "Feature",
				"geometry": gin.H{
					"type":        "LineString",
					"coordinates": coords,
				},
				"properties": gin.H{},
			},
		},
	}
}
