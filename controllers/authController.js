require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(201).json("All fields are requireq");
  const usernmeExists = await User.findOne({ username: username });
  if (usernmeExists) return res.status(201).json("Username already exists");
  const newUser = new User({
    username: username,
    email: email,
    password: password,
  });
  const result = await newUser.save();
  const payload = {
    username: username,
    id: result._id,
  };
  jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 86400 },
    (err, token) => {
      if (err) return res.status(201).json(err);
      return res.status(200).json({
        message: "Success",
        user: payload,
        token: token,
      });
    }
  );
};

const logoutController = (req, res) => {
  refreshTokens = refreshTokens.filter(
    (refreshToken) => refreshToken !== req.body.token
  );
  res.sendStatus(204);
};

const getTokenAuth = (req, res) => {
  const token = req.headers.authorization;
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.json({
        isLoggedIn: false,
      });
    } else {
      res.json({
        isLoggedIn: true,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    }
  });
};
const loginController = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (user === null) return res.status(201).json("User not Found!");
  if (user.password !== password)
    return res.status(201).json("Incorrect password");
  const payload = {
    username: username,
    id: user._id,
  };
  jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 86400 },
    (err, token) => {
      if (err) return res.status(201).json(err);
      return res.json({
        message: "Success",
        user: payload,
        token: token,
      });
    }
  );
};

module.exports = {
  loginController,
  getTokenAuth,
  signupController,
  logoutController,
};
