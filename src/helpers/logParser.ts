import { IEmote, ILogParserResults } from "../types";
async function buildResultsObjectFromEmoteArray(emotes: IEmote[]): Promise<ILogParserResults> {
  const results = <ILogParserResults>{}
  emotes.forEach((emote: IEmote) => {
    results[emote.code] = {
      provider: emote.provider,
      providerID: emote.providerID,
      count: 0,
      usedBy: {}
    }
  })
  return results;
}
export default async function logParser(log: string, emotes: IEmote[]) {
  const results: ILogParserResults = await buildResultsObjectFromEmoteArray(emotes);
  const codes = new Set(emotes.map(emote => emote.code));

  let cursor = log.indexOf('\n') + 1; // get to the first line;
  let word = "";
  let username = "";
  let char = "";

  const blankTimestampedLineRegEx = /\[\d{2}:\d{2}:\d{2}\]\s{1}\n/;
  const startsWithTimeStampRegEx = /\[\d{2}:\d{2}:\d{2}\]\s{2}/;
  const twoPartUsernameMessageRegEx = /^\[\d{2}:\d{2}:\d{2}\] (?!Uploading|Unrecognized)\S+ \w+: .+$/;
  const lengthOfTimeStampWithSingleSpace = 11;
  const lengthOfTimeStampWithDoubleSpace = 12;

  const isTimeStampedWithDoubleSpaceBeforeUsername = () => startsWithTimeStampRegEx.test(log.slice(cursor, cursor + 12));
  const isBlankTimestampedLine = () => blankTimestampedLineRegEx.test(log.slice(cursor - 12, cursor));


  const charIsNotNewline = () => char !== '\n';
  const cursorIsNotAtEOF = () => cursor < log.length;
  const cursorIsAtColon = () => log.charAt(cursor) === ':';
  const cursorIsAtNewline = () => log.charAt(cursor) === '\n';
  const charIsNotSpace = () => char !== ' ';

  const readChar = () => char = log.charAt(cursor);

  // type RegExpDictionary = { [index: string]: RegExp }
  // const STATUS_MESSAGE_REG_EXPS: RegExpDictionary = {
  //   START_LOGGING: /^ Start logging at \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \D+$/,
  //   SENDING_MESSAGES_TOO_QUICKLY: /^\[\d{2}:\d{2}:\d{2}\] (You are sending messages too quickly|Your message was not sent because you are sending messages too quickly)\.$/,
  //   MESSAGE_NOT_POSTED: /^\[\d{2}:\d{2}:\d{2}\] Your message wasn't posted due to conflicts with the channel's moderation settings\.$/,
  //   UNRECOGNIZED_COMMAND: /^\[\d{2}:\d{2}:\d{2}\] Unrecognized command: \//,
  //   SETTINGS_PREVENT: /^\[\d{2}:\d{2}:\d{2}\] Your settings prevent you from /,
  //   DONT_HAVE_PERMISSION: /^\[\d{2}:\d{2}:\d{2}\] You don't have permission to perform that action\.$/,
  //   ERROR_LOGGING_IN: /^\[\d{2}:\d{2}:\d{2}\] Error logging in$/,
  //   CONNECTION_TIMED_OUT: /^\[\d{2}:\d{2}:\d{2}\] Server connection timed out, reconnecting$/,
  //   CONNECTED: /^\[\d{2}:\d{2}:\d{2}\] connected$/,
  //   TWITCH_REQUESTED_RECONNECT: /^\[\d{2}:\d{2}:\d{2}\] Twitch Servers requested us to reconnect, reconnecting/,
  //   DISCONNECTED: /^\[\d{2}:\d{2}:\d{2}\] disconnected$/,
  //   NOW_HOSTING: /^\[\d{2}:\d{2}:\d{2}\] Now hosting \w+\.$/,
  //   EXITING_HOST_MODE: /^\[\d{2}:\d{2}:\d{2}\] \w+ has gone offline. Exiting host mode\.$/,
  //   EXITED_HOST_MODE: /^\[\d{2}:\d{2}:\d{2}\] Exited host mode\.\s?$/,
  //   LIVE: /^\[\d{2}:\d{2}:\d{2}\] \w+ is live!?$/,
  //   OFFLINE: /^\[\d{2}:\d{2}:\d{2}\] \w+ is (now offline\.|offline)$/,
  //   GIFTING_SUB: /^\[\d{2}:\d{2}:\d{2}\]\s{1}\w+ is gifting \d+ Tier [1-3] Subs? to \w+'s community!/,
  //   ANON_GIFTING_SUB: /^\[\d{2}:\d{2}:\d{2}\] An anonymous user is gifting \d+ Tier [1-3] Subs? to \w+'s community!/,
  //   GIFTED_SUB: /^\[\d{2}:\d{2}:\d{2}\] \w+ gifted a Tier [1-3] sub to \w+!/,
  //   ANON_GIFTED: /^\[\d{2}:\d{2}:\d{2}\] An anonymous user gifted a Tier [1-3] sub to \w+!/,
  //   SHARED_REWARDS: /^\[\d{2}:\d{2}:\d{2}\] \w+'s (Gift|Cheer) shared rewards to \d+ others in Chat!$/,
  //   PAYING_FORWARD: /^\[\d{2}:\d{2}:\d{2}\] \w+ is paying forward the Gift they got from \w+ to \w+/,
  //   REDEEMED: /^\[\d{2}:\d{2}:\d{2}\] \w+ redeemed /,
  //   SUBSCRIBED: /^\[\d{2}:\d{2}:\d{2}\] \w+ subscribed at Tier [1-3]\./,
  //   PRIME_SUB: /^\[\d{2}:\d{2}:\d{2}\] \w+ subscribed with Prime\./,
  //   STARTED_UPLOAD: /^\[\d{2}:\d{2}:\d{2}\] Started upload\.{3}$/,
  //   COULDNT_LOAD_IMAGE: /^\[\d{2}:\d{2}:\d{2}\] Couldn't load image/,
  //   FAILED_TO_OPEN_FILE: /^\[\d{2}:\d{2}:\d{2}\] Failed to open file\./,
  //   CANNOT_UPLOAD_FILE: /^\[\d{2}:\d{2}:\d{2}\] Cannot upload file/,
  //   UPLOADING_IMAGE: /^\[\d{2}:\d{2}:\d{2}\] Uploading \w+: /,
  //   IMAGE_UPLOADED: /^\[\d{2}:\d{2}:\d{2}\] Your image has been uploaded to /,
  //   DATE: /^\[\d{2}:\d{2}:\d{2}\] (Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday){1}, (January|February|March|April|May|June|July|August|September|October|November|December){1} \d{1,2}, \d{4}$/,
  //   CHANNEL_EMOTES_RELOADED: /^\[\d{2}:\d{2}:\d{2}\] (7TV|BetterTTV|FrankerFaceZ){1} channel emotes reloaded\.$/,
  //   FAILED_TO_FETCH: /^\[\d{2}:\d{2}:\d{2}\] Failed to fetch (7TV|BetterTTV|FrankerFaceZ) channel emotes./,
  //   USER_TIMED_OUT: /^\[\d{2}:\d{2}:\d{2}\] \w+ has been timed out for \d+/,
  //   SELF_TIMEDOUT: /^\[\d{2}:\d{2}:\d{2}\] You were timed out for /,
  //   USER_BANNED: /^\[\d{2}:\d{2}:\d{2}\] \w+ has been permanently banned\.\s?$/,
  //   RAIDED: /^\[\d{2}:\d{2}:\d{2}\] \d+ raiders from \w+ have joined!$/,
  //   EARNED_BAGE: /^\[\d{2}:\d{2}:\d{2}\] \w+ earned a new /,
  //   BITS_BADGE: /^\[\d{2}:\d{2}:\d{2}\] bits badge tier notification/,
  //   ARE_TIMEDOUT: /^\[\d{2}:\d{2}:\d{2}\] You are timed out for /,
  //   ROOM_MODE: /^\[\d{2}:\d{2}:\d{2}\] This room is now in \d/,
  // }

  const isLikelyValidUserMessage = () => {
    let line = "";
    readChar();

    while (charIsNotNewline() && cursorIsNotAtEOF()) {
      line += char;
      cursor++;
      readChar();
    }

    const result = twoPartUsernameMessageRegEx.test(line);

    // Object.keys(STATUS_MESSAGE_REG_EXPS).forEach(key => {
    //   if (STATUS_MESSAGE_REG_EXPS[key].test(line)) {
    //     result = true;
    //   }
    // })

    if (result) {
      cursor -= line.length;
      readChar();
    }
    return result;
  }

  const buildUsername = () => {
    while (!cursorIsAtColon()) {
      readChar();
      if (charIsNotSpace()) {
        username += char;
      } else {
        // Indicates presence of internationalized Display Name alongside the User Name that we want
        username = "";
      }
      cursor++;
    }
    cursor += 2; // get past ': ' after username
    readChar();
  }
  const buildWord = () => {
    while (charIsNotSpace() && charIsNotNewline() && cursorIsNotAtEOF()) {
      word += char;
      cursor++;
      readChar();
    }
  }

  const parseWord = () => {
    if (codes.has(word)) {
      // console.log(username, word)
      // console.log(`Map Entry: ${JSON.stringify(resultsEntry)}`)
      results[word].count++;

      if (results[word].usedBy[username] === undefined) {
        // NOTE: This is a good check for a log being corrupted since timestamps will appear in strange places
        // if (username.startsWith('[')) {
        //   console.log(username, word)
        // }
        results[word].usedBy[username] = 1;
      } else {
        results[word].usedBy[username]++;
      }
    }
  }
  const parseLine = () => {
    if (isBlankTimestampedLine()) return;

    buildUsername();

    while (charIsNotNewline() && cursorIsNotAtEOF()) {
      buildWord();
      parseWord();
      prepareForNextWord();
    }

    prepareForNextLine();
  }

  const prepareForNextWord = () => {
    // Check whether there is another word
    if (char === ' ') {
      cursor++; // go to next word
    }

    word = "";
    readChar();
  }
  const prepareForNextLine = () => {
    username = "";  // reset username
    moveToStartOfNextLine();
    readChar();
  }

  const moveToStartOfNextLine = () => {
    while (charIsNotNewline() && cursorIsNotAtEOF()) {
      cursor++;
    }
    cursor++;
  }
  const moveToStartOfUsername = (offset: number) => {
    cursor += offset;
  }

  const handlePotentialUserMessage = () => {
    // Most of the time a line like this with a single space after the timestamp is a channel status message from Chatterino.
    // For example: "Now hosting bundumpling" or "bundumpling has gone offline. Exiting host mode."
    // Sometimes it is a valid message in the channel from a user though.
    // This typically happens with usernames that have internationalized language variations.
    // For example: "アナホリシモン anahorishimon: some message"
    // By looking for a colon (:) character we can be reasonably sure whether it's a status message to skip or a user message to parse.

    if (!isLikelyValidUserMessage()) {
      moveToStartOfNextLine();
      return;
    }

    let skipped = log.slice(cursor, cursor += 12);
    let lookForNewline = true;


    while (lookForNewline && cursorIsNotAtEOF()) {
      readChar();
      skipped += char;
      cursor++;
      if (cursorIsAtNewline()) {
        lookForNewline = false;
        cursor++;
      } else if (cursorIsAtColon()) {
        // Found a line where the username is separated from the preceding timestamp by only a single space.
        cursor -= skipped.length;
        lookForNewline = false;
        moveToStartOfUsername(lengthOfTimeStampWithSingleSpace);
        parseLine();
      }
    }
  }


  while (cursorIsNotAtEOF()) {
    if (isTimeStampedWithDoubleSpaceBeforeUsername()) {
      moveToStartOfUsername(lengthOfTimeStampWithDoubleSpace); // get past timestamp
      parseLine();
    } else {
      handlePotentialUserMessage();
    }
  }

  return results;
}