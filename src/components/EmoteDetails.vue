<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="image is-32x32">
          <img :src="details.image" />
        </div>

        <p class="modal-card-title ml-3">Details for {{ details.name }}</p>
        <button class="delete" aria-label="close" @click="close()"></button>
      </header>
      <section class="modal-card-body">
        <div class="subheader">
          #{{ details.rank }} in {{ details.fromList }} Rankings
        </div>
        <div>
          <p>Used {{ details.count }} times in {{ channelName }}'s channel.</p>
          <p>
            Most used by {{ mostUsedBy.username }} a total of
            {{ mostUsedBy.count }} times!
          </p>
        </div>
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
  name: "EmoteDetails",
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
      let max = { username: "", count: 0 };
      Object.keys(store.state.emoteDetails.usedBy).forEach((key) => {
        if (store.state.emoteDetails.usedBy[key] > max.count) {
          max = { username: key, count: store.state.emoteDetails.usedBy[key] };
        }
      });
      return max;
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

<style scoped>
</style>