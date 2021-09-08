import { IEmote, ILogParserEmoteCounts } from "../types";
async function buildResultsObjectFromEmoteArray(emotes: IEmote[]): Promise<ILogParserEmoteCounts> {
  const emoteCounts = <ILogParserEmoteCounts>{}
  emotes.forEach((emote: IEmote) => {
    emoteCounts[emote.code] = {
      provider: emote.provider,
      providerID: emote.providerID,
      count: 0,
      usedBy: {}
    }
  })
  return emoteCounts;
}
export default async function logParser(log: string, emotes: IEmote[]) {
  const emoteCounts: ILogParserEmoteCounts = await buildResultsObjectFromEmoteArray(emotes);
  const codes = new Set(emotes.map(emote => emote.code));

  interface IUsernameLastSeen {
    [key: string]: number;
  }
  const usernameLastSeen: IUsernameLastSeen = {};

  let cursor = log.indexOf('\n') + 1; // get to the first line;

  const startingTime = (() => {
    // First line of the log needs to be in the format:
    // # Start logging at 2020-12-10 11:28:54 Eastern Standard Time

    const firstLogLine = log.slice(0, cursor);
    const match = firstLogLine.match(/^#.+(\d{4})-(\d{2})-(\d{2}).+\n$/);
    if (match) {
      const [year, month, day] = match.slice(1).map(Number);
      const logDate = new Date(year, month - 1, day);
      return logDate.getTime();
    } else {
      return null;
    }
  })();

  if (!startingTime) {
    console.log("error reading log start time!")
  }

  let startOfCurrentLine = cursor;
  let startOfNextLine = null;

  const lineparserRegExp = /^\[(\d{2}:\d{2}:\d{2})\]\s{1,2}(?:(?!Uploading|Unrecognized)(?:[^:\s]+\s))?(\w+)(?::)\s(.+)\n$/;

  const cursorIsAtEOF = () => cursor >= log.length;
  const cursorIsAtNewline = () => log.charAt(cursor) === '\n';

  const parseTimestampString = (timestampString: string) => {
    const [hours, minutes, seconds] = timestampString.split(":").map(Number);
    return startingTime
      ? startingTime + (hours * 3600000) + (minutes * 60000) + (seconds * 1000)
      : 0;
  }

  const setUsernameLastSeen = (username: string, timestamp: number) => {
    if (timestamp) {
      usernameLastSeen[username] = usernameLastSeen[username] ? Math.max(usernameLastSeen[username], timestamp) : timestamp;
    }
  }

  const parseMessage = (timestamp: number, username: string, message: string) => {
    message.split(" ").forEach(word => {
      if (codes.has(word)) {
        setUsernameLastSeen(username, timestamp);
        emoteCounts[word].count++;
        if (emoteCounts[word].usedBy[username] === undefined) {
          emoteCounts[word].usedBy[username] = 1;
        } else {
          emoteCounts[word].usedBy[username]++;
        }
      }
    })
  }

  const parseLine = (line: string) => {
    const match = line.match(lineparserRegExp);
    if (match) {
      const [timestampString, username, message] = match.slice(1);
      const timestamp = parseTimestampString(timestampString);
      parseMessage(timestamp, username, message);
    }
  }

  const moveToStartOfNextLine = () => {
    while (!cursorIsAtEOF() && !cursorIsAtNewline()) {
      cursor++;
    }
    cursor++;
  }

  while (!cursorIsAtEOF()) {
    moveToStartOfNextLine();
    startOfNextLine = cursor;
    parseLine(log.slice(startOfCurrentLine, startOfNextLine));
    startOfCurrentLine = startOfNextLine;
    cursor = startOfCurrentLine;
  }

  return {
    usernameLastSeen,
    emoteCounts
  };
}