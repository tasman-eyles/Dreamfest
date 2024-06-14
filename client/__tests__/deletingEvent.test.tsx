// @vitest-environment jsdom
import { setupApp } from './setup.tsx'
import { beforeAll, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import nock from 'nock'


beforeAll(() => {
  nock.disableNetConnect()
})

describe('Click Delete', () => {
  it('deletes an event', async () => {
    const scope = nock('http://localhost')
      .persist()
      .get('/api/v1/events/1')
      .reply(200, {
        id: 4,
        locationId: 1,
        day: 'friday',
        time: '2pm - 3pm',
        name: 'Slushie Apocalypse I',
        description:
          'This is totally a description of this really awesome event that will be taking place during this festival at the Yella Yurt. Be sure to not miss the free slushies cause they are rad!',
      })
      .get('/api/v1/locations')
      .reply(200, {
        locations: [
          {
            name: 'TangleStage',
            description: 'Not the biggest stage, but possibly the most hip.',
            id: 1,
          },
        ],
      })
      .delete('/api/v1/events/1')
      .reply(204)
      .get('/api/v1/schedule/friday')
      .matchHeader('accept-encoding', 'gzip, deflate')
      .reply(200, {
        day: 'friday',
        events: [
          {
            id: 2,
            day: 'friday',
            time: '6pm - 7pm',
            eventName: 'LEGO Builder Championships',
            locationName: 'Yella Yurt',
            description:
              'This event will be taking place at the Yella Yurt. Come see what marvels our championship builders have built over the past 7 days!',
          },
        ],
      })
    const screen = setupApp('/events/1/edit')
    const del = await screen.findByText(/delete event/i)
    await userEvent.click(del)

    const heading = await screen.findByText('LEGO Builder Championships')
    expect(heading).toBeVisible()
    expect(await screen.queryByText('Slushie Apocalypse I')).toBeFalsy()
    expect(scope.isDone()).toBe(true)
  })
})
