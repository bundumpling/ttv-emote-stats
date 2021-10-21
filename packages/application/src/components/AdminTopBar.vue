<template>
  <div
    class="
      my-2
      flex
      justify-between
      items-baseline
      border-t-2 border-b-2 border-cool-gray-500
      bg-cool-gray-100
      text-lg
      font-mono
      small-caps
      tracking-wide
    "
  >
    <div v-if="username" class="px-2">
      Logged in as
      <span class="font-bold">{{ username }}</span>
    </div>
    <button
      class="
        px-2
        font-bold
        tracking-wider
        border-l-2 border-cool-gray-500
        bg-cool-gray-300
        hover:bg-cool-gray-500 hover:text-cool-gray-200
      "
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
//@ts-expect-error No Type Definitions Available
import VueJwtDecode from "vue-jwt-decode";

export default defineComponent({
  name: "AdminTopBar",
  setup() {
    const router = useRouter();

    const username = computed(() => {
      let token = localStorage.getItem("user");
      try {
        let decoded = VueJwtDecode.decode(token);
        return decoded.username;
      } catch (error) {
        console.log(error, "error decoding token");
        return null;
      }
    });

    function logout() {
      localStorage.removeItem("user");
      router.push("/login");
    }

    return {
      username,
      logout,
    };
  },
});
</script>
