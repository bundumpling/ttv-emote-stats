// @ts-nocheck
import moment from "moment";
import  { hashPassword, comparePassword, generateJWT } from "./auth";
import { db } from "./db";
import { DateHelpers } from '@ttv-emote-stats/common';


export const getEmoteUsageDetails = async (req, res) => {
  const emoteID = req.params.emoteID;
  const channelID = emoteID.split("-")[0];
  const channelOwner = await db
    .collection("TwitchLogin")
    .findOne({ twitchID: channelID });
  const channelName = channelOwner._id;
  db.collection("Emote").findOne({ _id: emoteID }, async (err, emote) => {
    if (err || !emote) {
      console.log("Emote not found with ID: " + emoteID);
      res.json({ error: "Emote not found" });
    } else {
      const twitchIDLogins = new Map();
      Object.keys(emote.usedBy).forEach((user) => {
        const [login, twitchID] = user.split("-");
        if (twitchID) {
          if (!twitchIDLogins.has(twitchID)) {
            twitchIDLogins.set(twitchID, [login]);
          } else {
            twitchIDLogins.set(twitchID, [
              login,
              ...twitchIDLogins.get(twitchID),
            ]);
          }
        } else {
          twitchIDLogins.set(login, []); // default to login when no twitchID known
        }
      });

      const usedBy = {};
      let twitchIDLoginsIterator = twitchIDLogins.entries();
      for (let [key, loginArray] of twitchIDLoginsIterator) {
        if (!loginArray.length) {
          // no known twitchID, so key is just login
          usedBy[key] = emote.usedBy[key];
        } else if (loginArray.length === 1) {
          // only one login with this twitchID recorded in the counts
          const userID = `${loginArray[0]}-${key}`;
          usedBy[userID] = emote.usedBy[userID];
        } else {
          // multiple known logins with this the twitchID
          const combinedCount = {
            count: 0,
            login: null,
            lastSeen: null,
          };
          const userdata = await db
            .collection("TwitchLogin")
            .find({ twitchID: key })
            .toArray();
          userdata.forEach(({ _id, twitchID, lastSeen }) => {
            const userID = `${_id}-${twitchID}`;
            combinedCount.count = combinedCount.count
              ? combinedCount.count + emote.usedBy[userID]
              : emote.usedBy[userID];
            if (!combinedCount.lastSeen || lastSeen > combinedCount.lastSeen) {
              combinedCount._id = _id;
              combinedCount.lastSeen = lastSeen;
            }
          });
          const userID = `${combinedCount._id}-${key}`;
          usedBy[userID] = combinedCount.count;
        }
      }
      res.json({ ...emote, usedBy, channelName });
    }
  });
};

export const getEmoteCount = async (req, res) => {
  const emoteID = req.params.emoteID;
  const { count } = await db.collection("Emote").findOne({ _id: emoteID });
  return res.status(200).send({ count });
};

export const getEmoteUsedBy = async (req, res) => {
  const emoteID = req.params.emoteID;
  const { usedBy } = await db.collection("Emote").findOne({ _id: emoteID });
  return res.status(200).send({ usedBy });
};

export const getEmoteUsedOn = async (req, res) => {
  const emoteID = req.params.emoteID;
  const { usedOn } = await db.collection("Emote").findOne({ _id: emoteID });
  return res.status(200).send({ usedOn });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "Username or password missing" });
  }

  try {
    const user = await db.collection("User").findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    if (!comparePassword(user.hashedPassword, password)) {
      return res.status(400).send({ message: "Incorrect password" });
    }

    const token = generateJWT(user);
    const refreshExpiry = moment()
      .utc()
      .add(3, "days")
      .endOf("day")
      .format("X");
    const refreshToken = generateJWT({
      exp: parseInt(refreshExpiry),
      data: user._id,
    });
    delete user.password;

    return res.status(200).send({
      status: true,
      message: "Logged in successfully",
      data: {
        user,
        token,
        refresh: refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export const updateCountsFromBot = async (req, res) => {
  const start = Date.now();
  const { channelName, username, userID, timestamp, counts } = req.body;

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateKey = `${year}${month}${day}`;

  const channelOwner = await db
    .collection("TwitchLogin")
    .findOne({ _id: channelName });
  const channelID = channelOwner.twitchID;

  Object.keys(counts).forEach(async (emoteCode) => {
    const emoteID = `${channelID}-${emoteCode}`;
    const count = counts[emoteCode];

    const usedByKey = `usedBy.${username}-${userID}`;
    const usedOnKey = `usedOn.${dateKey}`;
    const incrementObj = {
      count,
      [usedByKey]: count,
      [usedOnKey]: count,
    };

    await db.collection("Emote").updateOne(
      { _id: emoteID },
      {
        $inc: incrementObj,
      }
    );
  });

  await db
    .collection("TwitchLogin")
    .updateOne(
      { _id: username },
      { $set: { twitchID: userID, lastSeen: timestamp } },
      { upsert: true }
    );

  const now = Date.now();
  const duration = now - start;
  const loggerTimestamp = DateHelpers.formatTimestampForLogging(now);
  const loggerSummary = Object.keys(counts).map(emoteCode => `${emoteCode}: ${counts[emoteCode]}`).join(', ');
  console.log(`${loggerTimestamp} #${channelName} ${duration}ms [${loggerSummary}]`);
  res.status(200).send({ duration });
};
/** Disabled */
/*
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const createdOn = moment(new Date());

  const hashedPassword = hashPassword(password);

  db.collection("User").insertOne(
    {
      username,
      hashedPassword,
      createdOn,
    },
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ error });
      } else {
        delete result.password;
        return res.status(201).send({
          body: { user: result },
          message: "User created successfully",
        });
      }
    }
  );
};
*/
