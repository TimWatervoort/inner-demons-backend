const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const usersRouter = require('./routes/users')
const monstersRouter = require('./routes/monsters')
const weaponsRouter = require('./routes/weapons')
const goalsRouter = require('./routes/goals')
const tasksRouter = require('./routes/tasks')
const monsters_usersRouter = require('./routes/monsters_users')
const weapons_usersRouter = require('./routes/weapons_users')
const goals_usersRouter = require('./routes/goals_users')
const goals_tasksRouter = require('./routes/goals_tasks')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', usersRouter)
app.use('/monsters', monstersRouter)
app.use('/weapons', weaponsRouter)
app.use('/goals', goalsRouter)
app.use('/tasks', tasksRouter)
app.use('/monsters_users', monsters_usersRouter)
app.use('/weapons_users', weapons_usersRouter)
app.use('/goals_users', goals_usersRouter)
app.use('/goals_tasks', goals_tasksRouter)

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
