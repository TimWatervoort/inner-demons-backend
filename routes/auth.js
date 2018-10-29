const express = require('express')
const router = express.Router()
const knex = require('../knex')

const passport = require('passport')

router.get('/github', passport.authenticate('github'))

router.get('/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

module.exports = router
