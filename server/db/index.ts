import knexFile from './knexfile.js'
import knex from 'knex'
import type { Location, LocationData } from '../../models/Location.ts'
import type { Event, EventWithLocation, EventData } from '../../models/Event.ts'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
export const connection = knex(config)
const db = knex(config)

export async function getAllLocations() {
  const locations = await db('locations') // TODO: replace this with your knex query
  return locations as Location[]
}

export async function getEventsByDay(day: string) {
  const events = await db('events')
    .where({ day })
    .join('locations', 'events.location_id', 'locations.id')
  return events as Event[]
}

export async function getLocationById(id: number) {
  const locations = await db('locations').where({ id }).first()
  return locations
}

// export interface updatedLocation {
//   id: number,
//   name: string,
//   description: string
// }

export async function updateLocation(
  id: number,
  name: string,
  description: string,
) {
  const updatedLocation = await db('locations')
  .where({ id })
  .update({ name: name, description: description})
  .select('id', 'name', 'description')
  return updatedLocation as Location[]
}
