require('dotenv').config();

const fetch = require("node-fetch");

const TWITCH_OPTIONS = {
  method: "GET",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
    "Authorization": process.env.TWITCH_AUTH_TOKEN
  }
};

const updateChannelEmotes = (db, channelName, channelID, emotes) => {

  return Promise.all(emotes.map(
    ({ code, provider, providerID, image }) => {
      const _id = `${channelID}-${code}`;

      return db.collection('Emote').findOneAndUpdate({
        _id
      },
      {
        $set: {
          channelID,
          code,
          provider,
          providerID,
          image
        },
        $inc: {
          count: 0
        }
      },
      {
        upsert: true,
        returnDocument: 'after',
      }, (err, result) => {
        if (err) {
          console.error(err)
        }
        else {
          // console.log(result)
        }
      })
    })
  ).then(() => 
    db.collection('Channel').findOneAndUpdate(
      { _id: channelID },
      {
        $set: { 
          emotes: emotes.map(({ code }) => `${channelID}-${code}`),
        },
        $setOnInsert: { 
          parsedLogfiles: []
        }
      }, { upsert: true }
    )
  ).then(() => db.collection('TwitchLogin').findOneAndUpdate(
    { twitchID: channelID },
    {
      $set: {
        login: channelName
      }
    },
    { upsert: true }
  )
  ).then((err, result) => {
    if (err) {
      console.error(err);
    } else {
      return result;
    }
  })
}

const getChannelData = (req, res, db) => {
  db.collection('TwitchLogin').findOne(
    { login: req.params.channelName }, 
    (err, { login, twitchID }) => {
      db.collection('Channel').aggregate(
        [
          { $match: { _id: twitchID } },
          { $lookup: {
              from: 'Emote',
              localField: 'emotes',
              foreignField: '_id',
              as: 'emotes'
            }
          },
          {
            $addFields: {
              "emotes": {
                $map: {
                  "input": "$emotes",
                  "as": "emote",
                  "in": {
                    "_id": "$$emote._id",
                    "code": "$$emote.code",
                    "count": "$$emote.count",
                    "image": "$$emote.image",
                    "provider": "$$emote.provider" 
                  }
                }
              }
            }
          }
        ],
      ).toArray().then(result => {
        res.json(result[0])

      });
    }
  )
}

const getEmoteUsedByCounts = (req, res, db) => {
  const emoteID = req.params.emoteID;
  db.collection('Emote').findOne({ _id: emoteID }, (err, emote) => {
    if (err) res.send(err);
    else {
      res.json(emote.usedBy)
    }
  })
}

