<template>
  <div class="container">
    <div class="spinner">
      <font-awesome-icon icon="spinner" class="spinner" />
    </div>
  </div>
</template>

<script>
export default {
  name: "TheLoadingSpinner",
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  font-size: 3em;
  animation-name: spin;
  animation-duration: 2000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
