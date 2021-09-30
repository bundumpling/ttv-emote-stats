
# Development Notes

## **Dependencies**
Needed `sass-loader@^10` to get Bulma to work properly in dev environment.

## **Provider APIs**
  - Twitch uses Twitch ID<br>
    `https://api.twitch.tv/helix/chat/emotes?broadcaster_id={TwitchID}`
  - BTTV uses Twitch ID<br>
    `https://api.betterttv.net/3/cached/users/twitch/{TwitchID}`
  - FFZ uses Twitch ID<br>
    `https://api.frankerfacez.com/v1/room/id/{TwitchID}`
  - 7TV uses username<br>
    `https://api.7tv.app/v2/users/{username}/emotes`

#### To get Twitch ID from username (need to send Client-ID and OAuth token in request headers):
  `https://api.twitch.tv/helix/users?login={username}`

## **Feature**: Continuous chat monitoring
  - Implement real-time view using web sockets
  - Batch updates to database from the chat monitoring bot

## **Feature**: Search
Emote usage data by specific users in a channel would ideally have the option to search for a group of names.
  - Use case would be someone that changes their name and wishes to combine the data recorded under multiple aliases.

## **Feature**: Emote image sourcing
  - Change emote image hover to show larger source image when available.
  - If emote was removed from provider, what should be done?
  - Is storing obsolete emote images feasible at scale? 
  - Perhaps limit feature to a privileged user class. Could flag obsolete, with rankings toggle for showObsolete.

## **Feature**: Diffing when saving emote sets to DB
  - When saving emotes, should compare to existing emote data for the channel.
  - Warn on duplicate emote codes from separate providers.
    - Force choosing only one provider per code?
  - For new emote additions there should be the option to parse logs to initialize counts for the new emote(s)
  - For existing emote codes update with new art or provider (if previous one was removed)
  
## ***Current Tasks***
  - Create command list for interacting with the twitch bot.
    - Channel owners should be able to update the channel's emote set in the database via bot command.
