package models

type Point struct {
	Lng float64 `json:"lng"`
	Lat float64 `json:"lat"`
}

type RouteRequest struct {
	Coords  [][]float64 `json:"coords" binding:"required,min=2"`
	Profile string      `json:"profile" binding:"required"`
}

type CityResponse struct {
	Name      string  `json:"name"`
	Lng       float64 `json:"lng"`
	Lat       float64 `json:"lat"`
	Country   string  `json:"country,omitempty"`
	Population int    `json:"population,omitempty"`
}

type HealthResponse struct {
	Status  string `json:"status"`
	Version string `json:"version"`
	Uptime  int64  `json:"uptime"`
}

type ConfigResponse struct {
	MapTilerKey string `json:"mapTilerKey"`
	MapStyle    string `json:"mapStyle"`
	NominatimAPI string `json:"nominatimAPI"`
	OverpassAPI string `json:"overpassAPI"`
}
