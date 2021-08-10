import { seedData } from './seed.js';
import { reactive } from 'vue';
import randomizeEmoteCounts from '../utils/randomizeEmoteCounts';
import zeroCounts from '../utils/zeroCounts';

export const store = {
  state: reactive({
    channel: {
      name: 'bundumpling',
      twitchID: "472309577",
      hasEmotesFrom: ['Twitch', 'BTTV', 'FFZ']
    },
    seedData: zeroCounts(seedData),
    emoteGroupingMenuShowAll: true,
  }),
  setEmoteGroupingMenuShowAll(showAll) {  
    this.state.emoteGroupingMenuShowAll = showAll
  },
  randomizeCounts() {
    this.state.seedData = randomizeEmoteCounts(this.state.seedData)
  },
  zeroCounts() {
    this.state.seedData = zeroCounts(this.state.seedData)
  },
  async setChannelNameAndID(paramsObj) {
    const { name, twitchID } = paramsObj;
    if (!name && !twitchID) {
      console.error("setChannelNameAndID requires either a name or a twitchID");
      return;
    }
    const paramsString = name ? "login="+name : "id="+twitchID;
    const URL = `https://api.twitch.tv/helix/users?${paramsString}`;
    const options = {
      method: "GET",
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": process.env.TWITCH_AUTH_TOKEN
      }
    }
    return fetch(URL, options).then(res => {
      if (res.status !== 200) {
        console.log("Error fetching user data from Twitch API");
      } else {
        return res.json();
      }
    }).then(json => {
      this.state.channel.name = json.data.name;
      this.state.channel.twitchID = json.data.id;
    });
  },
  parseLog(log) {
    let resultsMap = new Map(seedData.map((e, i) => [e.name, { index: i, count:0 }]));
    let cursor = 0;
    let word = "";
    while (cursor < log.length) {
      if (/\s/.test(log[cursor])) {
        if (resultsMap.has(word)) {
          let mapEntry = resultsMap.get(word);
          mapEntry.count++;
          resultsMap.set(word, resultsMap.get(word))
        }
        word = "";
      } else {
        word += log[cursor];
      }
      cursor++;
    }
    resultsMap.forEach((v) => {
      if (v) {
        this.state.seedData[v.index].count += v.count;
      }
    })
  }
}