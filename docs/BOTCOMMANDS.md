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

`user` *Optional* User name (default: command user).

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