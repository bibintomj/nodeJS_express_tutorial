// getting express module
const express = require('express')
const app = express()
const port = 4000 // port

// Home page route
app.get('/', function(req, res, next){
  res.send('<h1>Homepage</h1>')
})

// About page route
app.get('/about', function(req, res, next){
  res.send('<h1>About</h1>')
})

// Hello page route
app.get('/hello/:name', function(req, res, next){
  // Gets name from query string
  let name = req.params.name
  res.send('<h1>Hello ' + name + '</h1>')
})

// Error page route
app.get('/error', function(req, res, next){
  // passing a custom error to error handler route
  next(new Error('testing error'))
})

// 404 page route
app.use(function (req, res, next) {
  res.status(404);
  res.send('<h1>Not Found</h1>')
})

// Error handler route
app.use(function(err, req, res, next){
  // shows error stack in console
  console.error(err.stack)
  res.status(500)
  // shows error message
  res.send('<h1>Server Error</h1> <br/> Error Message: <b>' + err.message  + '</b>')
})

app.listen(port, function () {
  console.log('Express started on http://localhost:' +
  port + '; press Ctrl-C to terminate.')
})