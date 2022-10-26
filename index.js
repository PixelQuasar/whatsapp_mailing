const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const qrcode = require('qrcode');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { PassThrough } = require('stream');
const bot = require('./scripts/whatsappBot/bot')
const numberSchema = require('./models/number')
const fs = require('fs');
global.qrcode = undefined

function getNumbers(){
  let rawdata = fs.readFileSync('./staticdata/numbers.json')
  let numbers = JSON.parse(rawdata)
  return numbers
}

// require settings data
const settings = require('./staticdata/settings.js')

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

  // connect to mongod

  // function of event on mongodb connection open
    app.listen(settings.PORT, '0.0.0.0', (err) => {
			if (err) return new Error(`error in starting server, error: ${err}`)
			else console.log(`server started on \nPORT: ${settings.PORT}\nURL: ${settings.serverUrl}`)
		})

    const router = require('express').Router()

    router.get("/init", async (req, res) => {
      if (global.qrcode){
        const qrStream = new PassThrough()
        const result = await qrcode.toFileStream(qrStream, global.qrcode,
          {
            type: 'png',
            width: 200,
            errorCorrectionLevel: 'H'
          }
        )
        qrStream.pipe(res)
      }
      else{
        res.send(503)
      }
    })

    router.post("/postMailingByMongo", async (req, res) => {
      try{
        const message = req.body.message
        console.log(message)
        const numbers = getNumbers()
        console.log(numbers)
        for (number in numbers){
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
          number = number.replace(/ /g, "").replace(/+/g, "")
          const numbers = getNumbers()
          numbers[number] = {number: number, status: 1}
          fs.writeFileSync('./staticdata/numbers.json', JSON.stringify(numbers))
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
          fs.writeFileSync('./staticdata/numbers.json', "{}")
        }
        else{
          for (number of numbers){
            number = number.replace(/ /g, "").replace(/+/g, "")
            const numbers = getNumbers()
            delete numbers[number]
            fs.writeFileSync('./staticdata/numbers.json', JSON.stringify(numbers))
          }
        }
        res.sendStatus(200)
      }
      catch (err) {
        console.log("mailing error:", err)
        res.sendStatus(503)
      }
    })

    router.post("/postMailing", async (req, res) => {
        try{
            const numbers = req.body.numbers
            const message = req.body.message
            let image = MessageMedia.fromFilePath("assets/testImage.jpg")
            for (number of numbers){
                try{
                  await bot.sendMessage(`${number}@c.us`, message)
                  await bot.sendMessage(`${number}@c.us`, image, {caption: "test gif"})
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

}

init(settings)
