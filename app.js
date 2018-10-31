require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cors = require('cors')

/***** AUTH *****/
const passport = require('passport')
const passportSetup = require('./util/passport-setup')
const session = require('cookie-session')
const cookieParser = require('cookie-parser')

/***** ROUTE HANDLERS *****/
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

const app = express()

/***** VIEW ENGINE SETUP *****/
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

/***** IMAGES *****/
const images = require('path').join(__dirname, '/public/images')
app.use(express.static(images))

/***** EXPRESS Utilities *****/
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/***** PASSPORT *****/
app.use(passport.initialize())
app.use(passport.session())

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
  if (err.status === 404) {
    res.sendFile('404.html', {root: './public/'})
  }
  else {
    res.status(err.status || 500)
    res.render('error')
  }
})

module.exports = app
