import { getGarden } from './gardenHelper'
import { SET_WAITING } from '../actions/waiting'
import { dispatch, getState } from '../store'
import { SET_GARDEN } from '../actions/garden'

jest.mock('../store')

afterEach(() => {
  return jest.resetAllMocks()
})

describe('getGarden', () => {
  describe('-> GET /gardens/:id api call success', () => {
    it('dispatches with the correct garden action', () => {
      function consume (path) {
        expect(path).toMatch('2')
        return Promise.resolve({
          body: {
            name: 'test garden',
            description: 'a rad test garden',
            url: 'cooltestgarden.com',
            events: [],
            address: 'cool place, nz',
            lat: 123,
            lon: -123,
            fake: 'asdf'
          }
        })
      }
      return getGarden(2, consume)
        .then((garden) => {
          expect(dispatch).toHaveBeenCalledWith({ type: SET_WAITING })
          expect(dispatch).toHaveBeenCalledWith({
            type: SET_GARDEN,
            garden: {
              name: 'test garden',
              description: 'a rad test garden',
              url: 'cooltestgarden.com',
              events: [],
              address: 'cool place, nz',
              lat: 123,
              lon: -123
            }
          })
          return null
        })
    })
  })

  describe('-> GET /gardens/:id api call rejection', () => {
    it('dispatches error correctly', () => {
      function consume () {
        return Promise.reject(new Error('mock error'))
      }
      return getGarden(null, consume)
        .then(() => {
          expect(dispatch.mock.calls[1][0].errorMessage).toBe('mock error')
          return null
        })
    })
  })
})
