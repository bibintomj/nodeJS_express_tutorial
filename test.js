// getting express module
const express = require('express')
// Gets the path middleware package
const path = require('path')
// Getting ORM package
const Sequelize = require('sequelize')
// Getting body parser package
const bodyParser = require('body-parser')
// File upload helper
const expressFileUpload = require('express-fileupload')

// =========================== Package Config ========================
// Get's the object express framework
const app = express()
const port = 4000 // port

// Setting directory to serve static content
app.use(express.static(path.join(__dirname, 'public')))

// Setting view directory
app.set('views', path.join(__dirname, 'views'))

// Setting view engine
app.set('view engine', 'ejs')

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Adding file upload middleware to application
app.use(expressFileUpload())

// =========================== ORM Config ============================
// Sequelize package database configuration
const ormObj = new Sequelize(
    'test', // database name
    'root', // db Username
    'pass', { // db Password
      dialect: 'mysql', // Specifying DBMS
      logging: false // Disables console logging queries
    }
)

// User Model definition
const User = ormObj.define('user', { // Table name
  id: { // field name
    type: Sequelize.INTEGER, // field type for INT
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
  },
  profile: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true, // To user original name of table
  timestamps: false // Prevents sequelize from creating default columns
})

// =========================== Routes ================================
// Home page route
app.get('/', function (req, res, next) {
  app.locals.pageTitle = 'Home'
  res.render('home')
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

// =========================== CURD Routes ===========================
// ___________________________ Create User Operation _________________
app.get('/user/add', function (req, res, next) {
  req.app.locals.pageTitle = 'Add User'
  res.render('add')
})

app.post('/user/add', function (req, res, next) {
  // gets POST body
  let formData = req.body

  // Gets uploaded image object
  let imageData = req.files.image

  // Uploading image to /public/uploads directory if present
  if (imageData) {
    imageData.mv(
      path.join(__dirname, './public/uploads/', imageData.name),
      function (err) {
        if (err) {
          next(new Error(err))
        }
      }
    )
  }

  // Save data to database
  // following create function is equivalent to
  // INSERT INTO user(name, age, dob, doj) VALUES ('joe', 25, ...)
  User.create({
    name: formData.name,
    age: formData.age,
    dob: formData.dob,
    doj: Sequelize.fn('NOW'),
    profile: imageData ? imageData.name : null
  }).catch(err => {
    if (err) next(new Error(err))
  })

  res.redirect('/user/list')
})

// ___________________________ List User Operation ___________________
app.get('/user/list', function (req, res, next) {
  // setting page header
  req.app.locals.pageTitle = 'List User'

  // gets all user details from database
  // following findAll function is equivalent to
  // SELECT id, name, age, profile FROM user
  User.findAll({
    attributes: ['id', 'name', 'age', 'profile']
  }).then(results => {
    // Render the view page
    res.render('list', {userData: results})
  }).catch(err => {
    if (err) next(new Error(err))
  })
})

// ___________________________ Update User Operation _________________
app.get('/user/add/:userId', function (req, res, next) {
  // Gets the ID of the user from URL
  let userId = req.params.userId
  // Setting page heading
  res.locals.pageTitle = 'Edit User'

  // gets the user data
  User.findOne({
    where: {
      id: userId
    }
  }).then(result => {
    res.render('add', {
      userData: result
    })
  }).catch(err => {
    if (err) next(new Error(err))
  })
})

app.post('/user/edit', function (req, res, next) {
  // gets the form data
  let formData = req.body

  // Gets uploaded image object
  let imageData = req.files.image

  let userData = { // value object
    name: formData.name,
    age: formData.age,
    dob: formData.dob
  }

  // Uploading image to /public/uploads directory if present
  if (imageData) {
    userData.profile = imageData.name
    imageData.mv(
      path.join(__dirname, './public/uploads/', imageData.name),
      function (err) {
        if (err) {
          next(new Error(err))
        }
      }
    )
  }

  // Updates user data
  User.update(userData, { // Option object
    where: {
      id: formData.id
    }
  }).then(updRes => res.redirect('/user/list')).catch(err => {
    if (err) next(new Error(err))
  })
})

// ___________________________ Delete User Operation _________________
app.get('/user/delete/:userId', function (req, res, next) {
  // deletes user data of the given user ID
  User.destroy({
    where: {
      id: req.params.userId
    }
  }).then(delRes => res.redirect('/user/list')).catch(err => {
    if (err) next(new Error(err))
  })
})
// =========================== Error Routes ==========================
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
  res.send(`<h1>Server Error</h1> <br/>
    Error Message: <b>${err.message}</b>`
  )
})

// =========================== Server Setup ==========================
app.listen(port, function () {
  console.log(`Express started on http://localhost:'${port};
  press Ctrl-C to terminate.`
  )
})
