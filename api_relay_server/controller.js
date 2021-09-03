const updateChannelEmotes = (db, channelID, emotes) => {

  Promise.all(emotes.map(
    ({ code, provider, providerEmoteID, image }) => {
      const _id = `${channelID}-${code}`;

      return db.collection('Emote').findOneAndUpdate({
        _id
      },
      {
        $set: {
          channelID,
          code,
          provider,
          providerEmoteID,
          image
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
          console.log(result)
        }
      })
    })
  ).then(() => 
    db.collection('Channel').findOneAndUpdate(
      { _id: channelID },
      {
        $set: { emotes: emotes.map(({ code }) => `${channelID}-${code}`) }
      }, { upsert: true }
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
          }
        ],
      ).toArray().then(result => {
        res.json(result[0])

      });
    }
  )
}

  //   db.collection('Channel').findOne({ _id: twitchID }, (err, data) => {
  //     if (err) res.send(err);
  //     const emotes = Object.keys(data.emotes).map(id => {
  //       return {
  //         id,
  //         count: data.emotes[id].count || 0,
  //         ...data.emotes[id]
  //       }
  //     })
  //     const findEmoteFromProvider = provider => emotes.some(emote => emote.provider === provider);
  //     const hasEmotesFrom = {
  //       "Twitch": findEmoteFromProvider("Twitch"),
  //       "FFZ": findEmoteFromProvider("FFZ"),
  //       "BTTV": findEmoteFromProvider("BTTV"),
  //       "7TV": findEmoteFromProvider("7TV")
  //     }

  //     const result = {
  //       twitchID,
  //       name: login,
  //       hasEmotesFrom,
  //       emotes
  //     };
     
  //     res.json(result);
  //   })
  // })




module.exports = {
  updateChannelEmotes,
  getChannelData
}