const express = require('express')
const router = express.Router()
const knex = require('../knex')

router.get('/', (req, res, next) => {
  console.log(re)
  console.log('Successful Login')
  res.send('../public/index.html')
})



module.exports = router
