const User = require("../models/user");
const chats = require("../models/chats");
const chatRoom = require("../models/chatRoom");

exports.getUsers = async (req, res) => {
  const result = await User.find();
  res.status(200).json(result);
};

exports.getChats = async (req, res) => {

  const { id } = req.body;
  console.log(id);
  let userResult = await User.find({
    _id:{$ne : id}
  });
  let newUserList =[];
  const chatResult = await chatRoom.find({
    $or: [{ "user1.id": id }, { "user2.id": id }],
  });
      chatResult.forEach(chats=>{
        if(id===chats.user1.id || id=== chats.user2.id)
        {
          userResult.map(user=>{
            if(user._id.toString()=== chats.user1.id || user._id.toString() === chats.user2.id)
              {
                newUserList.push(user);
              }
          })
         
        }
      })

  console.log(newUserList);
   userResult = userResult.filter(ar => !newUserList.find(rm => (rm._id.toString() === ar._id.toString()))) 
   console.log(userResult);
   const result = {
     chats: chatResult,
     users: userResult
   }
  res.status(200).json(result);
};

exports.createChatRoom = async (req, res) => {
  const { id, user1, user2 } = req.body;
  const newChatRomm = new chatRoom({
    id: id,
    user1: user1,
    user2: user2,
    lastMessage: "",
  });
  const result = await newChatRomm.save();
  res.json(result);
};

exports.getMessages = async (req, res) => {
  const { room } = req.body;
  const chatExists = await chats.findOne({ id: room });
  if (chatExists === null) {
    res.json("No chats found");
  } else {
    res.json(chatExists.messages);
    return;
  }
};

exports.getMessage = async (req, res) => {
  const { messageData } = req.body;
  const chatExists = await chats.findOne({ id: messageData.room });
  if (chatExists === null) {
    const newChat = new chats({
      id: messageData.room,
      messages: [
        {
          sender: messageData.sender,
          message: messageData.message,
          time: messageData.time,
        },
      ],
    });
    const result = await newChat.save();
    res.json(result);
    //console.log(result);
  } else {
    const prevChats = chatExists.messages;
    prevChats.push({
      sender: messageData.sender,
      message: messageData.message,
      time: messageData.time,
    });
    const result = await chats.updateOne(
      { id: messageData.room },
      { $set: { messages: prevChats },}
    );
    res.json(result);
  }
};

exports.setLastMessage = async (req, res) => {
  const { lastMessageData } = req.body;
  const result = await chatRoom.updateOne(
    { id: lastMessageData.room },
    { $set: { lastMessage: lastMessageData },}
  );
  res.json(result);
};

exports.setUserOnline = async (id) =>{
  const res = await chatRoom.updateMany(
   {'user1.id':id},
    {$set:{'user1.isOnline':true}}
  )
  const new_res = await chatRoom.updateMany(
   {'user2.id':id},
    {$set:{'user2.isOnline':true}}
  )
// console.log(res);
// console.log(new_res);
}

exports.markAsRead = async (req,res)=>{
  const {id} = req.body;
  const updateRes =await chatRoom.updateOne({'id':id},{$set:{'lastMessage.isRead':true}}) 
  console.log(updateRes);
  res.json(updateRes)
}
