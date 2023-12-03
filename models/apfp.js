const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String,
    Interval: Number,
    Up: Boolean,
});

module.exports = mongoose.model('apfpinfo', Schema);