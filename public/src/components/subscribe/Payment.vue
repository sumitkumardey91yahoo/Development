<template>
  <div class="alt-help">
    <router-view></router-view>
    <alt-modals></alt-modals>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';

const Modals = () => import (/* webpackChunkName: "subscribe-Credit-Modals" */ '../shared/Modals.vue');

export default {
  methods: {
    setSubscribePageHeader() {
      this.setHeaderTitle('subscribe');
      this.toggleSearchIco(false);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);

      if (document.getElementById('alt-app')) {
        let altApp = document.getElementById('alt-app');
        altApp.style.position = 'relative';
      }
    },
  },
  components: {
    'alt-modals': Modals,
  },
  mounted() {
     this.setSubscribePageHeader();
  },
  beforeRouteEnter: (to, from, next) => {
    if (JSON.parse(localStorage.getItem('altUser'))) {
      next();
    } else {
      next({ name: 'home' });
    }
  },
  beforeDestroy() {
    eventBus.$off('togglePopupConfirmPayment');
  },
  mixins: [altMixins]
}
</script>
