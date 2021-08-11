<template>
  <div :class="'modal ' + (isActive ? 'is-active' : '')">
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Change Channel</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeModal()"
        ></button>
      </header>
      <section class="modal-card-body">
        <input
          id="settings-select-channel-input"
          class="input"
          type="text"
          aria-label="channel input"
        />
        <div class="control">
          <label for="nameOrTwitchID" class="radio">
            <input
              type="radio"
              name="nameOrTwitchID"
              aria-label="radio butto for name or Twitch ID #"
              value="Name"
              checked
            />Name
          </label>
          <label class="radio">
            <input
              type="radio"
              name="nameOrTwitchID"
              aria-label="radio butto for name or Twitch ID #"
              value="Twitch ID #"
            />Twitch ID #
          </label>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Save</button>
        <button class="button" @click="closeModal()">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsSelectChannelModal",
  props: {
    isActive: Boolean,
    closeModal: Function,
  },
};
</script>

<style>
</style>