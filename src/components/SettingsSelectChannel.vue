<template>
  <div class="settings-select-channel-wrapper">
    <div class="channel">
      Emotes for <span class="channel-name">{{ getName }}</span>
      <span class="channel-twitchid">[TwitchID: {{ getID }}]</span>
      <font-awesome-icon class="icon" icon="edit" @click="openModal()" />
    </div>
  </div>
  <SettingsSelectChannelModal v-if="modalIsActive" :closeModal="closeModal" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "../store";
import SettingsSelectChannelModal from "./SettingsSelectChannelModal.vue";

export default defineComponent({
  name: "SettingsSelectChannel",
  components: {
    SettingsSelectChannelModal,
  },
  setup() {
    const store = useStore();

    const modalIsActive = ref(false);

    const getName = computed(() => {
      return store.state.channel.name;
    });
    const getID = computed(() => {
      return store.state.channel.twitchID;
    });

    function openModal(this: any) {
      modalIsActive.value = true;
      this.$nextTick(() => {
        const element = document.getElementById(
          "settings-select-channel-input"
        );
        if (element) {
          element.focus();
        }
      });
    }

    function closeModal() {
      modalIsActive.value = false;
    }

    return {
      modalIsActive,
      getName,
      getID,
      openModal,
      closeModal,
    };
  },
});
</script>

<style scoped>
.settings-select-channel-wrapper {
  display: flex;
  justify-content: center;
  align-items: baseline;
}

.channel {
  font-size: 1.5em;
  font-family: monospace;
}

.channel-name {
  color: #111;
  font-weight: bold;
}

.channel-twitchid {
  color: #555;
  font-variant: small-caps;
  font-size: 0.8em;
  padding: 0 0.5em;
}

.icon {
  color: darkblue;
  margin-right: 0.15em;
  cursor: pointer;
}
</style>