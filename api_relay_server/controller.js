const updateChannelEmotes = (db, channelName, channelID, emotes) => {

  const updateEmoteInEmoteCollection = ({ code, provider, providerEmoteID, image }) => {
    db.collection('Emote').findOneAndUpdate({
      $and: [ { channelID }, { code } ]
    },
    {
      $set: {
        channelName,
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
  };

  const updateEmotesInChannelCollection = (channelID, channelEmotes) => {
    db.collection('Channel').findOneAndUpdate(
      { _id: channelID },
      {
        $set: { emotes: channelEmotes }
      }, { upsert: true }
    )
  };  

  return db.collection('Channel').findOne({ _id: channelID }).then((err, channel) => {
    if (err) {
      console.error(err)
    }

    let channelEmotes = channel ? channel.emotes : {};

    emotes.forEach(emote => {
      updateEmoteInEmoteCollection(emote);
      const { code, image, provider, providerEmoteID } = emote;
      const channelEmoteKey = `${provider}-${providerEmoteID}`;
      channelEmotes[channelEmoteKey] = {
        code,
        image,
        provider,
        providerEmoteID,
        ...channelEmotes[channelEmoteKey] || { count: 0, }
      }
    })

    updateEmotesInChannelCollection(channelID, channelEmotes);
  })
}

const getChannelData = (req, res, db) => {
  db.collection('TwitchLogin').findOne({ login: req.params.channelName }, (err, { login, twitchID }) => {
    if (err) res.send(err);

    db.collection('Channel').findOne({ _id: twitchID }, (err, data) => {
      if (err) res.send(err);
      const emotes = Object.keys(data.emotes).map(id => {
        return {
          id,
          count: data.emotes[id].count || 0,
          ...data.emotes[id]
        }
      })
      const findEmoteFromProvider = provider => emotes.some(emote => emote.provider === provider);
      const hasEmotesFrom = {
        "Twitch": findEmoteFromProvider("Twitch"),
        "FFZ": findEmoteFromProvider("FFZ"),
        "BTTV": findEmoteFromProvider("BTTV"),
        "7TV": findEmoteFromProvider("7TV")
      }

      const result = {
        twitchID,
        name: login,
        hasEmotesFrom,
        emotes
      };
     
      res.json(result);
    })
  })
}



module.exports = {
  updateChannelEmotes,
  getChannelData
}