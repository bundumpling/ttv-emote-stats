<template>
  <SearchInput inject="userSearch" />
  <div
    class="
      w-1/2
      flex
      justify-between
      items-baseline
      text-center
      font-bold
      text-xl
      mx-auto
      m-3
    "
  >
    <div
      :class="hasPrevPage ? 'cursor-pointer' : 'invisible'"
      @click="hasPrevPage ? prevPage() : null"
    >
      <font-awesome-icon icon="chevron-left" />
    </div>
    <h2>Top Users</h2>
    <div
      :class="hasNextPage ? 'cursor-pointer' : 'invisible'"
      @click="hasNextPage ? nextPage() : null"
    >
      <font-awesome-icon icon="chevron-right" />
    </div>
  </div>
  <div
    v-if="userSearchInput.length && !mostUsedByFiltered.length"
    class="min-h-60 text-center text-rose-900 small-caps text-xl"
  >
    No Results
  </div>
  <ol
    v-else
    class="min-h-60 w-1/2 mx-auto flex flex-col items-stretch list-none"
  >
    <li
      v-for="user in (userSearchInput.length
        ? mostUsedByFiltered ?? []
        : mostUsedBy ?? []
      ).slice(page * 10, (page + 1) * 10)"
      :key="user.username"
      class="flex justify-between font-mono"
      :class="
        page === 0 && user.rank < 3
          ? `${
              ['bg-yellow-500', 'bg-cool-gray-400', 'bg-yellow-700'][user.rank]
            } font-bold bg-opacity-80`
          : ['bg-cool-gray-200', ''][user.rank % 2]
      "
    >
      <div class="flex justify-between">
        <span class="min-w-6 text-right mr-2 font-bold text-dark-700 font-lg">{{
          page * 10 + user.rank + 1
        }}</span>
        <span class="text-dark-500">{{ user.username }}</span>
      </div>
      <span class="text-dark-700 tracking-wide">{{ user.count }}</span>
    </li>
  </ol>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from "vue";
import SearchInput from "./SearchInput.vue";

export default defineComponent({
  name: "EmoteUsedByList",
  components: {
    SearchInput,
  },
  props: {
    mostUsedBy: {
      type: Object as PropType<
        {
          username: string;
          count: number;
          rank: number;
        }[]
      >,
      default: Object.assign({}),
    },
    userSearchInput: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const page = ref(0);

    watch(
      () => props.userSearchInput,
      () => (page.value = 0)
    );

    const mostUsedByFiltered = computed(() => {
      if (props.mostUsedBy && props.mostUsedBy.length) {
        return props.mostUsedBy.filter(({ username }) => {
          return username.includes(props.userSearchInput);
        });
      }
      return [];
    });

    const hasPrevPage = computed(() => page.value > 0);
    const hasNextPage = computed(
      () =>
        (page.value + 1) * 10 <
        (props.userSearchInput.length
          ? mostUsedByFiltered.value.length
          : props.mostUsedBy
          ? props.mostUsedBy.length
          : 0)
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
