<template>
  <SearchInput inject="userSearch" />
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
  <div
    v-if="userSearchInput.length && !mostUsedByFiltered.length"
    class="mostusedby-noresults"
  >
    No Results
  </div>
  <ol v-else class="mostusedby" type="none">
    <li
      v-for="user in (userSearchInput.length
        ? mostUsedByFiltered
        : mostUsedBy
      ).slice(page * 10, (page + 1) * 10)"
      :key="user.username"
      :class="
        page === 0 && user.rank < 3
          ? ['gold', 'silver', 'bronze'][user.rank]
          : ['lightgray', ''][user.rank % 2]
      "
    >
      <div class="mostusedby-rank-and-username">
        <span class="mostusedby-rank">{{ page * 10 + user.rank + 1 }}</span>
        <span class="mostusedby-username">{{ user.username }}</span>
      </div>
      <span class="mostusedby-count">{{ user.count }}</span>
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";
import SearchInput from "./SearchInput.vue";

export default defineComponent({
  name: "EmoteUsedByList",
  components: {
    SearchInput,
  },
  props: {
    mostUsedBy: {
      type: Object as PropType<{ [key: string]: number }>,
      default: Object.assign({}),
    },
    userSearchInput: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const page = ref(0);

    const mostUsedByFiltered = computed(() => {
      return props.mostUsedBy.filter(({ username }) => {
        return username.includes(props.userSearchInput);
      });
    });

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(
      () =>
        (page.value + 1) * 10 <
        (props.userSearchInput.length
          ? mostUsedByFiltered.value.length
          : props.mostUsedBy.length)
    );

    function prevPage() {
      page.value--;
    }
    function nextPage() {
      page.value++;
    }

    return {
      mostUsedByFiltered,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  },
});
</script>

<style lang="scss" scoped>
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

  .date {
    font-size: 1em;
    font-weight: bold;
    color: black;
  }
}

.rankings {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  font-variant: small-caps;
}

.mostusedby-noresults {
  min-height: 238px;
  text-align: center;
  color: maroon;
  font-size: 1.5em;
  font-variant: small-caps;
}

.mostusedby {
  min-height: 238px;
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
