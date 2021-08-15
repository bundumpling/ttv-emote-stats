
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

## **Feature**: Allow Grouping of the same emote with different names
*e.g. Twitch emote with corresponding Personal BTTV name for unsub'd users*<br>
  `bundumHappy`<br>
  *subsumes*<br>
  `bundumHappy`<br>
  `bundumpHappy`<br>
and can display combined counts.
- Only show in Overall rankings?
- Include option to toggle emote grouping from the view?
- Requires a management panel for use by the channel owner. 
- May also be worth adding ability to manage by communicating with the bot directly from chat.

## **Feature**: Continuous chat monitoring
  - Implement real-time view using web sockets
  - Batch updates to database from the chat monitoring bot

## **Feature**: Detailed statistics
Rewrite parser to track who used the emote being counted and when it was used (per-day basis seems ideal).
  - Usage within a range of dates
    - emotes by day
    - days by emote
  - Usage by specific users
    - usernames by emote
    - emote by username 
#### *This all points to the relational nature of the data, and the usefulness of an RDBMS.*

## **Feature**: User Accounts
  Given a user account system tied to a channel in which a bot is present, the current Settings page would become part of an onboarding process.

  Other functionality would then be accessible from a **Management Panel**.


## **Feature**: Search
Emote usage data by specific users in a channel would ideally have the option to search for a group of names.
  - Use case would be someone that changes their name and wishes to combine the data recorded under multiple aliases.
  - Might even be worth having a table that relates usernames to Twitch IDs, which remain the same despite name changes.

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
  - Add **detailed view** for provider api results.
