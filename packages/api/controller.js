require("dotenv").config();
const fetch = require("node-fetch");
const moment = require("moment");

const { getDb } = require("./db");
const db = getDb();

const { hashPassword, comparePassword, generateJWT } = require("./auth");

const TWITCH_OPTIONS = {
  method: "GET",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    Authorization: process.env.TWITCH_AUTH_TOKEN,
  },
};

const saveUpdatedEmotes = async (req, res) => {
  const channelName = req.params.channelName;
  const channelID = req.body.channelID;
  const emotes = req.body.emotes;

  return Promise.all(
    emotes.map(({ code, provider, providerID, image, obsolete }) => {
      const _id = `${channelID}-${code}`;

      return db.collection("Emote").findOneAndUpdate(
        { _id },
        {
          $set: {
            channelID,
            code,
            provider,
            providerID,
            image,
            obsolete,
          },
          $inc: {
            count: 0,
          },
          $setOnInsert: {
            usedBy: {},
            usedOn: {},
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        },
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            // console.log(result)
          }
        }
      );
    })
  )
    .then(() =>
      db.collection("Channel").findOneAndUpdate(
        { _id: channelID },
        {
          $addToSet: {
            emotes: { $each: emotes.map(({ code }) => `${channelID}-${code}`) },
          },
          $setOnInsert: {
            parsedLogfiles: [],
          },
        },
        { upsert: true }
      )
    )
    .then(() =>
      db.collection("TwitchLogin").findOneAndUpdate(
        { _id: channelName },
        {
          $set: {
            twitchID: channelID,
          },
        },
        { upsert: true }
      )
    )
    .then((err, result) => {
      if (err) {
        console.error(err);
        res.send({ ok: false, error: err });
      } else {
        res.send({ ok: true, result });
      }
    });
};

const getChannelEmoteCounts = (req, res) => {
  db.collection("TwitchLogin").findOne(
    { _id: req.params.channelName },
    (err, { _id, twitchID }) => {
      db.collection("Channel")
        .aggregate([
          { $match: { _id: twitchID } },
          {
            $lookup: {
              from: "Emote",
              localField: "emotes",
              foreignField: "_id",
              as: "emotes",
            },
          },
          {
            $addFields: {
              emotes: {
                $map: {
                  input: "$emotes",
                  as: "emote",
                  in: {
                    _id: "$$emote._id",
                    code: "$$emote.code",
                    count: "$$emote.count",
                    image: "$$emote.image",
                    provider: "$$emote.provider",
                  },
                },
              },
            },
          },
        ])
        .toArray()
        .then((result) => {
          res.json(result[0]);
        });
    }
  );
};

