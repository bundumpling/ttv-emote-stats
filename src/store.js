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
  }
}