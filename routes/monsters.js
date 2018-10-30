const express = require('express')
const router = express.Router()
const knex = require('../knex')

const Joi = require('joi')

const validateUserID = (req, res, next) => {
  knex('monsters')
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
    description: Joi.string().required(),
    attack: Joi.number().integer().required(),
    hp: Joi.number().integer().required(),
    image: Joi.string().regex(/\/.*\.png/).required()
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
    description: Joi.string(),
    attack: Joi.number().integer(),
    hp: Joi.number().integer(),
    image: Joi.string().regex(/\/.*\.png/)
  })

  const { error } = Joi.validate(req.body, patchSchema)
  if (error) {
    return res.status(400).json({ "PATCH Schema Error": { message: error.details[0].message } })
  }

  const allowedPatchKeys = ['name', 'description', 'attack', 'hp', 'image']

  // Constructs the patch request object
  let patchReq = {}
  allowedPatchKeys.forEach(key => {
    if (req.body.hasOwnProperty(key)) { patchReq[key] = req.body[key] }
  })

  // If the patch request is empty or has invalid key names, return an error
  if (Object.keys(patchReq).length === 0) {
    return res.status(400).json({ error: { message: `Empty or invalid patch request` } })
  }

  // Stores the patch request object into request
  req.patchReq = patchReq
  next()
}

/* GET all monsters record */
router.get('/', (req, res, next) => {
  knex('monsters')
  .then(data => res.status(200).json(data))
  .catch(err => next(err))
})

/* GET single monsters record */
router.get('/:id', validateUserID, (req, res, next) => {
  knex('monsters')
  .where('id', req.params.id)
  .then(([data]) => res.status(200).json(data))
  .catch(err => next(err))
})

/* POST new monsters record */
router.post('/', validatePostBody, (req, res, next) => {
  const { name, description, attack, hp, image } = req.body

  knex('monsters')
  .insert({ name, description, attack, hp, image })
  .returning('*')
  .then(([data]) => res.status(201).json(data))
  .catch(err => next(err))
})

/* PATCH specified monsters record */
router.patch('/:id', validateUserID, buildPatchReq, (req, res, next) => {
  const { patchReq } = req

  knex('monsters')
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
router.delete('/:id', validateUserID, (req, res, next) => {
  knex('monsters')
  .where('id', req.params.id)
  .first()
  .del()
  .returning('*')
  .then(([data]) => {
    res.status(200).json({ deleted: data })
  })
})

module.exports = router
