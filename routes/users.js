const express = require('express')
const router = express.Router()
const knex = require('../knex')

const validateUserID = (req, res, next) => {
  knex('users')
  .where('id', req.params.id)
  .then(([data]) => {
    if (!data) {
      return res.status(400).json({ error: { message: `User ID ${req.params.id} not found in request` } })
    }
    next()
  })
}

const validatePostBody = (req, res, next) => {
  // Pull user-inputed name and image-link from request
  let { name, image } = req.body

  // If either name or image are not defined in POST request, respond with an error
  if (!name || !image ) {
    return res.status(400).json({ error: { message: `No name or image in post request` } })
  }
  next()
}

const buildPatchReq = (req, res, next) => {
  const allowedPatchKeys = ['name', 'level', 'gold', 'hp', 'experience', 'points_toward_pass', 'passes', 'image']

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

/* GET all users record */
router.get('/', (req, res, next) => {
  knex('users')
  .then(data => res.status(200).json(data))
  .catch(err => next(err))
})

/* GET single user record */
router.get('/:id', validateUserID, (req, res, next) => {
  knex('users')
  .where('id', req.params.id)
  .then(([data]) => res.status(200).json(data))
  .catch(err => next(err))
})

/* POST new user record */
router.post('/', validatePostBody, (req, res, next) => {
  const { name, image } = req.body

  knex('users')
  .insert({name, image})
  .returning('*')
  .then(([data]) => res.status(201).json(data))
  .catch(err => next(err))
})

/* PATCH specified user record */
router.patch('/:id', validateUserID, buildPatchReq, (req, res, next) => {
  const { patchReq } = req

  knex('users')
  .where('id', req.params.id)
  .first()
  .update(patchReq)
  .returning('*')
  .then(([data]) => {
    res.status(200).json(data)
  })
  .catch(err => next(err))
})

/* DELETE specified user record */
router.delete('/:id', validateUserID, (req, res, next) => {
  knex('users')
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
