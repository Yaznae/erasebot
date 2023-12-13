const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    GuildID: String,
    Prefix: String,
    BlackList: Array
});

module.exports = mongoose.model('eraseinfo', Schema);