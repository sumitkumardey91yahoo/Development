<template>
    <div class="kids-details">
        <!-- <kids-header></kids-header> -->
        <div v-if="kidsDetailsContents" class="container">
            <div class="feat-card" v-for="(item, index) in kidsDetailsContents" @click="playContent(index)">
                <div class="detail">
                    <h2 v-if="item.progress" class="alt-tag">{{getProgressText(item.progress)}}</h2>
                    <h2 v-if="item.title">{{item.title}}</h2>
                    <!--NOTE: for hide short description added by sumit  -->
                    <!-- <h6 v-if="item.shortDescription">{{item.shortDescription}}</h6> -->
                    <ul>
                        <li v-if="item.duration">{{item.duration}}</li>
                        <!-- NOTE commeted by sumit 08 -->
                        <!-- <li v-if="item.mainCategoryName">{{item.mainCategoryName}}</li> -->
                        <li v-if="item.mainLanguage">{{item.mainLanguage}}</li>
                    </ul>
                </div>
                <img v-if="item.images.cover" :src="item.images.cover">
                <img v-else src="../../assets/alt-poster.jpg">
                <div v-if="item.progress && item.progress != 100" class="line-progress">
                    <div class="progress" :style="{ width: item.progress + '%' }"></div>
                </div>
                <div v-else class="color-line"></div>
            </div>
        </div>
        <kids-search v-show="showKidsSearch"></kids-search>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
const Header = () => import (/* webpackChunkName: "kids-KidsDetails-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "kids-KidsDetails-Modals" */ '../shared/Modals.vue');
const KidsSearch = () => import (/* webpackChunkName: "kids-KidsDetails-KidsSearch" */ '../shared/KidsSearch.vue');

// import Header from './Header.vue';
// import Modals from '../shared/Modals.vue';
// import KidsSearch from '../shared/KidsSearch.vue';

