<template lang="html">
    <div class="one-thirds grid-view-margin" v-if="gridSubSectionListing && gridSubSectionListing.length">
        <grid-subSections :GridCategorys="gridSubSectionListing"></grid-subSections>
    </div>
</template>

<script>
import { eventBus } from '@/main';
import { altMixins } from '@/mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
const gridSingleSubsection = ()=> import('./singleSubsectionForGrid.vue');


export default {
    data() {
        return {
            classObject: {
                'height':screen.width * 1.085 + "px",
            },
            gridSubSectionListing:undefined,
            checkCallInit:true,

        };
    },
    computed: {
      ...mapGetters([
          'subSections',
          'appActive'
      ]),
    },
      props: [ 'isGrid' ],
      watch: {
              isGrid (data) {
                    // console.log('[HomeGridView] watch', data);
                  if(data) {
                      this.setSubsectionListing(data);
                      this.initGrid();
                  } else {
                      this.setSubsectionListing(undefined);
                  }
          },
          '$route'(to,from) {
              // console.log("[HomeGridView route change]",this.isGrid);
             //  this.initGrid();
          }
      },
    methods : {
        ...mapMutations([
        'setSubsectionListing'
        ]),
        ...mapActions([
            'actGetSections',
            'actGetContentsByUrl',
            'actGetContentsById'
        ]),
        getContentToPlay(playerContent) {
            this.toggleLoader(true);
            var routerObj = {
                name: playerContent.contentName,
                params: {
                    id: playerContent.id
                }
            }
            this.allContentItem = [];
            this.$router.push(routerObj);
        },
        createGridListing() {
            if(!this.subSections || !this.subSections.length) {
                return;
            }
            var domain = localStorage.getItem('visitedDomain');
            let altUser = undefined;
             altUser = localStorage.getItem("altUser") ? JSON.parse(localStorage.getItem("altUser")) : undefined;

             let subsect = undefined;
              subsect = this.subSections;
             let subsectionsList = subsect.slice();

             subsectionsList.shift();

             if(!subsectionsList.length) {
                 this.allContentItem = [];
                 return;
             }

            this.gridSubSectionListing = subsectionsList;
            // console.log("gridSubSectionListing>>",this.gridSubSectionListing);
        },
        initGrid() {
            this.createGridListing();
        }
    },
    components: {
    'grid-subSections':gridSingleSubsection,
    },
    mounted() {
        if(this.isGrid) {
            this.initGrid();
            // console.log("mounted || HomeGridView",this.isGrid);
        }
    },
    created() {

        //  // console.log("created || HomeGridView",this.isGrid);
    },
  mixins: [altMixins]
}

</script>
