const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    MemberID: String,
    AvatarHistory: Array,
});

module.exports = mongoose.model('avhistory', Schema);