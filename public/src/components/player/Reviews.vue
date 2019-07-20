<template>
  <div class="container">
    <div class="reviews">
      <div class="mvi-data" v-for="(item, index) in reviews" @click="goTo(item)" :key="index">
          <div class="mvi-img-deatils">
            <img v-if="item.thumbnail" :src="item.thumbnail">
            <img v-else src="../../assets/alt-cover.jpg" alt="">
          </div>
          <div class="mvi-details">
            <p class="desc" v-if="item.title">
              <b>{{shortString(item.title, 35)}}</b>
            </p>
            <span class="grey source">via {{item.source}} - {{item.date}}</span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { altMixins } from '../../mixins';
export default {
  data() {
    return {
      reviews: null,
      plrContent: null
    };
  },
  computed: {
    ...mapGetters([
      'playerContent',
    ]),
  },
  methods: {
    ...mapActions([
      "actGetReviews"
    ]),
    goTo(item) {
      if (window.mobileAnalyticsClient) {
        var eventAttributeObj = this.getAWSMACommonAttributes();

        eventAttributeObj.content_id = this.$route.params.id;
        eventAttributeObj.content_title = this.$route.params.title.toLowerCase();
        eventAttributeObj.content_url = location.href;
        eventAttributeObj.content_type = this.$route.params.type;
        eventAttributeObj.content_source = 'show_detail_user_review';
        eventAttributeObj.event_source = 'show_detail_user_review';

        window.mobileAnalyticsClient.recordEvent( '_content.view', eventAttributeObj, {});
      }
      location.href = item.link;
    },
    fetchReviews() {
      this.actGetReviews().then(response => {
        for (let rev of response.user_reviews) {
          if (rev.media_id === Number(this.$route.params.id)) {
            this.reviews = rev.reviews;
          }
        }
      }, error => {
        // console.log('f error | ]', error);
      });
    }
  },
  created() {
    this.plrContent = this.playerContent;
    this.fetchReviews();
    this.toggleSearchIco(false);
    this.toggleDefaultLogo(false);
    this.setHeaderTitle('Reviews');
  },
  mixins: [altMixins]
};
</script>
