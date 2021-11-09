const checkJwt = require('./auth') // scope permissions
// const jwtAuthz = require('express-jwt-authz')

const express = require('express')

const log = require('../logger')
const db = require('../db/volunteers')
const { decode } = require('../notifications/emailTokens')

const router = express.Router()

// const checkAdmin = jwtAuthz(['role:admin'])

module.exports = router

router.get('/emailsignup', (req, res) => {
  const { token } = req.query
  const volunteer = decode(token)

  db.addVolunteer(volunteer)
    .then(() => {
      res.redirect(`/gardens/${volunteer.gardenId}`)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.redirect(
        `./email-volunteer-error/${volunteer.userId}/${volunteer.eventId}`
      )
    })
})

// include getTokenDecoder() like function into post route that passes authorisation header?REQUIRES TOKEN
// Verifies the data being modified belongs to the user that added it. --------------------
router.post('/', checkJwt, (req, res) => {
  const { userId, eventId } = req.body

  db.addVolunteer({ userId, eventId })
    .then(() => {
      res.sendStatus(201)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to register volunteer status'
        }
      })
    })
})

// include getTokenDecoder() like function into post route that passes authorisation header?REQUIRES TOKEN
// Verifies the data being modified belongs to the user that added it. -------------------------
router.delete('/', checkJwt, (req, res) => {
  const { userId, eventId } = req.body
  db.deleteVolunteer({ userId, eventId })
    .then(() => {
      res.sendStatus(200)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to remove volunteer status'
        }
      })
    })
})

// include getTokenDecoder() like function into post route that passes authorisation header?REQUIRES TOKEN
// ----------------------------------------------------- requires admin verification, what does isAdmin return?
router.patch('/', checkJwt, (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401).json({
      error: {
        title: 'Unauthorized'
      }
    })
    return
  }

  const { hasAttended, userId, eventId } = req.body

  db.setVolunteerAttendance({ hasAttended, userId, eventId })
    .then(() => {
      res.sendStatus(200)
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to set attendance for this volunteer/event'
        }
      })
    })
})

// include getTokenDecoder() like function into post route that passes authorisation header?REQUIRES TOKEN
router.post('/extras', checkJwt, (req, res) => {
  const { eventId, firstName, lastName } = req.body

  db.addExtraVolunteer({ eventId, firstName, lastName })
    .then((result) => {
      res.status(201).json({ extraVolId: result[0] })
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to add extra volunteer'
        }
      })
    })
})
