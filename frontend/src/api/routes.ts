import client from './client'
import { Point, RouteRequest } from '../types'

export const api = {
  getRandomPoints: async (n: number = 20): Promise<Point[]> => {
    const { data } = await client.get('/api/points/random', { params: { n } })
    return data.points || []
  },

  getRoute: async (req: RouteRequest) => {
    const { data } = await client.post('/api/route', req)
    return data
  },

  getCity: async (name: string) => {
    const { data } = await client.get(`/api/city/${name}`)
    return data
  },
}
