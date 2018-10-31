require('dotenv').config()
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const auth = require('./auth')

passport.serializeUser((user, done) => {
  // console.log("in serializeUser ", user)
  done(null, user.id) // go to deserializeUser
})

// Get user to store in req.user
passport.deserializeUser((id, done) => {
  // console.log('inside deser user : ', id)
  auth.findGitHubUser(id)
    .then(user => {
      done(null, user)
    })
})

passport.use(
  new GitHubStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/github/redirect'
    },
    // passport call back function
    (accessToken, refreshToken, profile, done) => {

      // console.log('passport callback function fired')
      // console.log(profile.login)

      // Check if user is in our psql db, if not, make them
      auth.findGitHubUser(profile._json.id)
        .then(currentUser => {
          console.log(profile)
          if (currentUser) {
            // already have the user
            // console.log('user is: ', currentUser)
            // null if error, or pass user
            done(null, currentUser) // when done is called, we go to passport.serializeUser
          } else {
            // Create user
            let newUser = {
              name: profile.username,
              github_id: profile.id
            }
            auth.postNewUser(newUser)
            // console.log(`created new user ${newUser.username}`)
            done(null, newUser) // when done is called, we go to passport.serializeUser
          }
        })
    }
  )
)
