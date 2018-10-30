const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

require('dotenv').config()

const app = express()

/***** ERROR HANDLERS *****/
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const monstersRouter = require('./routes/monsters')
const weaponsRouter = require('./routes/weapons')
const goalsRouter = require('./routes/goals')
const tasksRouter = require('./routes/tasks')
const monsters_usersRouter = require('./routes/monsters_users')
const weapons_usersRouter = require('./routes/weapons_users')
const goals_usersRouter = require('./routes/goals_users')
const goals_tasksRouter = require('./routes/goals_tasks')
const authRouter = require('./routes/auth')

/***** Module Functions *****/
const authUtil = require('./util/auth')

/***** VIEW ENGINE SETUP *****/
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/***** PUBLIC *****/
const images = require('path').join(__dirname, '/public/images')
app.use(express.static(images))

/***** EXPRESS Utilities *****/
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/***** OAUTH *****/
const passport = require('passport')
const session = require('cookie-session')

app.use(session({
  secret: 'session-test',
}))

const GitHubStrategy = require('passport-github').Strategy

passport.use(new GitHubStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    userAgent: process.env.USER_AGENT
  },
  function onSuccessfulLogin(token, refreshToken, profile, done) {
    // This is a great place to find or create a user in the database
    // This function happens once after a successful login
    // Whatever you pass to `done` gets passed to `serializeUser`

    authUtil.findGitHubUser(profile._json.id)
    .then(result => {
      console.log(result)
      if (result) {
        console.log(result)
        // This *should* pull in the user info from the db
      }
      else {
        // Create new user
        let newUser = {
          name: profile._json.login,
          image: profile._json.avatar_url,
          github_id: profile._json.id
        }
        authUtil.postNewUser(newUser)
      }
    })
    done(null, {token, profile} )
  }
))

app.use(passport.initialize())
app.use(passport.session())

// take in whatever was passed into `done` inside the GitHubStrategy config
passport.serializeUser((object, done) => {
  console.log("Serialize User", {token: object})

  // when I call `done` _here_, I am passing in the data to be saved to the session
  done(null, {token: object.token})
})

passport.deserializeUser((object, done) => {
  console.log("Deserialize User", object)
  done(null, object)
})

/***** ROUTES *****/
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/monsters', monstersRouter)
app.use('/weapons', weaponsRouter)
app.use('/goals', goalsRouter)
app.use('/tasks', tasksRouter)
app.use('/monsters_users', monsters_usersRouter)
app.use('/weapons_users', weapons_usersRouter)
app.use('/goals_users', goals_usersRouter)
app.use('/goals_tasks', goals_tasksRouter)
app.use('/auth', authRouter)

/***** ERROR HANDLERS *****/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