const updateCountsFromLog = async (req, res, db) => {
  const channelName = req.params.channelName;
  const { usernameLastSeen, emoteCounts } = req.body.logParserResults;
  const logFilenames = req.body.logFilenames;

  console.log("Handling POST to channel/updateCountsFromLog")

  async function buildUsernamesSet() {
    const usernames = new Set();
    Object.keys(emoteCounts).forEach(code => {
      Object.keys(emoteCounts[code].usedBy).forEach(username => {
        usernames.add(username);
      })
    })
    return usernames;
  }

  async function getTwitchLoginsFromDB(usernames) {
    const dict = new Map();
    const results = await db.collection('TwitchLogin').find({ login: { $in: [...usernames] } }).toArray();
    results.forEach(({login, twitchID}) => {
      if (twitchID) {
        dict.set(login, twitchID);
      }
    })
    return dict;
  }

  async function buildUsernamesWithoutTwitchID (usernames, usernameTwitchIDDictionary) {
    const usernamesWithoutTwitchID = new Set();
    usernames.forEach((username) => {
      if (!usernameTwitchIDDictionary.has(username)) {
        usernamesWithoutTwitchID.add(username);
      }
    })
    return usernamesWithoutTwitchID;
  }

  async function chunkUsernamesSetToArray(usernamesWithoutTwitchID) {
    let usernamesArray = [...usernamesWithoutTwitchID.values()];
    let usernameBatches = [];
    for (let i = 0, size = usernamesWithoutTwitchID.size; i < size; i += 100) {
      usernameBatches.push(usernamesArray.slice(i, i + 100))
    }
    return usernameBatches;
  }

  async function requestTwitchIDsFromUsernameArray(usernames) {
    return new Promise(async (res) => setTimeout(() => {
      const paramsString = usernames.map(username => `login=${username}`).join("&");
      const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
      fetch(URL, TWITCH_OPTIONS)
        .then(response => response.json())      
        .then(json => {
          const userdata = json.data.map(({login, id}) => {
            return {
              login,
              twitchID: id
            }
          })
          res(userdata)
        })
    }, 1000))
  }
  
  async function processBatchRequestForTwitchIDs(usernameBatches) {
    return new Promise(async (res) => {
      let result = [];
      let timestamp = Date.now();
      console.log(`${timestamp} - Start processBatchRequestForTwitchIDs`)
      for (let i = 0; i < usernameBatches.length; i++) {
          const usernameBatch = usernameBatches[i];
          const userdata = await requestTwitchIDsFromUsernameArray(usernameBatch);
          console.log(`${Date.now()} - [${i + 1} -  Got results for ${userdata.length}/${usernameBatch.length} user requests from Twitch API.`);
          for (let i = 0; i < userdata.length; i++) {
            result.push(userdata[i]);
          }
        
      }
      res(result);
    });
  }

  async function addNewTwitchLoginDocuments(userdata) {
    db.collection('TwitchLogin').insertMany(userdata, (err) => {
      if (err) {
        console.log(`Error adding new documents to TwitchLogin collection: ${err}`);
      } else {
        console.log(`Successfully added ${userdata.length} new documents to the TwitchLogin collection.`);
      }
    })
  }

  async function buildUsernameTwitchIDDictionary() {
    return new Promise(async (resolve) => {
      const usernames = await buildUsernamesSet();
      const usernameTwitchIDDictionary = await getTwitchLoginsFromDB(usernames.values());
      console.log(`Known users (have TwitchID in DB): ${usernameTwitchIDDictionary.size}`);
      const usernamesWithoutTwitchID = await buildUsernamesWithoutTwitchID(usernames, usernameTwitchIDDictionary);
      if (usernamesWithoutTwitchID.size) {
        console.log(`Unknown users (no TwitchID in DB): ${usernamesWithoutTwitchID.size}`);
        const usernameBatches = await chunkUsernamesSetToArray(usernamesWithoutTwitchID);
        const userdata = await processBatchRequestForTwitchIDs(usernameBatches);
        console.log(`${Date.now()} - Twitch API returned ${userdata.length} TwitchIDs for unknown users.`)
        if (userdata.length) {
          addNewTwitchLoginDocuments(userdata);
        }
        userdata.forEach(({login, twitchID}) => {
          usernameTwitchIDDictionary.set(login, twitchID);
        });
        resolve(usernameTwitchIDDictionary)
      } else {
        resolve(usernameTwitchIDDictionary)
      }
    })
  }

  const usernameTwitchIDDictionary = await buildUsernameTwitchIDDictionary();
  console.log(`${Date.now()} - Final Username/TwitchID dictionary size: ${usernameTwitchIDDictionary.size}`);

  db.collection('TwitchLogin').findOne({ login: channelName }, (err, { twitchID }) => {
    if (err) res.send(err);

    Promise.all(Object.keys(emoteCounts).map(code => {
      const _id = `${twitchID}-${code}`;
      db.collection('Emote').findOne({ _id }, (err, emote) => {
        if (err) res.send(err);

        const usedBy = emote.usedBy || {};
        Object.keys(emoteCounts[code].usedBy).map(username => {
          const userID = usernameTwitchIDDictionary.has(username)
            ? `${username}-${usernameTwitchIDDictionary.get(username)}`
            : username;

          if (usedBy[userID]) {
            usedBy[userID] += emoteCounts[code].usedBy[username];
          } else {
            usedBy[userID] = emoteCounts[code].usedBy[username];
          }
        })

        db.collection('Emote').updateOne({ _id }, {
          $set: {
            usedBy: { ...usedBy }
          },
          $inc: {
            count: emoteCounts[code].count
          }
        })
      })
    })).then(() => {
      db.collection('Channel').updateOne({ _id: twitchID }, {
        $push: { parsedLogfiles: { $each: logFilenames } }
      })
    }).then(() => {
      Object.keys(usernameLastSeen).map(username => {
        db.collection('TwitchLogin').findOneAndUpdate(
          { login: username }, 
          { 
            $max: { 
              lastSeen: usernameLastSeen[username] 
            }
          },
          { upsert: true }
        )
      })
    }).then(() => {
      res.send({ok: true})
    })
  })
}

module.exports = {
  updateChannelEmotes,
  updateCountsFromLog,
  getChannelData,
  getEmoteUsedByCounts
}