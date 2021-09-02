const updateChannelEmotes = (db, channelName, channelID, emotes) => {

  const updateEmoteInEmoteCollection = emote => {
    db.collection('Emote').findOneAndUpdate({
      _id: emote.id
    },
    {
      $set: {
        "_id": emote.id,
        "channel_name": channelName,
        "channel_id": channelID,
        "code": emote.name,
        "provider": emote.provider,
        "image_source": emote.image
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

  db.collection('Channel').findOne({ _id: channelID }).then((err, channel) => {
    if (err) {
      console.error(err)
    }

    let channelEmotes = channel ? channel.emotes : {};

    emotes.forEach(emote => {
      updateEmoteInEmoteCollection(emote);
        channelEmotes[emote.id] = {
          code: emote.name,
          provider: emote.provider,
          image_source: emote.image,
          ...channelEmotes[emote.id] || {}
        }
    })

    updateEmotesInChannelCollection(channelID, channelEmotes);
  })
}

module.exports = {
  updateChannelEmotes
}