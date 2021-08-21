import { IEmote } from "../types";

export default async function logParser(log: string, emotes: IEmote[]) {

  // Print first line of log to display date and time logging started
  // console.log(log.slice(0, 60)); 

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
  const blankTimestampedLineRegEx = /\[\d{2}:\d{2}:\d{2}\]\s{1}\n/;
  const startsWithTimeStampRegEx = /\[\d{2}:\d{2}:\d{2}\]\s{2}/;
  const timestampLength = 12;
  let cursor = log.indexOf('\n') + 1;
  let word = "";
  let username = "";
  let char = "";

  const parseLine = () => {
    if (blankTimestampedLineRegEx.test(log.slice(cursor - 12, cursor))) {
      // console.log(`blank line detected at: '${log.slice(cursor - 12, cursor)}'`)
      return;
    }
    while (log.charAt(cursor) !== ':' && cursor < log.length) {
      username += log.charAt(cursor);
      cursor++;
    }
    cursor += 2; // get past ': ' after username

    char = log.charAt(cursor);
    while (char !== '\n' && cursor < log.length) {
      while (char !== ' ' && char !== '\n') {
        word += char;
        cursor++;
        char = log.charAt(cursor);
      }

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

      if (char === ' ') cursor++;
      word = "";
      char = log.charAt(cursor);
    }
    username = "";
    cursor++; // get to new line
  }

  while (cursor < log.length - 1) {
    if (!startsWithTimeStampRegEx.test(log.slice(cursor, cursor + 12))) {
      // console.log(`--- Failed Line: '${log.slice(cursor, cursor + 20)}'`);
      if (log.charAt(cursor) === '#') {
        // logger message, go directly to new line
        // console.log(`Found Logger message: ${log.slice(cursor, cursor + 20)}`)
        while (log.charAt(cursor) !== '\n' && cursor < log.length) {
          cursor++;
        }
        cursor++;
      } else {
        let skipped = log.slice(cursor, cursor + 12);
        // console.log(`Skipped: '${skipped}'`);
        cursor += 12;
        // console.log(`Char at +11 ${log.charAt(cursor)}`)
        let lookForNewline = true;
        while (lookForNewline && cursor < log.length) {
          skipped += log.charAt(cursor);
          cursor++;
          if (log.charAt(cursor) === '\n') {
            lookForNewline = false;
            cursor++;
            // console.log(`Skipped line: ${skipped}`)
          } else if (log.charAt(cursor) === ':') {
            // console.log(`Going back to process this line: '${skipped}'`)
            cursor -= (skipped.length - 11);
            // console.log(`Char skipped back to: '${log.charAt(cursor)}`)
            // console.log(`Line to parse: '${log.slice(cursor, cursor + skipped.length + 1)}'`)
            lookForNewline = false;
            parseLine();
          }
        }
      }
    } else {
      cursor += timestampLength; // get past timestamp
      parseLine();
    }
  }
  return resultsMap;
}