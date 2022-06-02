const express =  require('express');
const { getChats,getMessages,getUsers, getMessage,setLastMessage, createChatRoom, markAsRead } = require('../controllers/chatController');
const router= express.Router();

router.get('/user-list',getUsers)
router.post('/chat-list',getChats);
router.post('/create-chat-room',createChatRoom)
router.post('/messages',getMessages)
router.post('/message',getMessage)
router.post('/set-last-message',setLastMessage)
router.post('/marks-as-read',markAsRead)

module.exports= router;
