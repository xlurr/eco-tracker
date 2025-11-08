package config

import (
	"os"
)

type Config struct {
	Port              string
	GinMode           string
	CORSOrigins       string
	MapTilerKey       string
	MapStyle          string
	MapTilerLight     string
	NominatimAPI      string
	OverpassAPI       string
	ORSAPIKey         string
	ORSUrl            string
}

func Load() Config {
	return Config{
		Port:              getEnv("PORT", "8080"),
		GinMode:           getEnv("GIN_MODE", "release"),
		CORSOrigins:       getEnv("CORS_ORIGINS", "*"),
		MapTilerKey:       getEnv("VITE_MAPTILER_API_KEY", ""),
		MapStyle:          getEnv("VITE_MAP_STYLE", "https://api.maptiler.com/maps/streets-v2/style.json"),
		MapTilerLight:     getEnv("VITE_MAPTILER_LIGHT", "https://api.maptiler.com/maps/toner-v2/style.json"),
		NominatimAPI:      getEnv("VITE_NOMINATIM_API", "https://nominatim.openstreetmap.org"),
		OverpassAPI:       getEnv("VITE_OVERPASS_API", "https://overpass-api.de/api/interpreter"),
		ORSAPIKey:         getEnv("ORS_API_KEY", ""),
		ORSUrl:            getEnv("ORS_URL", "https://api.openrouteservice.org/v2/directions"),
	}
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}
