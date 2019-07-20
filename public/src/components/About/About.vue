<template>
  <div class="container">
    <img class="login-logo" src="../../assets/logo_square.svg" alt="logo">
    <div class="story" v-if="altMessages && altMessages.altDescription">{{altMessages.altDescription}}</div>
    <ul class="setting-icons">
      <li><a href="https://www.facebook.com/ALT-Balaji-1630266057255863/" target="_blank"><img class="icons" src="../../assets/fb.svg"></a></li>
      <li><a href="https://www.instagram.com/altbalaji/" target="_blank"><img class="icons" src="../../assets/ig.svg"></a></li>
      <li><a href="https://plus.google.com/105348919284515780332" target="_blank"><img class="icons" src="../../assets/gp.svg"></a></li>
      <li><a href="https://twitter.com/altbalaji" target="_blank"><img class="icons" src="../../assets/tw.svg"></a></li>
      <li><a href="https://www.youtube.com/channel/UCw82_BrKru_CjqIuTzf04Kw" target="_blank"><img class="icons" src="../../assets/yt.svg"></a></li>
    </ul>
    <div class="clearfix"></div>
    <h3 class="conditons about_underline">
      <router-link :to="{ name: 'toc' }" style="color: #FFFFFF;">Terms of Use</router-link>
    </h3>
    <h3 class="policy about_underline">
      <router-link :to="{ name: 'privacyPolicy' }" style="color: #FFFFFF;">Privacy Policy</router-link>
    </h3>

    <h6 class="conditons" v-if="appVersionName && appVersionCode">Version {{appVersionName}}.{{appVersionCode}}</h6>
    <h6 class="conditons">Copyright @ {{new Date().getFullYear()}} ALTBalaji. All rights reserved</h6>
  </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'appVersionName',
      'appVersionCode',
      'altMessages',
    ]),
  },
  methods: {
    setPageHeader() {
      // Method defined in mixins.js file. Used to set the page title.
      this.setHeaderTitle('About');

      this.toggleSearchIco(false);
      this.toggleDeleteIco(false);
      this.toggleCloseIco(false);
    }
  },
  mounted() {
    // Set the page title on page mounted.
    this.setPageHeader();
    // Hide the App Loader
    this.toggleLoader(false);
  },
  mixins: [altMixins]
}
</script>
