const mongoose = require('mongoose')

const Refresh = new mongoose.Schema({
  token: String,
})

module.exports = mongoose.model('Refresh', Refresh)
