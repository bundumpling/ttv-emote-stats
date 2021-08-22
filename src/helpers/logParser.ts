import { IEmote } from "../types";

export default async function logParser(log: string, emotes: IEmote[]) {
  const resultsMap = new Map<any, any>(
    emotes.map((e: IEmote, i: number) =>
      [
        e.name,
        {
          index: i,
          count: 0,
          usedBy: {}
        }
      ]));

  let cursor = log.indexOf('\n') + 1; // get to the first line;
  let word = "";
  let username = "";
  let char = "";


  const blankTimestampedLineRegEx = /\[\d{2}:\d{2}:\d{2}\]\s{1}\n/;
  const startsWithTimeStampRegEx = /\[\d{2}:\d{2}:\d{2}\]\s{2}/;
  const lengthOfTimeStampWithSingleSpace = 11;
  const lengthOfTimeStampWithDoubleSpace = 12;

  const isTimeStampedWithDoubleSpaceBeforeUsername = () => startsWithTimeStampRegEx.test(log.slice(cursor, cursor + 12));
  const isBlankTimestampedLine = () => blankTimestampedLineRegEx.test(log.slice(cursor - 12, cursor));
  const isLoggerComment = () => log.charAt(cursor) === '#';

  const charIsNotNewline = () => char !== '\n';
  const cursorIsNotAtEOF = () => cursor < log.length;
  const cursorIsAtColon = () => log.charAt(cursor) === ':';
  const cursorIsAtNewline = () => log.charAt(cursor) === '\n';
  const charIsNotSpace = () => char !== ' ';

  const buildUsername = () => {
    while (!cursorIsAtColon()) {
      username += log.charAt(cursor);
      cursor++;
    }
    cursor += 2; // get past ': ' after username
    char = log.charAt(cursor);
  }
  const buildWord = () => {
    while (charIsNotSpace() && charIsNotNewline() && cursorIsNotAtEOF()) {
      word += char;
      cursor++;
      char = log.charAt(cursor);
    }
  }

  const parseWord = () => {
    if (resultsMap.has(word)) {
      // console.log(username, word)
      const mapEntry = resultsMap.get(word);
      // console.log(`Map Entry: ${JSON.stringify(mapEntry)}`)
      mapEntry.count++;

      if (mapEntry.usedBy[username] === undefined) {
        // NOTE: This is a good check for a log being corrupted since timestamps will appear in strange places
        // if (username.startsWith('[')) {
        //   console.log(username, word)
        // }
        mapEntry.usedBy[username] = 1;
      } else {
        mapEntry.usedBy[username]++;
      }
    }
  }
  const parseLine = () => {
    if (isBlankTimestampedLine()) return;

    const username = buildUsername();

    while (charIsNotNewline() && cursorIsNotAtEOF()) {
      const word = buildWord();
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
    char = log.charAt(cursor);
  }
  const prepareForNextLine = () => {
    username = "";  // reset username
    cursor++; // go to next line
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

    let skipped = log.slice(cursor, cursor += 12);
    let lookForNewline = true;
    while (lookForNewline && cursorIsNotAtEOF()) {
      skipped += log.charAt(cursor);
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
      if (isLoggerComment()) {
        moveToStartOfNextLine();
      } else {
        handlePotentialUserMessage();
      }
    }
  }

  return resultsMap;
}