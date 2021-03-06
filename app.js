require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
var PORT = process.env.PORT

//DB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => console.log("DB Connection Establised"))
  .catch((err) => console.log(err));
//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/", require("./routers"));

//Socket Connection for Realtime Messages
const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000",'https://websocket-chatapp.netlify.app'],
    methods: ["GET", "POST"]
  },
});



//socket functions 
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;

  //Connecting to the chat server
  socket.on("add-user", (userId) => {
     //setUserOnline(userId)
    onlineUsers.set(userId, socket.id);
  });

  //Sending receving messages
  socket.on("send-msg", (data) => {
    
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        data,
      });
    }
  });

  //Refreshing chat UI
  socket.on("chat-list-refresh", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("chat-refresh-receive", {
        data,
      });
    }
  });

  //Typing...
  socket.on("typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("typing-receive", {
        data,
      });
    }
  });
 
  
});
