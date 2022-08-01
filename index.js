const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// require settings data
const settings = require('./staticData/settings.js')

// initial express js application
const app = express()

// standart express middleweare settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
	res.contentType('application/json')
	next()
})
app.use(cors())

// declare init program function
async function init (settings) {

  // connect to mongodb
  mongoose.connect(settings.mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

  // function of event on mongodb connection open
  mongoose.connection.once('open', async () => {
    // listen http express server
    app.listen(settings.PORT, '0.0.0.0', (err) => {
			if (err) return new Error(`error in starting server, error: ${err}`)
			else console.log(`server started on \nPORT: ${settings.PORT}\nURL: ${settings.serverUrl}`)
		})

    // require and use express http endPoints
    // app.use('/example', require('./endPoints/example.js'))
	})

  // declare event on mongodb connection open
  mongoose.connection.emit('open')
}

init(settings)
