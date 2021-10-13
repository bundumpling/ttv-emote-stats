import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import process from "process";
import { NextFunction, Request, Response } from "express";


declare namespace Express {
  interface CustomResponse extends Response {
    token?: string,
    user?: any
  }
}


const privateKEY = fs.readFileSync(path.join(process.cwd(), "./private.pem"), "utf8");
const publicKEY = fs.readFileSync(path.join(process.cwd(), "./public.pem"), "utf8");

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

export const generateJWT = (payload: any) => {
  const signOptions: SignOptions = {
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

const verifyJWT = (payload: string) => {
  return jwt.verify(payload, publicKEY, verifyOptions);
};

export const hashPassword = (password: string) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const comparePassword = (hashedPassword: string, password: string) =>
  bcrypt.compareSync(password, hashedPassword);

export const decodeJWT = (req: Request, res: Express.CustomResponse, next: NextFunction) => {
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
