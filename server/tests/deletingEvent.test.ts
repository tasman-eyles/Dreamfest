import request from 'supertest'
import { expect, it, describe, beforeAll, beforeEach } from 'vitest'
import { connection } from '../db/index.ts'
import server from '../server.ts'

beforeAll(async () => {
  await connection.migrate.latest()
})
beforeEach(async () => {
  await connection.seed.run()
})

describe('Delete an Event', () => {
  it('Deletes as Event', async () => {
    const before = await request(server).get('/api/v1/schedule/friday')
    console.log(before)
    const expected = [before.body.events[1]]
    const length = before.body.events.length
    await request(server).delete('/api/v1/events/1')
    const after = await request(server).get('/api/v1/schedule/friday')
    const actual = after.body.events
    expect(actual.length).toBeLessThan(length)
    expect(actual).toStrictEqual(expected)
  })
})
