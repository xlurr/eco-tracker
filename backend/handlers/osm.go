package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"map-api/models"

	"github.com/gin-gonic/gin"
)

func GetCity(c *gin.Context) {
	cityName := c.Param("name")
	url := fmt.Sprintf("%s/search?format=json&q=%s&limit=1", cfg.NominatimAPI, cityName)
	resp, _ := fetchJSON(url)

	var results []map[string]interface{}
	json.Unmarshal(resp, &results)

	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	city := results[0]
	c.JSON(http.StatusOK, models.CityResponse{
		Name: city["name"].(string),
		Lat:  parseFloat(city["lat"]),
		Lng:  parseFloat(city["lon"]),
	})
}

func GetAddress(c *gin.Context) {
	lat := c.Query("lat")
	lng := c.Query("lng")

	url := fmt.Sprintf("%s/reverse?format=json&lat=%s&lon=%s", cfg.NominatimAPI, lat, lng)
	resp, _ := fetchJSON(url)

	var result map[string]interface{}
	json.Unmarshal(resp, &result)

	c.JSON(http.StatusOK, gin.H{"display_name": result["display_name"]})
}

func GetPOIs(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"elements": []interface{}{}})
}

func GetElevation(c *gin.Context) {
	lat := c.Query("lat")
	lng := c.Query("lng")

	c.JSON(http.StatusOK, gin.H{
		"lat":       lat,
		"lng":       lng,
		"elevation": 50.5,
	})
}

func fetchJSON(url string) ([]byte, error) {
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return io.ReadAll(resp.Body)
}

func parseFloat(v interface{}) float64 {
	switch val := v.(type) {
	case float64:
		return val
	case string:
		var f float64
		fmt.Sscanf(val, "%f", &f)
		return f
	}
	return 0
}
