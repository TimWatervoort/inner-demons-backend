require('dotenv').config()
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const validateUserID = (req, res, next) => {
  knex('users')
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
    github_id: Joi.string(),
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
    level: Joi.number().integer(),
    gold: Joi.number().integer(),
    hp: Joi.number().integer(),
    xp: Joi.number().integer(),
    points_toward_pass: Joi.number().integer(),
    passes: Joi.number().integer(),
    image: Joi.string()
  })

  const { error } = Joi.validate(req.body, patchSchema)
  if (error) {
    return res.status(400).json({ "PATCH Schema Error": { message: error.details[0].message } })
  }

  const allowedPatchKeys = ['name', 'level', 'gold', 'hp', 'xp', 'points_toward_pass', 'passes', 'image']

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

/* VERIFY and GET single user record */
router.get('/verify', (req, res, next) => {
  let jwtToken = req.cookies.jwt
  let id = jwt.verify(jwtToken, process.env.TOKEN_SECRET).id

  knex('users')
    .where('id', id)
    .then(([user]) => {
      knex('monsters_users')
        .where('user_id', user.id)
        .then(monsters => {
          let monsIdArr = []
          monsters.forEach(monster => {
            monsIdArr.push(monster.monster_id)
          })
          user['monsters'] = monsIdArr
        })
        .then(() => {
          knex('weapons_users')
            .where('user_id', user.id)
            .then(weapons => {
              let weapsIdArr = []
              weapons.forEach(weapon => {
                weapsIdArr.push(weapon.weapon_id)
              })
              user['weapons'] = weapsIdArr
            })
            .then(() => {
              knex('goals_users')
                .where('user_id', user.id)
                .then(goals => {
                  let goalsIdArr = []
                  goals.forEach(goal => {
                    goalsIdArr.push(goal.goal_id)
                  })
                  user['goals'] = goalsIdArr
                  res.status(200).json(user)
                })
            })
        })
    })
})

/* GET a single user record */
router.get('/:id', (req, res, next) => {
  let { id } = req.params
  knex('users')
    .where('id', id)
    .then(([user]) => {
      knex('monsters_users')
        .where('user_id', user.id)
        .then(monsters => {
          let monsIdArr = []
          monsters.forEach(monster => {
            monsIdArr.push(monster.monster_id)
          })
          user['monsters'] = monsIdArr
        })
        .then(() => {
          knex('weapons_users')
            .where('user_id', user.id)
            .then(weapons => {
              let weapsIdArr = []
              weapons.forEach(weapon => {
                weapsIdArr.push(weapon.weapon_id)
              })
              user['weapons'] = weapsIdArr
            })
            .then(() => {
              knex('goals_users')
                .where('user_id', user.id)
                .then(goals => {
                  let goalsIdArr = []
                  goals.forEach(goal => {
                    goalsIdArr.push(goal.goal_id)
                  })
                  user['goals'] = goalsIdArr
                  res.status(200).json(user)
                })
            })
        })
    })
})

/* POST new user record */
router.post('/', validatePostBody, (req, res, next) => {
  const { name, github_id } = req.body

  knex('users')
  .insert({ name, image })
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
    res.status(200).json({ deleted: data })
  })
})

module.exports = router
