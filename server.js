require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const posts = [
  {
    username: "Rahul",
    title: "Post 1",
  },
  {
    username: "Virat",
    title: "Post 2",
  },
];
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Listening to port 3000");
});

app.get("/posts", authenticateAccessToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
