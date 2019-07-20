<template>
  <div class="container">
    <div class="settings-tab">
      <RegionalLanguage v-if="isShowRegLanguage" />
      <!-- <ChangeKidsPin v-if="isShowChangeKidsPin" /> -->
    </div>
  </div>
</template>

<script>
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import RegionalLanguage from '@/components/settings/AppSettings/RegionalLanguage.vue';
import ChangeKidsPin from '@/components/settings/AppSettings/ChangeKidsPin.vue';

export default {
  name: 'AppSettings',
  data () {
    return {
      isShowChangeKidsPin: false,
      isShowRegLanguage: false
    }
  },
  computed: {
    ...mapGetters([
      'altProfiles'
    ])
  },
  created () {
    this.assertChangeKidsPinView();
    this.assertRegLanguageView();
  },
  mounted() {
    // Hide the App Loader. Method defined in Mixins.js
    this.toggleLoader(false);
  },
  components: {
    RegionalLanguage,
    ChangeKidsPin
  },
  methods: {
    ...mapMutations([
      'setAltProfiles'
    ]),
    ...mapActions([
      'actCheckWithAccount'
    ]),
    assertChangeKidsPinView () {
      // Checking 'isShowChangeKidsPin'

      // NOTE: CODE CHANGE @SANGEETH - PWA-187 App Setting page is not in correct order
      if (localStorage.getItem('altUser')) {
        let altUser = JSON.parse(localStorage.getItem('altUser'));

        this.actCheckWithAccount(altUser).then(response => {
          // Mutation defined in profile.js. Stores the profile data to -
          // the store
          this.setAltProfiles(response);

          this.isShowChangeKidsPin = (response.count && response.count > 1);
        }).catch(error => {

        })
      }
      // NOTE: CODE CHANGE @SANGEETH - PWA-187 App Setting page is not in correct order

      // NOTE: CODE COMMENTED @SANGEETH - PWA-187 App Setting page is not in correct order.
      // CODE SHOULD BE REMOVED ONCE THE ISSUE PWA-187 IS RESOLVED
      // if (localStorage.getItem('altOrder')) {
      //   // Checking the order status
      //   let altOrder = JSON.parse(localStorage.getItem('altOrder'));
      //
      //   this.isShowChangeKidsPin = (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired === false && this.altProfiles && this.altProfiles.count > 1);
      // }
      // NOTE: CODE COMMENTED @SANGEETH - PWA-187 App Setting page is not in correct order
    },
    assertRegLanguageView () {
      if (localStorage.getItem('altConfig')) {
        let altConfig = JSON.parse(localStorage.getItem('altConfig'));

        this.isShowRegLanguage = altConfig && altConfig.regional && altConfig.regional.published
      }
    }
  },
  mixins: [altMixins]
}
</script>

<style lang="css">
.settings-tab .tab-sec {
    padding: 20px 0;
    border-bottom: 1px solid #747474;
    font-size: 16px;
}
.tab-sec span {
  float: right;
}
.tab-sec img {
    width: 8px;
}
.tab-sec p {
    margin: 0;
    margin-top: 15px;
}
</style>
