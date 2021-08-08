import { seedData } from './seed.js';
import { reactive } from 'vue';
import randomizeEmoteCounts from '../utils/randomizeEmoteCounts';
import zeroCounts from '../utils/zeroCounts';

export const store = {
  state: reactive({
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