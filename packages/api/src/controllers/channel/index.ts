import axios, { AxiosResponse } from 'axios';
import { Request, Response } from "express";
import { db } from "../../db";
import { Document } from 'mongodb';
import { ChannelDocument, Emote, EmoteFrom7TV, EmoteFromBTTV, EmoteFromFFZ, EmoteFromTwitch, normalizeEmoteFromTwitch, normalizeEmoteFromFFZ, normalizeEmoteFromBTTV, normalizeEmoteFrom7TV } from "@ttv-emote-stats/common";

interface TwitchLoginDocument extends Document {
  twitchID: string;
}

export const getEmotes = async (req: Request, res: Response) => {
  const { twitchID } = 
    await db.collection("TwitchLogin")
            .findOne({ _id: req.params.channelName }) as TwitchLoginDocument;
  const data = 
    await db.collection("Channel")
            .aggregate([
              { $match: { _id: twitchID } },
              {
                $lookup: {
                  from: "Emote",
                  localField: "emotes",
                  foreignField: "_id",
                  as: "emotes",
                }
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
                        providerID: "$$emote.providerID"
                      }
                    }
                  }
                }
              },
              {
                $project: {
                  emotes: "$emotes"
                }
              }
            ]).toArray();
    res.status(200).json(data[0].emotes);
}

export const getChannelEmoteCounts = async (req: Request, res: Response) => {
  const { twitchID } = 
    await db.collection("TwitchLogin")
            .findOne({ _id: req.params.channelName }) as TwitchLoginDocument;
  const result = 
    await db.collection("Channel")
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
            .toArray();

  res.json(result[0]);
};

export const getChannelEmoteCodes = async (req: Request, res: Response) => {
  try {
    const ignoreObsolete = Boolean(req.query.ignoreObsolete);
    const { twitchID } = await db.collection("TwitchLogin").findOne({ _id: req.params.channelName }) as TwitchLoginDocument;
    const result = 
      await db.collection("Channel")
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
              .toArray();
          
    const emotes = result[0].emotes;
    const emoteCodes = ignoreObsolete
      ? emotes
          .filter((emote: Emote) => !emote.obsolete)
          .map((emote: Emote) => emote.code)
      : emotes.map((emote: Emote) => emote.code);

    res.json({
      channelID: twitchID,
      emoteCodes,
    });
  } catch(error) {
    res.send({
      ok: false,
      error: "Failed to fetch Emote Codes for " + req.params.channelName,
    })
  }
};

export const getEmotesFromDbAndProviders = async (req: Request, res: Response) => {
  const channelName = req.params.channelName;

  interface Results {
    emotesFromDatabase: Emote[];
    emotesFromProviders: { [key: string]: Emote[] }
  }

  let results: Results = {
    emotesFromDatabase: [],
    emotesFromProviders: {
      Twitch: [],
      FFZ: [],
      BTTV: [],
      "7TV": [],
    },
  };

  const { twitchID } = await db.collection("TwitchLogin").findOne({ _id: channelName }) as TwitchLoginDocument;

  const channelDocuments = 
    await db.collection("Channel")
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
            .toArray();

  if (channelDocuments && channelDocuments[0] && channelDocuments[0].emotes) {
    results.emotesFromDatabase = channelDocuments[0].emotes;
  } else {
    results.emotesFromDatabase = [];
  }

  try {
    const twitchEmotesResponse = await axios.get(`http://localhost:8081/twitch/emotes?id=${twitchID}`) as AxiosResponse<EmoteFromTwitch[]>;
    const twitchEmotes = twitchEmotesResponse.data;
    results.emotesFromProviders["Twitch"] = 
      (twitchEmotes.length) 
      ? twitchEmotes.map(normalizeEmoteFromTwitch)
      : [];  
  } catch (error) {
    console.log("Error retrieving Twitch emotes.");
    results.emotesFromProviders["Twitch"] = [];
  }

  try {
    const ffzEmotesResponse = await axios.get(`http://localhost:8081/ffz/emotes?id=${twitchID}`) as AxiosResponse<EmoteFromFFZ[]>;
    const ffzEmotes = ffzEmotesResponse.data;
    results.emotesFromProviders["FFZ"] = 
      (ffzEmotes.length)
      ? ffzEmotes.map(normalizeEmoteFromFFZ)
      : [];    
  } catch (error) {
    console.log("Error retrieving FFZ emotes.");
    results.emotesFromProviders["FFZ"] = [];
  }


  try {
    const bttvEmotesResponse = await axios.get(`http://localhost:8081/bttv/emotes?id=${twitchID}`) as AxiosResponse<EmoteFromBTTV[]>;
    const bttvEmotes = bttvEmotesResponse.data;
    results.emotesFromProviders["BTTV"] = 
      (bttvEmotes.length)
      ? bttvEmotes.map(normalizeEmoteFromBTTV)
      : [];
  } catch (error) {
    console.log("Error retrieving BTTV emotes.");
    results.emotesFromProviders["BTTV"] = [];
  }

  
  try {
    const sevenTVEmotesResponse = await axios.get(`http://localhost:8081/7tv/emotes?name=${channelName}`) as AxiosResponse<EmoteFrom7TV[]>;
    const sevenTVEmotes = sevenTVEmotesResponse.data;
    results.emotesFromProviders["7TV"] = 
      (sevenTVEmotes.length)
      ? sevenTVEmotes.map(normalizeEmoteFrom7TV)
      : [];
  } catch (error) {
    console.log("Error retrieving 7TV emotes.");
    results.emotesFromProviders["7TV"] = [];
  }

  res.send({
    channelID: `${twitchID}`,
    channelName,
    emotesFromDatabase: results.emotesFromDatabase,
    emotesFromProviders: Object
      .keys(results.emotesFromProviders)
      .reduce((result: Emote[], provider) => {
        return [...results.emotesFromProviders[provider], ...result];
      }, [])
  });
};

