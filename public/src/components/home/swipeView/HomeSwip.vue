<template lang="html">
  <div class="swipe" v-if="itemListingData">
    <div
      v-for="(singleCategory,index) in itemListingData">
      <swipe-container
        v-if="singleCategory" 
        :subContainer='singleCategory' />
    </div>
  </div>
</template>

<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
const swipeContainer = () => import('./swipeContainer.vue');

export default {
    data() {
        return {
            tes:undefined,
            classObject: {
                'height':screen.width * 1.085 + "px",
            },
            swiper1 : undefined,
            param : undefined,
            withUrl : undefined,
            listingSubscetion : undefined,
            screenTitle : undefined,
            allContentItem:[],
            margin_right:{'margin-right':'5px'},
            swiper_container:'swipe',
            bindAllSwiper:[],
            withUrlPagination:[],
            withIdPagination:[],
            itemListingData:[],
            sectionWiseData:[],
            checkMountedWatchFlag:undefined,
        };
    },
    computed: {
      ...mapGetters([
          'subSections'
      ]),
    },
      props: [ 'swipData' ],
      watch: {
          swipData (data) {
              if(!this.checkMountedWatchFlag) {
                  if(this.$route.name == 'home') {
                      this.itemListingData = [];
                      this.setSubsectionListing(data);
                      this.initSwiper();
                  } else {
                      this.setSubsectionListing(undefined);
                  }
              }
          },
      },
    methods : {
        ...mapMutations([
        'setSubsectionListing'
        ]),
        ...mapActions([
        ]),
        initSwiper() {
            if(this.subSections) {
                let altUser = undefined;
                let language = undefined;

                altUser = localStorage.getItem("altUser") ? JSON.parse(localStorage.getItem("altUser")) : undefined;
                if(!altUser) {
                    this.itemListingData = this.subSections.filter((item) => {
                        return item.visible == 'true';
                    });
                } else {
                    this.itemListingData = this.subSections.slice();
                }

                   language = this.itemListingData.filter((menu)=>{
                    return menu.order == 100;
                });
                // console.log("homeswipe || language ",language);

                if(language && language.length) {
                    this.itemListingData.splice(1, 1);
                } else {
                    this.itemListingData.splice(0, 1);
                }

                // console.log("initSwiper || homeSwipe.vue",this.itemListingData);
            }
        }
    },
    mounted(){
        if(!this.checkMountedWatchFlag && this.subSections) {
            this.initSwiper();
            this.checkMountedWatchFlag = true;
        }
    },
    components : {
        'swipe-container' : swipeContainer,
    },
    created() {
    },
  mixins: [altMixins]
}

</script>