const getEmoteUsageDetails = async (req, res) => {
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

const getChannelEmoteCodes = async (req, res) => {
  const ignoreObsolete = Boolean(req.query.ignoreObsolete);
  db.collection("TwitchLogin")
    .findOne({ _id: req.params.channelName })
    .then(({ _id, twitchID }) =>
      db
        .collection("Channel")
        .aggregate([
          {
            $match: { _id: twitchID },
          },
          {
            $lookup: {
              from: "Emote",
              localField: "emotes",
              foreignField: "_id",
              as: "emotes",
            },
          },
          {
            $addFields: {
              emotes: {
                $map: {
                  input: "$emotes",
                  as: "emote",
                  in: {
                    code: "$$emote.code",
                    obsolete: "$$emote.obsolete",
                  },
                },
              },
            },
          },
          {
            $project: {
              emotes: "$emotes",
            },
          },
        ])
        .toArray()
        .then((result) => {
          const emotes = result[0].emotes;
          const emoteCodes = ignoreObsolete
            ? emotes
                .filter((emote) => !emote.obsolete)
                .map((emote) => emote.code)
            : emotes.map((emote) => emote.code);

          res.json({
            channelID: twitchID,
            emoteCodes,
          });
        })
    )
    .catch((err) =>
      res.send({
        ok: false,
        error: "Failed to fetch Emote Codes for " + req.params.channelName,
      })
    );
};

const getListOfParsedLogs = async (req, res) => {
  const channelName = req.params.channelName;
  db.collection("TwitchLogin").findOne(
    { _id: channelName },
    (err, { twitchID }) => {
      db.collection("Channel").findOne(
        { _id: twitchID },
        (err, channelData) => {
          res.send(JSON.stringify(channelData.parsedLogfiles));
        }
      );
    }
  );
};

const updateCountsFromLog = async (req, res) => {
  const channelName = req.params.channelName;
  const { usernameLastSeen, emoteCounts } = req.body.logParserResults;
  const logFilenames = req.body.logFilenames;

  console.log("Handling POST to channel/updateCountsFromLog");

  async function buildUsernamesSet() {
    const usernames = new Set();
    Object.keys(emoteCounts).forEach((code) => {
      Object.keys(emoteCounts[code].usedBy).forEach((username) => {
        usernames.add(username);
      });
    });
    return usernames;
  }

  async function getTwitchLoginsFromDB(usernames) {
    const dict = new Map();
    const results = await db
      .collection("TwitchLogin")
      .find({ _id: { $in: [...usernames] } })
      .toArray();
    results.forEach(({ _id, twitchID }) => {
      if (twitchID) {
        dict.set(_id, twitchID);
      }
    });
    return dict;
  }

  async function buildUsernamesWithoutTwitchID(
    usernames,
    usernameTwitchIDDictionary
  ) {
    const usernamesWithoutTwitchID = new Set();
    usernames.forEach((username) => {
      if (!usernameTwitchIDDictionary.has(username)) {
        usernamesWithoutTwitchID.add(username);
      }
    });
    return usernamesWithoutTwitchID;
  }

  async function chunkUsernamesSetToArray(usernamesWithoutTwitchID) {
    let usernamesArray = [...usernamesWithoutTwitchID.values()];
    let usernameBatches = [];
    for (let i = 0, size = usernamesWithoutTwitchID.size; i < size; i += 100) {
      usernameBatches.push(usernamesArray.slice(i, i + 100));
    }
    return usernameBatches;
  }

  async function requestTwitchIDsFromUsernameArray(usernames) {
    return new Promise(async (res) =>
      setTimeout(() => {
        const paramsString = usernames
          .map((username) => `login=${username}`)
          .join("&");
        const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
        fetch(URL, TWITCH_OPTIONS)
          .then((response) => response.json())
          .then((json) => {
            const userdata = json.data.map((user) => {
              const { login } = user;
              const twitchID = user.id;
              return {
                _id: login,
                twitchID,
              };
            });
            res(userdata);
          });
      }, 1000)
    );
  }

  async function processBatchRequestForTwitchIDs(usernameBatches) {
    return new Promise(async (res) => {
      let result = [];
      let timestamp = Date.now();
      console.log(`${timestamp} - Start processBatchRequestForTwitchIDs`);
      for (let i = 0; i < usernameBatches.length; i++) {
        const usernameBatch = usernameBatches[i];
        const userdata = await requestTwitchIDsFromUsernameArray(usernameBatch);
        console.log(
          `${Date.now()} - [${i + 1}] -  Got results for ${userdata.length}/${
            usernameBatch.length
          } user requests from Twitch API.`
        );
        for (let i = 0; i < userdata.length; i++) {
          result.push(userdata[i]);
        }
      }
      res(result);
    });
  }

  async function addNewTwitchLoginDocuments(userdata) {
    return new Promise(async (resolve) => {
      userdata.forEach(({ _id, twitchID }) =>
        db
          .collection("TwitchLogin")
          .updateOne(
            { _id },
            { $set: { twitchID } },
            { upsert: true },
            (err) => {
              if (err) {
                console.log(
                  `Error adding new documents to TwitchLogin collection: ${err}`
                );
              } else {
                console.log(
                  `Successfully added ${_id} (${twitchID}) to the TwitchLogin collection.`
                );
              }
            }
          )
      );
      resolve();
    });
  }

  async function buildUsernameTwitchIDDictionary() {
    return new Promise(async (resolve) => {
      const usernames = await buildUsernamesSet();
      const usernameTwitchIDDictionary = await getTwitchLoginsFromDB(
        usernames.values()
      );
      console.log(
        `Known users (have TwitchID in DB): ${usernameTwitchIDDictionary.size}`
      );
      const usernamesWithoutTwitchID = await buildUsernamesWithoutTwitchID(
        usernames,
        usernameTwitchIDDictionary
      );
      if (usernamesWithoutTwitchID.size) {
        console.log(
          `Unknown users (no TwitchID in DB): ${usernamesWithoutTwitchID.size}`
        );
        const usernameBatches = await chunkUsernamesSetToArray(
          usernamesWithoutTwitchID
        );
        const userdata = await processBatchRequestForTwitchIDs(usernameBatches);
        console.log(
          `${Date.now()} - Twitch API returned ${
            userdata.length
          } TwitchIDs for unknown users.`
        );
        if (userdata.length) {
          addNewTwitchLoginDocuments(userdata).then(() => {
            userdata.forEach(({ _id, twitchID }) => {
              usernameTwitchIDDictionary.set(_id, twitchID);
            });
            resolve(usernameTwitchIDDictionary);
          });
        } else {
          resolve(usernameTwitchIDDictionary);
        }
      } else {
        resolve(usernameTwitchIDDictionary);
      }
    });
  }

  const usernameTwitchIDDictionary = await buildUsernameTwitchIDDictionary();
  console.log(
    `${Date.now()} - Final Username/TwitchID dictionary size: ${
      usernameTwitchIDDictionary.size
    }`
  );

  db.collection("TwitchLogin").findOne(
    { _id: channelName },
    (err, { twitchID }) => {
      if (err) res.send(err);

      Promise.all(
        Object.keys(emoteCounts).map((code) => {
          const _id = `${twitchID}-${code}`;
          db.collection("Emote").findOne({ _id }, (err, emote) => {
            if (err) {
              res.send(err);
            }

            if (!emote || !emote.usedBy || !emote.usedOn) {
              console.log(_id + "not found");
            }

            const usedBy = emote.usedBy || {};
            Object.keys(emoteCounts[code].usedBy).map((username) => {
              const userID = usernameTwitchIDDictionary.has(username)
                ? `${username}-${usernameTwitchIDDictionary.get(username)}`
                : username;

              if (usedBy[userID]) {
                usedBy[userID] += emoteCounts[code].usedBy[username];
              } else {
                usedBy[userID] = emoteCounts[code].usedBy[username];
              }
            });

            const usedOn = emote.usedOn || {};
            Object.keys(emoteCounts[code].usedOn).map((date) => {
              if (usedOn[date]) {
                usedOn[date] += emoteCounts[code].usedOn[date];
              } else {
                usedOn[date] = emoteCounts[code].usedOn[date];
              }
            });

            db.collection("Emote").updateOne(
              { _id },
              {
                $set: {
                  usedBy: { ...usedBy },
                  usedOn: { ...usedOn },
                },
                $inc: {
                  count: emoteCounts[code].count,
                },
              }
            );
          });
        })
      )
        .then(() => {
          db.collection("Channel").updateOne(
            { _id: twitchID },
            {
              $push: { parsedLogfiles: { $each: logFilenames } },
            }
          );
        })
        .then(() => {
          Object.keys(usernameLastSeen).map((username) => {
            db.collection("TwitchLogin").findOneAndUpdate(
              { _id: username },
              {
                $max: {
                  lastSeen: usernameLastSeen[username],
                },
              },
              { upsert: true }
            );
          });
        })
        .then(() => {
          res.send({ ok: true });
        });
    }
  );
};

const getEmotesFromDbAndProviders = async (req, res) => {
  const channelName = req.params.channelName;
  let results = {
    emotesFromDatabase: [],
    emotesFromProviders: {
      Twitch: [],
      FFZ: [],
      BTTV: [],
      "7TV": [],
    },
  };
  db.collection("TwitchLogin").findOne(
    { _id: channelName },
    (err, { _id, twitchID }) => {
      if (err) return res.send({ ok: false });
      db.collection("Channel")
        .aggregate([
          { $match: { _id: twitchID } },
          {
            $lookup: {
              from: "Emote",
              localField: "emotes",
              foreignField: "_id",
              as: "emotes",
            },
          },
          {
            $addFields: {
              emotes: {
                $map: {
                  input: "$emotes",
                  as: "emote",
                  in: {
                    code: "$$emote.code",
                    image: "$$emote.image",
                    provider: "$$emote.provider",
                    providerID: "$$emote.providerID",
                    obsolete: "$$emote.obsolete",
                  },
                },
              },
            },
          },
        ])
        .toArray()
        .then(async (result) => {
          if (result && result[0] && result[0].emotes)
            results.emotesFromDatabase = result[0].emotes;

          results.emotesFromProviders["Twitch"] = await fetch(
            `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${twitchID}`,
            TWITCH_OPTIONS
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Got status code ${response.status} from provider Twitch`
                );
              }
              return response.json();
            })
            .then((json) => {
              if (!json.data.length) {
                throw new Error(
                  `Twitch does not have any emotes for this channel`
                );
              }
              return json.data.map((emote) => {
                return {
                  code: emote.name,
                  image: emote.images.url_1x,
                  provider: "Twitch",
                  providerID: emote.id,
                };
              });
            })
            .catch((error) => {
              console.error(error);
              return [];
            });

          results.emotesFromProviders["FFZ"] = await fetch(
            `https://api.frankerfacez.com/v1/room/id/${twitchID}`,
            { method: "GET" }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Got status code ${response.status} from provider FFZ`
                );
              }
              return response.json();
            })
            .then((json) => {
              if (!json.sets[json.room.set].emoticons.length) {
                throw new Error(
                  "FFZ does not have any emotes for this channel"
                );
              }
              return json.sets[json.room.set].emoticons.map((emote) => {
                return {
                  code: emote.name,
                  image: emote.urls["1"],
                  provider: "FFZ",
                  providerID: `${emote.id}`,
                };
              });
            })
            .catch((error) => {
              console.error(error);
              return [];
            });

          results.emotesFromProviders["BTTV"] = await fetch(
            `https://api.betterttv.net/3/cached/users/twitch/${twitchID}`,
            { method: "GET" }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Got status code ${response.status} from provider BTTV`
                );
              }
              return response.json();
            })
            .then((json) => {
              let emotes = json.channelEmotes.concat(json.sharedEmotes);
              if (!emotes.length) {
                throw new Error(
                  "BTTV does not have any emotes for this channel"
                );
              }
              return emotes.map((emote) => {
                return {
                  code: emote.code,
                  image: `https://cdn.betterttv.net/emote/${emote.id}/1x`,
                  provider: "BTTV",
                  providerID: emote.id,
                };
              });
            })
            .catch((error) => {
              console.error(error);
              return [];
            });

          results.emotesFromProviders["7TV"] = await fetch(
            `https://api.7tv.app/v2/users/${channelName}/emotes`,
            { method: "GET" }
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Got status code ${response.status} from provider 7TV`
                );
              }
              return response.json();
            })
            .then((json) => {
              return json.map((emote) => {
                return {
                  code: emote.name,
                  image: `https://cdn.7tv.app/emote/${emote.id}/1x`,
                  provider: "7TV",
                  providerID: emote.id,
                };
              });
            })
            .catch((error) => {
              console.error(error);
              return [];
            });

          res.send({
            channelID: `${twitchID}`,
            channelName,
            emotesFromDatabase: results.emotesFromDatabase,
            emotesFromProviders: Object.keys(
              results.emotesFromProviders
            ).reduce((result, provider) => {
              return [...results.emotesFromProviders[provider], ...result];
            }, []),
          });
        });
    }
  );
};

