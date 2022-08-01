const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bot = require('./scripts/whatsappBot/bot')
const numberSchema = require('./models/number')

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

    const router = require('express').Router()

    router.post("/postMailingByMongo", async (req, res) => {
      try{
        const message = req.body.message
        console.log(message)
        const numbers = await numberSchema.find()
        console.log(numbers)
        for (number of numbers){
          console.log(number.number)
          bot.sendMessage(`${number.number}@c.us`, message)
        }
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })

    router.post("/postNumbers", async (req, res) => {
      try{
        const numbers = req.body
        console.log(numbers)
        for (number of numbers){
          number = number.replaceAll(" ", "").replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "")
          const savedNumber = new numberSchema({number: number, status: 1})
          await savedNumber.save()
        }
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })

    router.post("/deleteNumbers", async (req, res) => {
      try{
        const numbers = req.body
        if (numbers.length == 0){
          await numberSchema.deleteMany({})
        }
        else{
          for (number of numbers){
            number = number.replaceAll(" ", "").replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "")
            await numberSchema.findOneAndDalete({number: number})
          }
        }
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })

    router.post("/postMailing", (req, res) => {
        try{
            const numbers = req.body.numbers
            const message = req.body.message
            for (number of numbers){
              number = number.replaceAll(" ", "").replaceAll("+", "").replaceAll("(", "").replaceAll(")", "").replaceAll("-", "")
                try{
                  bot.sendMessage(`${number}@c.us`, message)
                }catch{
                  console.log("number error")
                }
            }
            res.sendStatus(200)
        }
        catch (err) {
            console.log("mailing error:", err)
            res.sendStatus(503)
        }
    })
    
    // whatsapp mailing http requests
    app.use('/mailing', router)
	})

  // declare event on mongodb connection open
  mongoose.connection.emit('open')
}

init(settings)
