export interface Point {
  lng: number
  lat: number
}

export interface RouteRequest {
  coords: [number, number][]
  profile: string
}

export interface CityResponse {
  name: string
  lng: number
  lat: number
  country?: string
  population?: number
}
