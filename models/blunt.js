const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    GuildID: String,
    BluntHolder: String,
    BluntHits: Number
});

module.exports = mongoose.model('bluntinfo', Schema);