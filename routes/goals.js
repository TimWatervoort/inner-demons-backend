const express = require('express')
const router = express.Router()
const knex = require('../knex')

const Joi = require('joi')

const validateUserID = (req, res, next) => {
  knex('goals')
  .where('id', req.params.id)
  .then(([data]) => {
    if (!data) {
      return res.status(400).json({ error: { message: `User ID ${req.params.id} not found` } })
    }
    next()
  })
}

const validatePostBody = (req, res, next) => {
  const postSchema = Joi.object().keys({
    name: Joi.string().required(),
    xp: Joi.number().integer().required()
  })

  const { error } = Joi.validate(req.body, postSchema)

  if (error) {
    return res.status(400).json({ "POST Schema Error": { message: error.details[0].message } })
  }
  next()
}

const buildPatchReq = (req, res, next) => {
  const patchSchema = Joi.object().keys({
    name: Joi.string(),
    xp: Joi.number().integer()
  })

  const { error } = Joi.validate(req.body, patchSchema)
  if (error) {
    return res.status(400).json({ "PATCH Schema Error": { message: error.details[0].message } })
  }

  const allowedPatchKeys = ['name', 'xp']

  // Constructs the patch request object
  let patchReq = {}
  allowedPatchKeys.forEach(key => {
    if (req.body.hasOwnProperty(key)) { patchReq[key] = req.body[key] }
  })

  // If the patch request is empty or has invalid key names, return an error
  if (Object.keys(patchReq).length === 0) {
    return res.status(400).json({ error: { message: `Empty or invalid patch request` } })
  }

  // Every patch update will create a new 'updated_at' timestamp
  patchReq.updated_at = new Date()

  // Stores the patch request-object into next request
  req.patchReq = patchReq
  next()
}

/* GET all goals record */
router.get('/', (req, res, next) => {
  knex('goals')
  .then(data => res.status(200).json(data))
  .catch(err => next(err))
})

/* GET single goals record */
router.get('/:id', validateUserID, (req, res, next) => {
  let { id } = req.params
  knex('goals')
  .where('id', id)
  .then(([goal]) => {
    knex('goals_tasks')
    .where('goal_id', goal.id)
    .then(tasks => {
      goal['tasks'] = []
      tasks.forEach(task => {
        goal['tasks'].push(task.task_id)
      })
      res.status(200).json(goal)
    })
  })
})

/* POST new goals record */
router.post('/', validatePostBody, (req, res, next) => {
  const { name, xp } = req.body

  knex('goals')
  .insert({ name, xp })
  .returning('*')
  .then(([data]) => res.status(201).json(data))
  .catch(err => next(err))
})

/* PATCH specified goals record */
router.patch('/:id', validateUserID, buildPatchReq, (req, res, next) => {
  const { patchReq } = req

  knex('goals')
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
router.delete('/:id', validateUserID, (req, res, next) => {
  knex('goals')
  .where('id', req.params.id)
  .first()
  .del()
  .returning('*')
  .then(([data]) => {
    res.status(200).json({ deleted: data })
  })
})

module.exports = router;
