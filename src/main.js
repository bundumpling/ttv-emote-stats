import { createApp, h } from 'vue'
import { createStore } from 'vuex'
import routes from './routes'

import devtools from '@vue/devtools'

import NotFoundPage from './pages/NotFoundPage'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faDownload, faRedo, faChevronLeft, faChevronRight, faChartBar, faCogs, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faUpload, faDownload, faRedo, faChevronLeft, faChevronRight, faChartBar, faCogs, faEdit)

require('./assets/sass/main.scss');

const Router = {
  data: () => ({
    currentRoute: window.location.pathname
  }),
  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundPage
    }
  },
  render() {
    console.log(window.location.pathname)
    return h(this.CurrentComponent)
  }
}

const store = createStore({
  state() {
    return {
      channel: {
        name: 'bundumpling',
        twitchID: "472309577",
        emotes: []
      },
      providerAvailability: {
        'Twitch': true,
        'FFZ': true,
        'BTTV': true,
        '7TV': true
      },
      emoteGroupingMenuShowAll: true,
      emoteListPageNumbers: {
        "Overall": 0,
        "Twitch": 0,
        "FFZ": 0,
        "BTTV": 0,
        "7TV": 0
      },
      emotesPerPage: 10
    }
  },
  mutations: {
    setProviderAvailability(state, { provider, isAvailable }) {
      state.providerAvailability[provider] = isAvailable;
    },
    setEmoteGroupingMenuShowAll(state, showAll) {  
      state.emoteGroupingMenuShowAll = showAll
    },
    setEmotesPerPage(state, emotesPerPage) {
      state.emotesPerPage = Number(emotesPerPage);
      for (let emoteListType in state.emoteListPageNumbers) {
        state.emoteListPageNumbers[emoteListType] = 0;
      }
    },
    nextPage(state, emoteListType) {
      state.emoteListPageNumbers[emoteListType]++;
    },
    prevPage(state, emoteListType) {
      state.emoteListPageNumbers[emoteListType]--;
    },
    updateEmotes(state, emotes) {
      state.channel.emotes = emotes;
    },
    randomizeCounts(state) {
      state.channel.emotes = state.channel.emotes.map(e => {
        e.count = Math.floor(Math.random() * 10000)
      return e;
      })
    },
    zeroCounts(state) {
      state.channel.emotes = state.channel.emotes.map(e => {
        e.count = 0;
        return e
      })
    },
    setChannelNameAndID(state, { username, twitchID }) {
      if (!username && !twitchID) {
        console.error("setChannelNameAndID requires either a username or a twitchID");
        return;
      }
      const paramsString = username ? "login="+username : "id="+twitchID;
      const URL = `http://localhost:8081/twitch/users?${paramsString}`;
      const options = {
        method: 'GET'
      };
      fetch(URL, options).then(res => res.json()).then(json => {
        console.log(json);
        state.channel = {
          ...state.channel,
          name: json.login,
          twitchID: json.id
        }
        
      for (let emoteListType in state.emoteListPageNumbers) {
        state.emoteListPageNumbers[emoteListType] = 0;
      }
      });
    },
    parseLog(state, log) {
      let resultsMap = new Map(state.channel.emotes.map((e, i) => [e.name, { index: i, count:0 }]));
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
          state.channel.emotes[v.index].count += v.count;
        }
      })
    }
  }
})

createApp(Router).component("font-awesome-icon", FontAwesomeIcon).use(store).use(devtools).mount('#app')
