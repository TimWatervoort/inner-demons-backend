const express = require('express')
const router = express.Router()
const knex = require('../knex')

/* GET all goal/task record */
router.get('/', (req, res, next) => {
  knex('goals_tasks')
  .then(data => res.status(200).json(data))
  .catch(err => next(err))
})

/* GET single goal/task record */
router.get('/:id', (req, res, next) => {
  knex('goals_tasks')
  .where('id', req.params.id)
  .then(([data]) => res.status(200).json(data))
  .catch(err => next(err))
})

/* POST new goal/task record */
router.post('/', (req, res, next) => {
  const { goal_id, task_id } = req.body

  knex('goals_tasks')
  .insert({ goal_id, task_id })
  .returning('*')
  .then(([data]) => res.status(201).json(data))
  .catch(err => next(err))
})

/* PATCH specified goal/task record */
router.patch('/:id', (req, res, next) => {
  const { patchReq } = req

  knex('goals_tasks')
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
  knex('goals_tasks')
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
