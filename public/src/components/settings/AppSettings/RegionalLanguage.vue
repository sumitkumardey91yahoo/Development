<template>
  <div class="tab-wrapper">
    <div class="tab-sec" @click="languageChangeCB">
      <h4>Preferred Regional Language</h4>
      <p>
        {{ language }}
        <span><img src="src/assets/right.svg"></span>
      </p>
    </div>

    <PopupRegLangugae
      v-if="isShowRegLanguagePopup"
      :hidepopupEvent="hidePopup"
      @languageChanged="languageChangedCB" />
  </div>
</template>

<script>
import { eventBus } from '@/main';
const PopupRegLangugae = () => import(/* webpackChunkName: "PopupVideoBlockRowFav" */ '@/components/shared/PopupRegLanguage.vue');

export default {
  name: 'AppSettingsRegLang',
  data () {
    return {
      language: null,
      isShowRegLanguagePopup: false
    }
  },
  components: {
    PopupRegLangugae
  },
  created () {
    this.getLanguage();
  },
  methods: {
    getLanguage () {
      if (localStorage.getItem('pref_language_data')) {
        let data = JSON.parse(
          localStorage.getItem('pref_language_data')
        );

        this.language = data.language ? data.language : 'None';
      } else {
        this.language = 'None';
      }
    },
    languageChangeCB () {
      this.togglePopup(true);
    },
    togglePopup (state) {
      this.isShowRegLanguagePopup = state;
    },
    hidePopup () {
      this.togglePopup(false);
    },
    languageChangedCB (language) {
      this.language = language;
    }
  }
}
</script>

<style lang="css">
</style>