import { eventBus } from '../../main'
import { store } from '../../store/store'
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            pinError: false,
            pinErrorMessage: '',
            contentType: undefined,
            contentId: undefined,
            seriesId: undefined,
            seasonId: undefined,
            showKidsSearch: false,
            episodes: new Array(),
            episodeCount: 0,
            limit: 50,
            offset: 0,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'kidsPlayerContent',
            'kidsDetailsContents',
        ]),
    },
    watch: {
        appActive() {
            this.initActiveKidsDetails();
        }
    },
    methods: {
        ...mapMutations([
            'setKidsDetailsContents',
            'setKidsPlayerContent',
        ]),
        ...mapActions([
            'actGetSeasons',
            'actGetAllEpisodes',
            'actGetMediaSeries',
            'actGetKidsProfileSwitch',
        ]),
        initActiveKidsDetails() {
            // console.log('[kidsDetailsContents | initActiveKidsDetails | ]');

            this.contentType = this.$route.query.type;
            this.seriesId = this.$route.query.seriesid;

            this.getMediaInfo();
        },
        getMediaInfo() {
            this.actGetMediaSeries(this.seriesId).then(
                (response) => {
                    // console.log('[KidsDetails | actGetMediaSeries | response | ]', response);

                    this.setKidsPlayerContent(this.parseContents(response));
                    // console.log('[KidsDetails | parseContents | kidsPlayerContent | ]', this.kidsPlayerContent);

                    this.getSeasons();
                },
                (error) => {
                    // console.log('[KidsDetails | actGetMediaSeries | error | ]', error);
                }
            );
        },
        initCreatedKidsDetails() {
            this.contentType = this.$route.query.type;
            if (this.contentType == 'series') {
                this.seriesId = this.$route.query.seriesid;
                this.getMediaInfo();
                // this.getSeasons();
            }
        },
        getSeasons() {
            // console.log('[KidsDetails | getting seasons| ]');

            this.actGetSeasons(this.seriesId).then(
                (response) => {
                    if (response.seasons && response.seasons.length) {
                        // console.log('[KidsDetails | getSeasons | seasons | ]', response.seasons);

                        this.seasonId = response.seasons[0].id;
                        this.getAllEpisodes();
                    }
                },
                (error) => {
                    // console.log('[Seasons | getSeasons | error]', error);
                }
            );
        },
        getAllEpisodes() {
            this.actGetAllEpisodes({
                seriesId: this.seriesId,
                seasonId: this.seasonId,
                limit: this.limit,
                offset: this.offset
            }).then((response) => {
                // console.log('[KidsDetails | getAllEpisodes | response | ]', response);
                if (response.count) {
                    this.episodes = this.episodes.concat(response.episodes);
                    this.episodeCount += response.episodes.length;

                    if (response.count > this.episodeCount) {
                        this.offset += this.limit;
                        this.getAllEpisodes();
                    } else {
                        var episodesArr = new Array();
                        var mediaProgressList = undefined;
                        if (localStorage.getItem('mediaProgressList')) {
                            mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
                        }

                        for (var i in this.episodes) {
                            // console.log('[KidsDetails | episodes | ]', this.episodes[i]);

                            var episode = this.parseContents(this.episodes[i]);
                            // console.log('[mediaProgressList | ]', mediaProgressList);
                            // console.log('[response media_id | ]', this.episodes[i].media_id);

                            if (mediaProgressList) {
                                for (var j in mediaProgressList) {
                                    if (mediaProgressList[j].mediaId === this.episodes[i].media_id) {
                                        episode.progress = mediaProgressList[j].progress;
                                        break;
                                    } else {
                                        episode.progress = undefined;
                                    }
                                }
                            }

                            episodesArr.push(episode);
                        }

                        // console.log('[KidsDetails | getAllEpisodes | episodesArr | ]', episodesArr);

                        this.setKidsDetailsContents(episodesArr);
                        this.toggleLoader(false);
                    }
                }

                // if (response.count) {
                //     var episodesArr = new Array();
                //     var mediaProgressList = undefined;
                //     if (localStorage.getItem('mediaProgressList')) {
                //         mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
                //     }
                //
                //     for (var i in response.episodes) {
                //         // console.log('[KidsDetails | episodes | ]', response.episodes[i]);
                //
                //         var episode = this.parseContents(response.episodes[i]);
                //         // console.log('[mediaProgressList | ]', mediaProgressList);
                //         // console.log('[response media_id | ]', response.episodes[i].media_id);
                //
                //         if (mediaProgressList) {
                //             for (var j in mediaProgressList) {
                //                 if (mediaProgressList[j].mediaId === response.episodes[i].media_id) {
                //                     episode.progress = mediaProgressList[j].progress;
                //                     break;
                //                 } else {
                //                     episode.progress = undefined;
                //                 }
                //             }
                //         }
                //
                //         episodesArr.push(episode);
                //     }
                //
                //     // console.log('[KidsDetails | getAllEpisodes | episodesArr | ]', episodesArr);
                //
                //     this.setKidsDetailsContents(episodesArr);
                //     this.toggleLoader(false);
                // }
            }, (error) => {
                // console.log('[KidsDetails | getAllEpisodes | error | ]', error);
                this.toggleLoader(false);
            });
        },
        playContent(index) {
            this.setKidsPlayerContent(this.kidsDetailsContents[index]);
            // console.log('[KidsDetails | playContent | kidsPlayerContent | ]', this.kidsPlayerContent);

            // NOTE: OLD CODE
            // this.$router.push({ name: 'kidsPlayer' });
            // NOTE: NEW CODE
            this.$router.push({ name: 'kidsPlayer', params: { type: this.kidsPlayerContent.contentType, id: this.kidsPlayerContent.mediaId } });
        },
        checkSwitchUser(event) {
            this.pinError = false;
            this.pinErrorMessage = '';

            if (event.target.value.length == 4) {
                var pin = event.target.value;

                this.actGetKidsProfileSwitch(pin).then(
                    (response) => {
                        // console.log('[Kids | checkSwitchUser | actGetProfileSwitch | response | ]', response);
                        if (response.status == 'ok') {
                            localStorage.removeItem('altUser');
                            localStorage.setItem('altProfileMode', 'default');
                            this.$router.push({ name: 'home' });
                        }
                    },
                    (error) => {
                        if (error.status == 'error') {
                            this.pinErrorMessage = error.message;
                            this.pinError = true;
                        }
                    }
                )
            }
        },
        getProgressText(progress) {
            // console.log('[KidsDetails | progress | ]', progress);

            if (progress == 100) {
                return 'WATCHED';
            }
            return 'WATCHING';
        },
    },
    created() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        eventBus.$on('toggleKidsSearchEvent', (state) => {
            this.showKidsSearch = state;
        });
        if (this.appActive) {
            // console.log('[KidsDetails | created | kidsPlayerContent | ]', this.kidsPlayerContent);

            this.toggleLoader(true);
            this.initCreatedKidsDetails();
        }
    },
    components: {
        'kids-header': Header,
        'alt-modals': Modals,
        'kids-search': KidsSearch,
    },
    beforeRouteLeave: (to, from, next) => {
        store.commit('setRouterFromParam', from);
        next();
    },
    mixins: [altMixins]
}
</script>
