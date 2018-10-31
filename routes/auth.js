require('dotenv').config()
const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

// auth login
router.get('/login', (req, res) => {
    res.sendfile('./public/index.html')
})

// auth logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

// auth with github
// Use Passport with the github strategy that we attached to it in config
// This is where it redirects to github oauth
// Scope Proctor -> tell us what we want, returned as an array
router.get('/github', passport.authenticate('github', { scope: ['profile'] }))

// callback route for github to redirect to
// hand control to passport to use code to grab profile info
router.get('/github/redirect', passport.authenticate('github'), (req, res) => {
  console.log('inside redirect')
  let payLoad = {
    id: req.user.id,
    github_id: req.user.github_id,
    loggedIn: true,
  }
  console.log('payload', payLoad)
  let token = jwt.sign(payLoad, process.env.TOKEN_SECRET, {
    expiresIn: '8h'
  })

  console.log('token', token)
  res.cookie("jwt", token, {
    maxAge: 900000 // 15 minutes
  })

  console.log('created cookie')
  res.redirect('/home.html')
})


module.exports = router
