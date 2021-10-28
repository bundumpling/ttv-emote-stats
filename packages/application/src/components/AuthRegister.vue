<template>
  <div
    class="
      my-4
      mx-auto
      p-2
      w-1/2
      bg-light-50
      border-4 border-gray-200
      rounded-lg
      list-none
      shadow-indigo-400 shadow-lg
    "
  >
    <h2
      class="
        p-2
        text-2xl text-center
        tracking-wide
        font-bold
        text-dark-100 text-shadow-sm
      "
    >
      Sign Up
    </h2>
    <form @submit.prevent="registerUser">
      <label class="px-1 text-md small-caps font-bold">Username</label>
      <input
        id="username"
        v-model="register.username"
        type="text"
        class="
          my-1
          max-w-full
          w-full
          p-2
          shadow-inner
          border-cool-gray-300 border-2
          rounded-md
        "
        aria-label="Username"
        required
      />
      <label class="px-1 text-md small-caps font-bold">Password</label>
      <input
        id="password"
        v-model="register.password"
        type="password"
        class="
          my-1
          max-w-full
          w-full
          p-2
          shadow-inner
          border-cool-gray-300 border-2
          rounded-md
        "
        aria-label="Password"
        required
      />
      <div class="mt-3 mb-2 flex justify-center align-baseline">
        <button
          class="
            bg-blue-500
            text-light-200
            tracking-wider
            px-4
            py-1
            border-2
            font-bold
            text-lg
            rounded-md
            shadow-md shadow-cyan-800
          "
          type="submit"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import axios, { AxiosResponse } from "axios";

export default defineComponent({
  name: "AuthRegister",
  setup() {
    const router = useRouter();

    const register = reactive({
      username: "",
      password: "",
    });

    async function registerUser() {
      try {
        let response = (await axios.post(
          "http://localhost:8081/auth/register",
          { username: register.username, password: register.password }
        )) as AxiosResponse;

        if (response) {
          console.log("User registration successful");
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
      }
    }

    return {
      register,
      registerUser,
    };
  },
});
</script>
