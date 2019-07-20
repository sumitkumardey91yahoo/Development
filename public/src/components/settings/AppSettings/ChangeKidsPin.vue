<template>
  <div class="tab-wrapper">
    <div class="tab-sec" @click="changeKidsmodePinCB">
      <h4>Parental control - Kids mode</h4>
      <p>
        Change kids mode PIN
        <span><img src="src/assets/right.svg"></span>
      </p>
    </div>

    <ChangePasscode v-if="isShowPinPopup" />
  </div>
</template>

<script>
import { eventBus } from '@/main';
const ChangePasscode = () => import (/* webpackChunkName: "Settings-ChangeKidsPin" */ '@/components/settings/ChangePasscode.vue');

export default {
  name: 'AppSettingsChngKidsPin',
  data () {
    return {
      isShowPinPopup: false
    }
  },
  components: {
    ChangePasscode
  },
  created () {
    // Listen to the event coming from 'ChangePasscode' component when the popup is getting closed
    eventBus.$on('closeKidsPasscodeEvent', this.togglePopup);
  },
  methods: {
    changeKidsmodePinCB () {
      // Show the popup
      this.togglePopup(true);
    },
    togglePopup (state) {
      this.isShowPinPopup = state;
    }
  },
  beforeDestroy () {
    eventBus.$off('closeKidsPasscodeEvent', this.togglePopup);
  }
}
</script>

<style lang="css">
</style>
