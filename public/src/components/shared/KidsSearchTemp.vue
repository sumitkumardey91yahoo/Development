<template>
    <div>
        <nav class="top-menu">
            <a  class="kids-menu" v-for="nav in sectionNav" :class="navSectionClass(nav)" @click="getSectionContents(nav)">{{nav}}</a>
        </nav>
        <div class="flow-container" v-if="searchFilterResults">
            <div class="mvi-data" v-for="(result, index) in searchFilterResults">
                <div class="mvi-item mvi-white" @click="playSearchItem(index)">
                    <div class="mvi-img-sec">
                        <img :src="result.images.cover" class="mvi-img">
                        <!-- NOTE added sumit for brandline -->
                        <div v-if="result.progress && result.progress != 100" class="line-progress">
                            <div class="progress" :style="{ width: result.progress + '%' }"></div>
                        </div>
                        <div v-else class="color-line"></div>
                    </div>
                    <div class="mvi-detail-sec">
                        <h3 v-if="result.title">{{result.title}}</h3>
                        <ul class="info-tags">
                            <li v-if="result.seasonNumber">S{{result.seasonNumber}}</li>
                            <li v-if="result.episodeNumber">E{{result.episodeNumber}}</li>
                            <li v-if="result.duration">{{result.duration}}</li>
                            <li v-if="result.mainLanguage">{{result.mainLanguage}}</li>
                        </ul>

                        <p class="alt-tag" v-if="result.contentName">{{result.contentName}}</p>
                        <p v-if="result.progress" class="alt-tag">
                        <span v-if="result.progress != 100">watching</span>
                        <span v-else>watched</span></p>

                    </div>
                    <div class="clearfix"></div>
                </div>

            </div>
        </div>
        <div class="v-center-box">
            <h3>No results found</h3>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            sectionNav: ['ALL', 'SHOWS', 'MOVIES', 'VIDEOS'],
            activeNav: undefined,
        }
    },
    computed: {
        ...mapGetters([
            'searchResults',
            'searchFilterResults',
        ]),
    },
    methods: {
        ...mapMutations([
            'setSearchResults',
            'setKidsPlayerContent',
            'setSearchFilterResults',
        ]),
        ...mapActions([
            'actSearchQuery',
        ]),
        playSearchItem(index) {
            this.setKidsPlayerContent(this.searchResults[index]);

            var routerObj = {
                name: 'kidsPlayer',
                query: {
                    type: this.searchResults[index].contentType
                }
            };
            if (this.searchResults[index].contentType == 'trailer') {
                routerObj.query.seriesid = this.searchResults[index].contentId;
            } else if (this.searchResults[index].contentType == 'series' || this.searchResults[index].contentType == 'standup') {
                routerObj.query.seriesid = this.searchResults[index].seriesId;
            } else if (this.searchResults[index].contentType == 'movie') {
                routerObj.query.contentid = this.searchResults[index].contentId;
            } else if (this.searchResults[index].contentType == 'episode') {
                routerObj.query.episodeid = this.searchResults[index].episodeId;
                routerObj.query.seasonid = this.searchResults[index].seasonId;
                routerObj.query.seriesid = this.searchResults[index].seriesId;
            }
            var kidsModeUrl='kids-player/episode/'+this.searchResults[index].contentId;
           // console.log(JSON.stringify(kidsModeUrl));
            //this.$router.push(routerObj);
            this.$router.push(kidsModeUrl);
        },
        navSectionClass(nav) {
            return (nav == this.activeNav) ? 'active' : '';
        },
        getSectionContents(nav) {
            // console.log('[SearchTemp | getSectionContents | nav | ]', nav);
            // console.log('[SearchTemp | getSectionContents | searchResults | ]', this.searchResults);

            var filterResults = undefined;

            switch (nav) {
                case 'ALL':
                    this.activeNav = 'ALL';
                    filterResults = this.searchResults;
                    break;
                case 'SHOWS':
                    this.activeNav = 'SHOWS';
                    filterResults = this.searchResults.filter((result) => {
                        return (result.contentType == 'episode')
                    });
                    // console.log('[SearchTemp | getSectionContents | SHOWS | ]', filterResults);
                    break;
                case 'MOVIES':
                    this.activeNav = 'MOVIES';
                    filterResults = this.searchResults.filter((result) => {
                        return (result.contentType == 'movie')
                    });
                    // console.log('[SearchTemp | getSectionContents | MOVIES | ]', filterResults);
                    break;
                case 'VIDEOS':
                    this.activeNav = 'VIDEOS';
                    filterResults = this.searchResults.filter((result) => {
                        return (result.contentType == 'trailer' || result.contentType == 'poster')
                    });
                    // console.log('[SearchTemp | getSectionContents | VIDEOS | ]', filterResults);
                    break;
                default:
            }
            if (filterResults && filterResults.length) {
                this.setSearchFilterResults(filterResults);
            } else {
                this.setSearchFilterResults(undefined);
            }
            // console.log('[SearchTemp | getSectionContents | searchFilterResults | ]', this.searchFilterResults);
        }
    },
    created() {
        this.activeNav = this.sectionNav[0];
        this.setSearchFilterResults(this.searchResults);

        // console.log('[SearchTemp | created | searchFilterResults | ]', this.searchFilterResults);
    },
    mixins: [altMixins]
}
</script>
