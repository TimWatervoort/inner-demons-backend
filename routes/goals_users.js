const express = require('express')
const router = express.Router()
const knex = require('../knex')

/* GET all goals record */
router.get('/', (req, res, next) => {
  knex('goals_users')
  .then(data => res.status(200).json(data))
  .catch(err => next(err))
})

/* GET single goals record */
router.get('/:id', (req, res, next) => {
  knex('goals_users')
  .where('id', req.params.id)
  .then(([data]) => res.status(200).json(data))
  .catch(err => next(err))
})

/* POST new goals record */
router.post('/', (req, res, next) => {
  const { goal_id, user_id } = req.body

  knex('goals_users')
  .insert({ goal_id, user_id })
  .returning('*')
  .then(([data]) => res.status(201).json(data))
  .catch(err => next(err))
})

/* PATCH specified goals record */
router.patch('/:id', (req, res, next) => {
  const { patchReq } = req

  knex('goals_users')
  .where('id', req.params.id)
  .first()
  .update(patchReq)
  .returning('*')
  .then(([data]) => {
    res.status(200).json(data)
  })
  .catch(err => next(err))
})

/* DELETE specified goals record */
router.delete('/:id', (req, res, next) => {
  knex('goals_users')
  .where('id', req.params.id)
  .first()
  .del()
  .returning('*')
  .then(([data]) => {
    console.log('deleted', data)
    res.status(200).json({ deleted: data })
  })
})

module.exports = router;
