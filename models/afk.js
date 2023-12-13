const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    MemberID: String,
    Guilds: Array,
    Reason: String,
});

module.exports = mongoose.model('afklist', Schema);