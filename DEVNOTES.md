
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

## **Feature**: Detailed statistics
Rewrite parser to track who used the emote being counted (**done**) and when it was used (per-day basis seems ideal).
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
  - Update Settings page to be a protected route using Twitch OAuth credentials.
  - Used to manage channel emote updates by comparing freshly fetched data from emote provider APIs to what's currently in the database.
  - If an existing emote is no longer accessible from the provider, option given to flag as obsolete in the database.
  - If an existing emote has changed (for instance, the emote code now applies to a different emote, possible from a different provider entirely, or was previously flagged as obsolete and is now available again), option given to update in the database.
  - If a new emote is provided, option given to add it to the database.
  - If multiple emotes use the same emote code, warn of the conflict and force a choice of one among them to store in the database.
  - View will have a Condensed and a Detailed view.
    - Condensed is similar to the current view, where each provider's emotes appear as a grid of image thumbnails. Added will be a summary of pending changes.
    - Detailed is a table view, with attribute columns and functionality to sort by any attribute.
