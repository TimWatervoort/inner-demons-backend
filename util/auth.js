const knex = require('../knex')

const findGitHubUser = (githubId) => {
  return knex('users')
    .where('github_id', githubId)
    .then(([user]) => {
      return user
    })
    .catch(err => console.log(`findGitHubUser oAuth route error: ${err}`) )
}

const postNewUser = (newUserObj) => {
  return knex('users')
    .insert(newUserObj)
    .returning('*')
    .then(([user]) => user)
    .catch(err => console.log(`postNewUser oAuth route error: ${err}`) )
}

module.exports = { findGitHubUser, postNewUser }
