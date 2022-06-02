const mongoose = require('mongoose')
const {Schema} =mongoose

const ChatSchema = new Schema({
    
    id:String,
    messages: Array,
    
})

const chats = mongoose.model("chats",ChatSchema)

module.exports = chats
