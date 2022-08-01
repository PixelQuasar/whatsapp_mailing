
const mongoose = require("mongoose")

const number = new mongoose.Schema({
    number: {type: String, unique : true, dropDups: true},
    status: Number,
})

const numberSchema = mongoose.model('numbers', number)

module.exports = numberSchema