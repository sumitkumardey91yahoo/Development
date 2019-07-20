<template>
  <div class="alt-home">
    <HomeNav></HomeNav>
    <div class="container">
      <HomeFeatured />
      <HomeGrid />
    </div>

    <KidsPlayer v-show="togglePlayer"></KidsPlayer>
  </div>
</template>

<script>
import HomeNav from '@/components/home/HomeNav.vue';
import { eventBus } from '@/main';
const HomeFeatured = () => import (
  /* webpackChunkName: "Kids-HomeFeatured" */
  '@/components/home/HomeFeatured.vue'
);
const HomeGrid = () => import (
  /* webpackChunkName: "Kids-HomeGrid */
  '@/components/home/HomeGrid.vue'
);
const KidsPlayer = () => import (
  /* webpackChunkName: "Kids-KidsPlayer */
  '@/components/player/KidsPlayer.vue'
);

// const PlayerScreen = () => import (
//   /* webpackChunkName: "Kids-PlayerScreen */
//   '@/components/player/PlayerScreen.vue'
// );

export default {
  data () {
    return {
      togglePlayer: false
    }
  },
  components: {
    HomeNav,
    HomeFeatured,
    HomeGrid,
    KidsPlayer
  },
  created () {
    eventBus.$on('toggleSendDataToPlayerScreen', this.togglePlayerScreenCB);
    eventBus.$on('togglePlayerScreenEvent', this.togglePlayerScreenCB);
  },
  methods: {
    togglePlayerScreenCB (state) {
      this.togglePlayer = state;
    }
  },
  beforeDestroy () {
    eventBus.$off('toggleSendDataToPlayerScreen', this.togglePlayerScreenCB);
    eventBus.$off('togglePlayerScreenEvent', this.togglePlayerScreenCB);
  }
}
</script>

<style lang="css">
</style>
