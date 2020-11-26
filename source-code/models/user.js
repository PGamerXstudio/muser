const mongoose = require('mongoose');

const userinfo = new mongoose.Schema({
    voter:{
        type: String
    },
    UserID: String
});

const MessageModel = module.exports = mongoose.model('users', userinfo);