const getChannelList = async (req, res) => {
  db.collection("Channel")
    .aggregate([
      {
        $lookup: {
          from: "TwitchLogin",
          localField: "_id",
          foreignField: "twitchID",
          as: "twitchLogin",
        },
      },
      {
        $unwind: {
          path: "$twitchLogin",
        },
      },
      {
        $project: {
          channelName: "$twitchLogin._id",
          emoteCount: {
            $size: "$emotes",
          },
          profileImageURL: "$profileImageURL",
        },
      },
    ])
    .toArray()
    .then((channelList) => res.json({ channelList }));
};

const getEmoteCount = async (req, res) => {
  const emoteID = req.params.emoteID;
  const { count } = await db.collection("Emote").findOne({ _id: emoteID });
  return res.status(200).send({ count });
};

const getEmoteUsedBy = async (req, res) => {
  const emoteID = req.params.emoteID;
  const { usedBy } = await db.collection("Emote").findOne({ _id: emoteID });
  return res.status(200).send({ usedBy });
};

const getEmoteUsedOn = async (req, res) => {
  const emoteID = req.params.emoteID;
  const { usedOn } = await db.collection("Emote").findOne({ _id: emoteID });
  return res.status(200).send({ usedOn });
};

const loginUser = async (req, res) => {
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

const updateCountsFromBot = async (req, res) => {
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

  const duration = Date.now() - start;
  console.log(`Updated ${Object.keys(counts).length} emotes in ${duration}ms`);

  res.status(200).send({ duration });
};

/** Disabled */
/*
const registerUser = async (req, res) => {
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

module.exports = {
  saveUpdatedEmotes,
  updateCountsFromLog,
  updateCountsFromBot,
  getListOfParsedLogs,
  getChannelEmoteCodes,
  getChannelEmoteCounts,
  getEmoteCount,
  getEmoteUsedBy,
  getEmoteUsedOn,
  getEmoteUsageDetails,
  getEmotesFromDbAndProviders,
  getChannelList,
  loginUser,
  /*  registerUser, */
};
