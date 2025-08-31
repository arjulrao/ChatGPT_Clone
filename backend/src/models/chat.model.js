const { Schema } = require('mongoose');
const mongoose = require('mongoose');

/*
    We create chat base on 3 things
    - Which user want to create chat
    - What is the title of chat
    - What is it's last Activity
 */


const chatSchema = new mongoose.Schema({
   user: {
    type : mongoose.Schema.Types.ObjectId,   // Id of user
    ref : 'user',  // Which collection from 
    required: true
   },
   title: {
    type: String,
    require: true
   },
   lastActivity: {
    type: Date,
    default: Date.now
   }
}, {
    timestamps: true
})


const chatModel = mongoose.model('chat', chatSchema);

module.exports = chatModel;