<template>
  <div class="topbar">
    <div v-if="username" class="status">
      Logged in as <span class="username">{{ username }}</span>
    </div>
    <div class="logout">
      <button class="button is-small" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
//@ts-expect-error
import VueJwtDecode from 'vue-jwt-decode'; // No Type Definitions Available

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
        console.log(error, "error decoding token")
        return null
      }
    })

    function logout() {
      localStorage.removeItem("user");
      router.push("/login");
    }
    
    return {
      username,
      logout
    }
  }
})
</script>

<style lang="scss">
.topbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-width: 4px 0px;
  border-style: solid;
  border-color: #666;
  background-color: #CCC;
}
.status {
  padding-left: 4px;
  font-size: 1.2em;
  font-family: monospace;
  font-variant: small-caps;
  color: #222;
}

.username {
  font-weight: bold;
  color: black;
}

.logout {
  button {
    background-color: #666;
    color: #EEE;
    font-weight: bold;
    font-family: monospace;
    border-color: black;
  }
  button:hover {
    background-color: #333;
    color: rgb(223, 62, 62);
    border-color: black;
  }
}
</style>