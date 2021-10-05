import { LogParserEmoteCounts } from "../types";
async function buildResultsObjectFromEmoteArray(emotes: string[]): Promise<LogParserEmoteCounts> {
  const emoteCounts = <LogParserEmoteCounts>{}
  emotes.forEach((emote: string) => {
    emoteCounts[emote] = {
      count: 0,
      usedBy: {},
      usedOn: {}
    }
  })
  return emoteCounts;
}
export default async function logParser(log: string, emotes: string[]) {
  const emoteCounts: LogParserEmoteCounts = await buildResultsObjectFromEmoteArray(emotes);
  const emoteSet = new Set(emotes);

  interface IUsernameLastSeen {
    [key: string]: number;
  }
  const usernameLastSeen: IUsernameLastSeen = {};

  let cursor = log.indexOf('\n') + 1; // get to the first line;

  const [logDate, startingTime] = (() => {
    // First line of the log needs to be in the format:
    // # Start logging at 2020-12-10 11:28:54 Eastern Standard Time

    const firstLogLine = log.slice(0, cursor);
    const match = firstLogLine.match(/^#.+(\d{4})-(\d{2})-(\d{2}).+\n$/);
    if (match) {
      const logDate = Number(match.slice(1).join(""));
      const [year, month, day] = match.slice(1).map(Number);
      const startingTime = new Date(year, month - 1, day).getTime();
      return [logDate, startingTime];
    } else {
      return [null, null];
    }
  })();

  if (!logDate || !startingTime) {
    console.log("error reading log date or start time!")
    return null;
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
      if (emoteSet.has(word)) {
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
    logDate,
    usernameLastSeen,
    emoteCounts
  };
}