const mongoose = require('mongoose')
const {Schema} = mongoose;

const chatRoomSchema = new Schema({
    id:String,
    user1:Object,
    user2:Object,
    lastMessage:Object
});

const chatRoom= mongoose.model("ChatRoom",chatRoomSchema);

module.exports= chatRoom;