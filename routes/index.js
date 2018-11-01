const express = require('express')
const router = express.Router()
const knex = require('../knex')

router.get('/home', (req, res, next) => {
  console.log('Successful Login')
  res.send('/home.html')
})

module.exports = router
