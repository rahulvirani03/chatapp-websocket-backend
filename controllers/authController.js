require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
let refreshTokens = [];
const secret = "IAMAWESOME";
const signupController = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  if (!username || !email || !password)
    return res.status(201).json("All fields are requireq");
  const emailExists = await User.findOne({ email: email });
  console.log(emailExists);
  if (emailExists) return res.status(201).json("Email already exists");
  const newUser = new User({
    username: username,
    email: email,
    password: password,
  });
  const result = await newUser.save();
  console.log(result);
  res.status(200).json(result);
};

const logoutController = (req, res) => {
  refreshTokens = refreshTokens.filter(
    (refreshToken) => refreshToken !== req.body.token
  );
  res.sendStatus(204);
};

const getTokenAuth = (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      res.json({
        isLoggedIn: true,
        user: user.email,
      });
    }
  });
};

const loginController = async (req, res) => {
  //Authenticate User
  const { email, password } = req.body;
  console.log({ email, password });
  const user = await User.findOne({ email: email });

  if (user === null) return res.status(201).json("User not Found!");
  if (user.password !== password)
    return res.status(201).json("Incorrect password");
  const payload = {
    email: email,
    password: password,
  };
  jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 86400 },
    (err, token) => {
      if (err) return res.status(201).json(err);
      return res.json({
        message: "Success",
        token: token,
      });
    }
  );
  //res.status(200).json(user);
  //   const user = { name: username };
  //   const accessToken = generateAccessToken(user);
  //   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  //   refreshTokens.push(refreshToken);
  //   res.json({ accessToken, refreshToken });
};

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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

module.exports = {
  loginController,
  getTokenAuth,
  signupController,
  logoutController,
};