export const getListOfParsedLogs = async (req: Request, res: Response) => {
  const channelName = req.params.channelName;
  const { twitchID } = await db.collection("TwitchLogin").findOne({ _id: channelName }) as TwitchLoginDocument;
  const { parsedLogfiles } = await db.collection("Channel").findOne({ _id: twitchID }) as ChannelDocument;

  res.send(parsedLogfiles)
};

export const saveUpdatedEmotes = async (req: Request, res: Response) => {
  const channelName = req.params.channelName;
  const channelID = req.body.channelID;
  const emotes: Emote[] = req.body.emotes;

  return Promise.all(
    emotes.map(({ code, provider, providerID, image, obsolete }: Emote) => {
      const _id = `${channelID}-${code}`;

      return db.collection("Emote")
                .findOneAndUpdate(
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
                  }
                )
    })
  )
  .then(() =>
    db.collection("Channel").findOneAndUpdate(
      { _id: channelID },
      {
        // @ts-ignore
        $addToSet: {
          emotes: { $each: emotes.map((emote) => `${channelID}-${emote.code}`) },
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
  .then(result => res.send({ ok: true, result }))
  .catch(error => {
    res.send({ ok: false, error})
  });
};

export const create = async (req: Request, res: Response) => {
  const channelName = req.params.channelName;
  const { profileImageURL, channelID, emotes } = req.body as { profileImageURL: string; channelID: string; emotes: Emote[]; };

  console.log(channelName, profileImageURL, channelID, emotes)

  console.log("Handling POST to channel/create");

  function generateEmoteID(emoteCode: string) {
    return `${channelID}-${emoteCode}`;
  }

  async function buildArrayOfEmoteIds(): Promise<string[]> {
    return emotes.map(({ code }) => generateEmoteID(code));
  }

  async function createChannelDocument(): Promise<ChannelDocument> {
    const arrayOfEmoteIds = await buildArrayOfEmoteIds();

    return {
      _id: channelID,
      emotes: arrayOfEmoteIds,
      parsedLogfiles: [],
      profileImageURL
    }
  }

  async function createTwitchLoginDocument() {
    return {
      _id: channelName,
      twitchID: channelID,
      lastSeen: 0
    }
  }

  async function createEmoteDocuments() {
    return emotes.map(({ code, provider, providerID, image, obsolete }) => ({
      _id: generateEmoteID(code),
      channelID,
      code,
      count: 0,
      image,
      obsolete,
      provider,
      providerID,
      usedBy: {},
      usedOn: {}
    }))
  }

  const channelDocument = await createChannelDocument();
  const twitchLoginDocument = await createTwitchLoginDocument();
  const emoteDocuments = await createEmoteDocuments();

  console.log(channelDocument, twitchLoginDocument, emoteDocuments[0]);

  async function insertChannelDocument() {
    await db
    .collection("Channel")
    .insertOne(channelDocument as any);
  }

  async function insertTwitchLoginDocument() {
    await db
    .collection("TwitchLogin")
    .updateOne(
      { _id: twitchLoginDocument._id },
      { 
        $set: { 
          twitchID: twitchLoginDocument.twitchID
        },
        $setOnInsert: {
          lastSeen: twitchLoginDocument.lastSeen 
        }
      },
      { upsert: true }
    );
  }

  async function insertEmoteDocuments() {
    await db
    .collection("Emote")
    .insertMany(emoteDocuments as any[]);
  }

  Promise.all(
    [
      insertChannelDocument(), 
      insertTwitchLoginDocument(), 
      insertEmoteDocuments()
    ]
  ).then(() => {
    res.status(200).send("Successfully created channel!");
  }).catch((error) => {
    console.error(error);
    res.status(500).send("Error creating channel!");
  })
}

export const updateCountsFromLog = async (req: Request, res: Response) => {
  const channelName = req.params.channelName;
  const { usernameLastSeen, emoteCounts } = req.body.logParserResults;
  const logFilenames = req.body.logFilenames;

  console.log("Handling POST to channel/updateCountsFromLog");

  async function buildUsernamesSet() {
    const usernames: Set<string> = new Set();
    Object.keys(emoteCounts).forEach((code) => {
      Object.keys(emoteCounts[code].usedBy).forEach((username) => {
        usernames.add(username);
      });
    });
    return usernames;
  }

  async function getTwitchLoginsFromDB(usernames: IterableIterator<string>) {
    const dict: Map<string, string> = new Map();
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

  async function buildUsernamesWithoutTwitchID(usernames: Set<string>, usernameTwitchIDDictionary: Map<string, string>) {
    const usernamesWithoutTwitchID: Set<string> = new Set();
    usernames.forEach((username) => {
      if (!usernameTwitchIDDictionary.has(username)) {
        usernamesWithoutTwitchID.add(username);
      }
    });
    return usernamesWithoutTwitchID;
  }

  async function chunkUsernamesSetToArray(usernamesWithoutTwitchID: Set<string>) {
    let usernamesArray = [...usernamesWithoutTwitchID.values()];
    let usernameBatches = [];
    for (let i = 0, size = usernamesWithoutTwitchID.size; i < size; i += 100) {
      usernameBatches.push(usernamesArray.slice(i, i + 100));
    }
    return usernameBatches;
  }

  async function requestTwitchIDsFromUsernameArray(usernames: string[]): Promise<TwitchLoginDocument[]> {
    return new Promise(async (resolve, reject) =>
      setTimeout(async () => {
        const paramsString = usernames
          .map((username) => `login=${username}`)
          .join("&");

        try {
          const URL = `http://localhost:8081/twitch/userbatch`;
          const userdataResponse = await axios.post(URL, { paramsString });
          const userdata = userdataResponse.data.map((user: TwitchLoginDocument) => {
            const { login } = user;
            const twitchID = user.id;
            return {
              _id: login,
              twitchID,
            };
          })
          resolve(userdata);
        } catch (err) {
          console.log(err);
          reject(undefined);
        }
      }, 1000)
    );
  }

  async function processBatchRequestForTwitchIDs(usernameBatches: string[][]) {
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

  async function addNewTwitchLoginDocuments(userdata: TwitchLoginDocument[]) {
    return new Promise(async (resolve) => {
      userdata.forEach(({ _id, twitchID }: TwitchLoginDocument) =>
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
      resolve(undefined);
    });
  }

  async function buildUsernameTwitchIDDictionary(): Promise<Map<string, string>> {
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
        const userdata = await processBatchRequestForTwitchIDs(usernameBatches) as TwitchLoginDocument[];
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

  const { twitchID } = await db.collection("TwitchLogin").findOne({ _id: channelName }) as TwitchLoginDocument;

  Promise.all(
    Object.keys(emoteCounts).map((code) => {
      const _id = `${twitchID}-${code}`;
      db.collection("Emote").findOne({ _id }, (err, emote) => {
        if (err) {
          res.send(err);
        }

        if (!emote || !emote.usedBy || !emote.usedOn) {
          console.log(_id + "not found");
          } else {

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
        }
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
};