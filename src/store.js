// import Vue from 'vue';
import { seedData } from './seed.js';

export const store = {
  state: {
    seedData: seedData.map(e => {
      e.count = Math.floor(Math.random() * 10000)
      return e;
    })
  },
}