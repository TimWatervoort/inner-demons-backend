const express = require('express')
const router = express.Router()
const knex = require('../knex')

/* GET all monsters record */
router.get('/', (req, res, next) => {
  knex('weapons_users')
  .then(data => res.status(200).json(data))
  .catch(err => next(err))
})

/* GET single monsters record */
router.get('/:id', (req, res, next) => {
  knex('weapons_users')
  .where('id', req.params.id)
  .then(([data]) => res.status(200).json(data))
  .catch(err => next(err))
})

/* POST new monsters record */
router.post('/', (req, res, next) => {
  const { weapon_id, user_id } = req.body

  knex('weapons_users')
  .insert({ monster_id, user_id })
  .returning('*')
  .then(([data]) => res.status(201).json(data))
  .catch(err => next(err))
})

/* PATCH specified monsters record */
router.patch('/:id', (req, res, next) => {
  const { patchReq } = req

  knex('weapons_users')
  .where('id', req.params.id)
  .first()
  .update(patchReq)
  .returning('*')
  .then(([data]) => {
    res.status(200).json(data)
  })
  .catch(err => next(err))
})

/* DELETE specified monsters record */
router.delete('/:id', (req, res, next) => {
  knex('weapons_users')
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
