<template>
  <div class="container box">
    <h2 class="header">Log In</h2>
    <form class="form" @submit.prevent="loginUser">
      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input id="username" v-model="login.username" type="text" class="input" aria-label="username" />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input id="password" v-model="login.password" type="password" class="input" aria-label="password" />
        </div>
      </div>
      <button class="button" type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios, { AxiosResponse } from 'axios';

export default defineComponent({
  name: 'AuthLogin',
  setup() {
    const router = useRouter();

    const login = reactive({
      username: '',
      password: ''
    })

    async function loginUser() {
      try {
        let response = await axios.post('http://localhost:8081/auth/login', { username: login.username, password: login.password }) as AxiosResponse;
        let token = response.data.data.token;

        localStorage.setItem("user", token);

        router.push("/admin")        
      } catch (error) {
        console.log(error.response)
      }
    }

    return {
      login,
      loginUser
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 50%;
}
.header {
  text-align: center;
  font-size: 2em;
  font-variant: small-caps;
  font-weight: bold;
}
.label {
  font-variant: small-caps;
  font-weight: bold;
}
</style>