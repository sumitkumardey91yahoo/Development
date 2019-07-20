<template>
    <div>
        <component :is="activePlayerComponent"></component>

        <player-sharing v-show="showSharing"></player-sharing>
        <popup-prompt-firstpc v-show="showPromptFirstPcPopup"></popup-prompt-firstpc>
        <popup-enable-pcprompt v-show="showEnablePcPopup"></popup-enable-pcprompt>
    </div>
</template>

<script>
import PlayerScreenDefault from './PlayerScreenDefault.vue';
import PlayerScreenKidsShow from './PlayerScreenKidsShow.vue';
import PlayerScreenKidsDefault from './PlayerScreenKidsDefault.vue';

const Sharing = () => import(/* webpackChunkName: "player-Player-Sharing" */ './Sharing.vue');
const PopupPromptFirstPC = () => import(/* webpackChunkName: "player-Player-PopupPromptFirstPC" */ '../shared/PopupPromptFirstPC.vue');
const PopupEnablePcPrompt = () => import(/* webpackChunkName: "player-Player-PopupEnablePcPrompt" */ '../shared/PopupEnablePcPrompt.vue');

import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';

export default {
    data() {
        return {
            showSharing: false,
            showPromptFirstPcPopup: false,
            showEnablePcPopup: false,
            activePlayerComponent: 'PlayerScreenDefault',
        };
    },
    watch: {
        '$route' (to, from) {
            this.handlePlayerRouteChange();
        }
    },
    components: {
        'PlayerScreenDefault': PlayerScreenDefault,
        'PlayerScreenKidsShow': PlayerScreenKidsShow,
        'PlayerScreenKidsDefault': PlayerScreenKidsDefault,
        'player-sharing': Sharing,
        'popup-prompt-firstpc': PopupPromptFirstPC,
        'popup-enable-pcprompt': PopupEnablePcPrompt,
    },
    methods: {
        checkActiveComponent() {
            var routeName = this.$route.name;

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            if (altProfileMode == 'kids') {
                if (routeName == 'show') {
                    this.activePlayerComponent = 'PlayerScreenKidsShow';
                } else {
                    this.activePlayerComponent = 'PlayerScreenKidsDefault';
                }
            } else {
                this.activePlayerComponent = 'PlayerScreenDefault';
            }
        },
        setPlayerHeader() {
            this.setHeaderTitle(false);

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            if (altProfileMode == 'kids') {
                this.toggleDefaultLogo(false);
                this.toggleKidsLogo(true);
            } else {
                this.toggleDefaultLogo(true);
                this.toggleKidsLogo(false);
            }

            var headerSearchIco = document.getElementById('header-search-ico');
            if (headerSearchIco) {
                headerSearchIco.style.display = 'inline';
            }

            var recentDeleteIco = document.getElementById('delete-ico');
            if (recentDeleteIco) {
                recentDeleteIco.addEventListener('click', this.recentDeleteIcoClickCB);
                recentDeleteIco.style.display = 'none';
            }

            var recentCloseDeleteIco = document.getElementById('header-close-ico-default');
            if (recentCloseDeleteIco) {
                recentCloseDeleteIco.addEventListener('click', this.recentCloseDeleteIcoClickCB);
                recentCloseDeleteIco.style.display = 'none';
            }
        },
        detectFirstPcPrompt() {
            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            if (altProfileMode == 'kids') {
                var routeName = this.$route.name;
                if (routeName == 'show') return;
            }

            var promptPcPlayback = undefined;
            if (localStorage.getItem('promptPcPlayback')) {
                promptPcPlayback = JSON.parse(localStorage.getItem('promptPcPlayback'));
                if (promptPcPlayback.value == true) {
                    this.showPromptFirstPcPopup = true;
                }
            }
        },
        handlePlayerRouteChange() {
            this.checkActiveComponent();

            eventBus.$emit('toggleLanguageFilterEvent', false);
        },
    },
    created() {
        this.checkActiveComponent();

        this.setPlayerHeader();

        // Show the user prompt to enable the protected content playback
        this.detectFirstPcPrompt();

        eventBus.$on('togglePopupSearch', (state) => {
            this.showSearch = state;
        });
        eventBus.$on('togglePromptFirstPcPopup', (state) => {
            this.showPromptFirstPcPopup = state;
        });
        eventBus.$on('toggleEnablePcPrompt', (state) => {
            this.showEnablePcPopup = state;
        });
        eventBus.$on('showSharingEvent', () => {
            this.showSharing = true;
        });
        eventBus.$on('closeSharingEvent', () => {
            this.showSharing = false;
        });
        eventBus.$on('toggleSigninPopupEvent', (state) => {
            // console.log("sign in player screen");
            this.showSigninPopup = state;

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "fixed";
            }
        });
        eventBus.$on('togglePlayerSigninPopupEvent', (state) => {
            // NOTE added by sumit for the popup position chnage 16.12.2018
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "fixed";
            }

            this.showPlayerSigninPopup = state;
        });
        eventBus.$on('togglePlayerFavSigninPopupEvent', (state) => {
           // NOTE added by sumit for the popup position chnage 16.12.2018 fav anonumous
           if(!localStorage.getItem('altUser')) {
               if(document.getElementById('alt-app')) {
                   document.getElementById('alt-app').style.position = "fixed";
               }
           }

            this.showPlayerFavSigninPopup = state;
        });
        // eventBus.$on('toggleSubscribePopupEvent', (state) => {
        //
        //     if(document.getElementById('alt-app')) {
        //         document.getElementById('alt-app').style.position = "fixed";
        //     }
        //
        //     this.showSubscribePopup = state;
        // });
        eventBus.$on('toggleVideoBlockPopupEvent', (state) => {
            this.showVideoBlockPopup = state;
        });
        eventBus.$on('toggleVideoErrorPopupEvent', (state) => {
            this.showVideoErrorPopup = state;
        });
        eventBus.$on('toggleRentTvodItemEvent', (state) => {
            // NOTE added by sumit for the popup position chnage 16.12.2018 fav anonumous
            // if(document.getElementById('alt-app')) {
            //     // console.log("1");
            //     document.getElementById('alt-app').style.position = "fixed";
            // }
            this.showTvodRent = state;
        });
        eventBus.$on('toggleRentNowPopupEvent', (state) => {
            this.showRentNowPopup = state;
        });
        eventBus.$on('toggleGeoBlockEvent', (state) => {
            this.showGeoBlockPopup = state;
        });
        eventBus.$on('togglePopupNetworkError', (state) => {
             // console.log('[Player | togglePopupNetworkError | ]');

            this.showNoNetwork = state;
        });
        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;

            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });

        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    beforeDestroy() {
        eventBus.$off('handlePlayerBeforeRouteLeave');
        eventBus.$off('playTrailerEvent');
        eventBus.$off('playStreamEvent');
        eventBus.$off('showSharingEvent');
        eventBus.$off('playTrailerBtnClickEvent');
        eventBus.$off('playMovieBtnClickEvent');
        eventBus.$off('plrPlayingMovieEvent');
        eventBus.$off('plrPlayingTrailerEvent');
        eventBus.$off('playRelatedEpisodeClickEvent');
        eventBus.$off('togglePromptFirstPcPopup');
        eventBus.$off('toggleEnablePcPrompt');
    },
    beforeRouteLeave: (to, from, next) => {
        // console.log('[Player | beforeRouteLeave | ]');

        eventBus.$emit('handlePlayerBeforeRouteLeave', true);
        next();
    },
    mixins: [altMixins]
}

</script>
