const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKEY = fs.readFileSync("./private.pem", "utf8");
const publicKEY = fs.readFileSync("./public.pem", "utf8");

const i = "jwt-node";
const s = "jwt-node";
const a = "jwt-node";

const verifyOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: "8784h",
  algorithm: ["RS256"],
};

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const generateJWT = (payload) => {
  const signOptions = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: "8784h",
    algorithm: "RS256",
  };

  const options = signOptions;
  if (payload && payload.exp) {
    delete options.expiresIn;
  }
  return jwt.sign(payload, privateKEY, options);
};

const verifyJWT = (payload) => {
  return jwt.verify(payload, publicKEY, verifyOptions);
};

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const comparePassword = (hashedPassword, password) =>
  bcrypt.compareSync(password, hashedPassword);

const decodeJWT = (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.body.token;
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7);
    if (!token || token === "")
      return res.status(401).send({ message: "No token provided" });
  }
  const decoded = verifyJWT(token);
  if (!decoded) return res.status(403).send({ message: "Invalid signature" });
  if (decoded) res.user = decoded;

  res.token = token;
  return next();
};

module.exports = {
  hashPassword,
  verifyJWT,
  generateJWT,
  decodeJWT,
  comparePassword,
};
