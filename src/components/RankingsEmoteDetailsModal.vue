<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="image is-32x32">
          <img :src="details.image" />
        </div>
        <p class="modal-card-title ml-3">Details for {{ details.code }}</p>
        <button class="delete" aria-label="close" @click="close()"></button>
      </header>
      <section class="modal-card-body">
        <div class="subheader">
          <span class="rank">#{{ details.rank }}</span> in
          {{ details.fromList }} Rankings
        </div>
        <div>
          <p class="subheader-usedinchannel">
            Used <span class="count">{{ details.count }}</span> times in
            <span class="channel">{{ channelName }}</span
            >'s channel.
          </p>
          <p class="subheader-mostusedby">
            Most used by
            <span class="username">{{ mostUsedBy[0].username }}</span> a total
            of <span class="count">{{ mostUsedBy[0].count }}</span> times!
          </p>
        </div>
      </section>
      <section class="modal-card-body mostusedby-wrapper">
        <div class="mostusedby-header">Top 10 Users</div>
        <ol class="mostusedby" type="none">
          <li
            v-for="(user, rank) in mostUsedBy.slice(0, 10)"
            :key="user.username"
            :class="
              rank < 3
                ? ['gold', 'silver', 'bronze'][rank]
                : ['lightgray', ''][rank % 2]
            "
          >
            <div class="mostusedby-rank-and-username">
              <span class="mostusedby-rank">{{ rank + 1 }}</span>
              <span class="mostusedby-username">{{ user.username }}</span>
            </div>
            <span class="mostusedby-count">{{ user.count }}</span>
          </li>
        </ol>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="close()">Close</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";

export default defineComponent({
  name: "RankingsEmoteDetailsModal",
  props: {},
  setup() {
    const store = useStore();

    const details = computed(() => {
      return store.state.emoteDetails;
    });

    const channelName = computed(() => {
      return store.state.channel.name;
    });

    const mostUsedBy = computed(() => {
      return Object.keys(store.state.emoteDetails.usedBy)
        .map((username) => {
          return {
            username: username.split("-")[0], // format of usernames is <name>-<twitchID>
            count: store.state.emoteDetails.usedBy[username],
          };
        })
        .sort((a, b) => b.count - a.count);
    });

    function close() {
      store.commit(MutationType.CloseEmoteDetailsModal, undefined);
    }

    return {
      details,
      channelName,
      mostUsedBy,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
.subheader {
  text-align: center;
  font-size: 1.3em;
  .rank {
    font-size: 1.5em;
    font-weight: bold;
    font-family: monospace;
    color: black;
  }
}

.subheader-usedinchannel {
  text-align: center;
  font-size: 1.2em;

  .count {
    font-size: 1.3em;
    font-weight: bold;
    font-family: monospace;
    color: black;
  }
  .channel {
    font-size: 1.3em;
    font-variant: small-caps;
    color: #111;
  }
}

.subheader-mostusedby {
  text-align: center;
  font-size: 1.1em;

  .username,
  .count {
    font-size: 1.2em;
    font-family: monospace;
    color: black;
    font-weight: bold;
  }
}

.rankings {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  font-variant: small-caps;
}

.mostusedby {
  width: 50%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  li {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
  }
}

.mostusedby-rank-and-username {
  display: flex;
  justify-content: space-between;
}

.mostusedby-rank {
  font-size: 1em;
  min-width: 1.5em;
  text-align: right;
  margin-right: 0.5em;
  font-weight: bold;
  color: black;
}

.mostusedby-username {
  color: black;
}

.mostusedby-count {
  color: black;
}

.mostusedby-header {
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  margin-bottom: 0.5em;
}

.gold,
.silver,
.bronze {
  font-weight: bold;
}

.gold {
  background-color: #af9500;
}
.silver {
  background-color: #d7d7d7;
}
.bronze {
  background-color: #ad8a56;
}
.lightgray {
  background-color: #eee;
}
</style>