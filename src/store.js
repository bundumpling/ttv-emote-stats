import { seedData } from './seed.js';
import { reactive } from 'vue';

export const store = {
  state: reactive({
    seedData: seedData.map(e => {
      e.count = Math.floor(Math.random() * 10000)
      return e;
    }),
    emoteGroupingMenuShowAll: true,
  }),
  setEmoteGroupingMenuShowAll(showAll) {  
    this.state.emoteGroupingMenuShowAll = showAll
  }
}