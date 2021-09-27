<template>
  <div class="container box">
    <h2 class="header">Sign Up</h2>
    <form class="form" @submit.prevent="registerUser">
      <div class="field">
        <label class="label">Username</label>
        <input
          type="text"
          id="username"
          class="input"
          aria-label="Username"
          v-model="register.username"
          required
        />
      </div>
      <div class="field">
        <label class="label">Password</label>
        <input
          type="password"
          id="password"
          class="input"
          aria-label="Password"
          v-model="register.password"
          required
        />
      </div>
      <button class="button" type="submit">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios, { AxiosResponse } from 'axios';

export default defineComponent({
  name: "AuthRegister",
  setup() {
    const router = useRouter();

    const register = reactive({
      username: "",
      password: ""
    })

    async function registerUser() {
      try {
        let response = await axios.post("http://localhost:8081/auth/register", { username: register.username, password: register.password }) as AxiosResponse;
        
        if (response) {
          console.log("User registration successful")
          router.push("/login");
        }
      } catch (error) {
        console.log(error.response);
      }
    }

    return {
      register,
      registerUser
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