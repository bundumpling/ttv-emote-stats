# TTV Emote Stats

View emote usage statistics for a [Twitch.tv](https://www.twitch.tv/) channel's chat.

To see planned features and current tasks, refer to the [Development Notes](https://github.com/bundumpling/ttv-emote-stats/blob/master/docs/DEVNOTES.md).


___
# Bot Commands
This bot tracks channel-specific emotes. This means neither global emotes (including those from third-party providers) nor other channel's Twitch emotes are tracked.

Supported third-party providers include FFZ, BTTV, and 7TV.

## Emote Total Usage Count

___Usage___

`%ecount emote`

___Parameters___

`emote` **Required** Emote name (case-sensitive).

## Emote Usage Count by User

___Usage___

`%ecountuser emote user` 

___Parameters___

`emote` **Required** Emote name (case-sensitive).

(user) *Optional* User name (default: command user).

## Emote Usage Count By Date

___Usage___

`%ecountdate emote date`

___Parameters___

`emote` **Required** Emote name (case-sensitive).

`date` *Optional* Date (format: `YYYYMMDD`, default: current date)

## Emote Top User

___Usage___

`%etopuser emote`

___Parameters___

`emote` **Required** Emote name (case-sensitive).

## Emote Top 3 Users

___Usage___

`%etopusers emote`

___Parameters___

`emote` **Required** Emote name (case-sensitive).

## Emote Top Usage Date

___Usage___

`%etopdate emote`

___Parameters___

`emote` **Required** Emote name (case-sensitive).

## Update Channel's Emote Set -- ***Channel Owner Only***

___Usage___

`%update`

## View/Change Bot Mode -- ***Channel Owner Only***

___Usage___

`%mode mode`

___Parameters___

`mode` *Optional* Acceptable values:
  - `NORMAL` All commands are available (applicable owner-only restrictions remain in effect).
  - `RESTRICTED` Only the channel owner may use commands.
  - `DISABLED` All commands disabled except for `%mode` and `%update`.
  - `SILENT` Same as `DISABLED` except bot no longer sends chat messages about failed command usage attempts.

## Get Link to Commands (*this file*)

___Usage___

`%commands`
___

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
