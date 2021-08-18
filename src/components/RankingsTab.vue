<template>
  <li :class="isActive ? 'is-active' : ''">
    <a @click="setActiveTab(tabName)">{{ tabName }} </a>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store";
import { MutationType } from "../store/mutations";

export default defineComponent({
  name: "RankingsTab",
  props: {
    tabName: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const store = useStore();

    const isActive = computed(() => {
      return store.state.rankings.activeTab === props.tabName;
    });

    function setActiveTab(tabName: string | undefined) {
      store.commit(MutationType.SetActiveTab, tabName || "");
    }

    return {
      isActive,
      setActiveTab,
    };
  },
});
</script>