const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    GuildID: String,
    StfuList: Array
});

module.exports = mongoose.model('stfulist', Schema);