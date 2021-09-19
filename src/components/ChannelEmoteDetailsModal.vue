<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="image is-32x32">
          <img :src="details.image" />
        </div>
        <p class="modal-card-title ml-3">Details for {{ details.code }}</p>
        <span class="close" aria-label="close" @click="close()"
          ><font-awesome-icon icon="window-close"
        /></span>
      </header>
      <section class="modal-card-body">
        <div class="subheader">
          <span class="rank">#{{ details.rank }}</span> in
          {{ details.fromList }} Emotes
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
        <div class="mostusedby-header">
          <span
            class="pagePrevious"
            :class="hasPrevPage ? 'is-clickable' : 'hidden'"
            @click="hasPrevPage ? prevPage() : null"
          >
            <font-awesome-icon icon="chevron-left" />
          </span>
          <h2>Top Users</h2>
          <span
            class="pageNext"
            :class="hasNextPage ? 'is-clickable' : 'hidden'"
            @click="hasNextPage ? nextPage() : null"
          >
            <font-awesome-icon icon="chevron-right" />
          </span>
        </div>
        <ol class="mostusedby" type="none">
          <li
            v-for="(user, rank) in mostUsedBy.slice(page * 10, (page + 1) * 10)"
            :key="user.username"
            :class="
              page === 0 && rank < 3
                ? ['gold', 'silver', 'bronze'][rank]
                : ['lightgray', ''][rank % 2]
            "
          >
            <div class="mostusedby-rank-and-username">
              <span class="mostusedby-rank">{{ page * 10 + rank + 1 }}</span>
              <span class="mostusedby-username">{{ user.username }}</span>
            </div>
            <span class="mostusedby-count">{{ user.count }}</span>
          </li>
        </ol>
      </section>
      <footer class="modal-card-foot"></footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";

export default defineComponent({
  name: "ChannelEmoteDetailsModal",
  props: {},
  setup() {
    const store = useStore();

    const page = ref(0);

    const details = computed(() => {
      return store.state.channel.emoteDetails;
    });

    const channelName = computed(() => {
      return store.state.channel.name;
    });

    const mostUsedBy = computed(() => {
      return Object.keys(store.state.channel.emoteDetails.usedBy)
        .map((username) => {
          return {
            username: username.split("-")[0], // format of usernames is <name>-<twitchID>
            count: store.state.channel.emoteDetails.usedBy[username],
          };
        })
        .sort((a, b) => b.count - a.count);
    });

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(
      () => (page.value + 1) * 10 < mostUsedBy.value.length
    );

    function prevPage() {
      page.value--;
    }
    function nextPage() {
      page.value++;
    }

    function close() {
      store.commit(MutationType.CloseEmoteDetailsModal, undefined);
    }

    return {
      details,
      channelName,
      mostUsedBy,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
.close {
  font-size: 2em;
  color: maroon;
  cursor: pointer;
}

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
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  text-align: center;
  font-weight: bold;
  font-size: 1.3em;
  margin: 0 auto;
  margin-bottom: 0.5em;

  h2 {
    font-weight: bold;
    font-size: 1.1em;
    font-variant: small-caps;
    user-select: none;
  }
}

.hidden {
  visibility: hidden;
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