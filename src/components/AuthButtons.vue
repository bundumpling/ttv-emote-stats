<template>
<div v-if="!$auth.loading.value">
    <button v-if="!$auth.isAuthenticated.value" @click="login">Log in</button>
    <button v-if="$auth.isAuthenticated.value" @click="logout">Log out</button>
  </div>
</template>

<script>
export default {
  name: "AuthButtons",
  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
}
</script>