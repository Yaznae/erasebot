const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    ChannelID: String,
    Webhook: String,
    UwuList: Array
});

module.exports = mongoose.model('uwulists', Schema);