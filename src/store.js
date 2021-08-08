import { seedData } from './seed.js';
import { reactive } from 'vue';
import randomizeEmoteCounts from '../utils/randomizeEmoteCounts';

export const store = {
  state: reactive({
    seedData: randomizeEmoteCounts(seedData),
    emoteGroupingMenuShowAll: true,
  }),
  setEmoteGroupingMenuShowAll(showAll) {  
    this.state.emoteGroupingMenuShowAll = showAll
  },
  randomizeCounts() {
    this.state.seedData = randomizeEmoteCounts(this.state.seedData)
  },
  parseLog(log) {
    let resultsMap = new Map(seedData.map(e => [e.name, 0]));
    let cursor = 0;
    let word = "";
    while (cursor < log.length) {
      if (/\s/.test(log[cursor])) {
        if (resultsMap.has(word)) {
          resultsMap.set(word, resultsMap.get(word) + 1)
        }
        word = "";
      } else {
        word += log[cursor];
      }
      cursor++;
    }
    resultsMap.forEach((v, k) => {
      if (v) {
        console.log(`${k}: ${v}`)
      }
    })
  }
}