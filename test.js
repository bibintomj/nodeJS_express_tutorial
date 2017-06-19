// getting express module
const express = require('express')
const app = express()
const port = 4000 // port

// Getting ORM package
const Sequelize = require('sequelize')

const ormConnection = new Sequelize(
    'test',
    'root',
    'pass', {
      logging: false // Disables console logging queries
    }
)

const User = ormConnection.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  dob: {
    type: Sequelize.DATEONLY,
    allowNull: true
  },
  doj: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
})

// Setting view directory
app.set('views', './views')

// Setting view engine
app.set('view engine', 'ejs')

// Home page route
app.get('/', function (req, res, next) {
  res.send('<h1>Homepage</h1>')
})

// About page route
app.get('/about', function (req, res, next) {
  res.send('<h1>About</h1>')
})

// Hello page route
app.get('/hello/:name', function (req, res, next) {
  // Gets name from query string
  let name = req.params.name

  // Renders view using ejs template
  res.render('hello', { name: name })
})

// User listing route
app.get('/user/list', function (req, res, next) {
  // Code
})

// User Add form route
app.get('/user/add', function (req, res, next) {
  res.render('add')
})

// User Add form processing route
app.post('/user/add', function (req, res, next) {
// Code
})

// Error page route
app.get('/error', function (req, res, next) {
  // passing a custom error to error handler route
  next(new Error('testing error'))
})

// 404 page route
app.use(function (req, res, next) {
  res.status(404)
  res.send('<h1>Not Found</h1>')
})

// Error handler route
app.use(function (err, req, res, next) {
  // shows error stack in console
  console.error(err.stack)
  res.status(500)
  // shows error message
  res.send('<h1>Server Error</h1> <br/> Error Message: <b>' + err.message + '</b>')
})

app.listen(port, function () {
  console.log('Express started on http://localhost:' +
  port + '; press Ctrl-C to terminate.')
})
