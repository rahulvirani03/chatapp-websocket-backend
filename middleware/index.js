require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.getTokenAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token === null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.json(
        {
          staus:false,
          message:"Something went wrong.Invalid token"
        })
    } else {
      
      req.user = user;
      next();
    }
  });
};
