import express from 'express';
import cors from "cors";
import { NextFunction, Request, Response } from "express";

export const accessControlMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
}

export const corsMiddleware = cors({
  origin: ["http://localhost:8080", "172.17.144.1"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
})

export const JSONPostSizeLimiter = express.json({ limit: "10MB" });