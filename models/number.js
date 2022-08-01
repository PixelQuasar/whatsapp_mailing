
const mongoose = require("mongoose")

const number = new mongoose.Schema({
    number: String,
    status: Number,
})

const numberSchema = mongoose.model('numbers', number)

module.exports = numberSchema