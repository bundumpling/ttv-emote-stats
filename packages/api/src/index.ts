import express from "express";
import * as Auth from "./auth";
import Routes from "./routes";
import * as Controller from "./controller";
import { corsMiddleware, accessControlMiddleware } from "./middleware";
import { config } from 'dotenv';
config({ path: '../.env' });
// import morgan from "morgan";
// app.use(morgan("combined"));

const port = Number(process.env.SERVER_PORT);
const app = express();

app.use(corsMiddleware);
app.use(accessControlMiddleware);

app.get("/", (_req, res) => res.send("Hello from the API Relay Server!"));

app.use('/twitch', Routes.Twitch);
app.use('/ffz', Routes.FFZ); 
app.use('/bttv', Routes.BTTV);
app.use('/7tv', Routes.SevenTV);

app.use('/channelList', Routes.ChannelList);
app.use('/channel', Routes.Channel);


app.get("/emote/:emoteID/usageDetails", Controller.getEmoteUsageDetails);
app.get("/emote/:emoteID/count", Controller.getEmoteCount);
app.get("/emote/:emoteID/usedBy", Controller.getEmoteUsedBy);
app.get("/emote/:emoteID/usedOn", Controller.getEmoteUsedOn);

// Protected Endpoints

app.post(
  "/admin/updateCountsFromBot",
  express.json({ limit: "10MB" }),
  Auth.decodeJWT,
  Controller.updateCountsFromBot
);

/* Disabled */
/* app.post("/auth/register", express.json(), validateCreatedUser, Controller.registerUser);
  */

app.post("/auth/login", express.json(), Controller.loginUser);

app.listen(port, "0.0.0.0", () => { console.log(`API Relay Server listening on port ${port}`) });