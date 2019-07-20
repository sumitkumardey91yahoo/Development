<template>
    <div class="kids-player">
        <kids-header></kids-header>
        <div class="v-contain" id="v-kids-contain">
            <video id="v-kids-player" style="width:100%;" poster=""></video>

            <div class="v-cmup-nxt" v-show="showComUpNextTag" @click="playComUpNextItem">
                <div class="v-cmup-nxt-bx">
                    <div class="v-cmnxtbx-img">
                        <img src="../../assets/player/next.png" alt="v-cmngup">
                    </div>
                    <div class="v-cmnxtbx-text">
                        <p v-if="altMessages"><strong>{{altMessages.buttonPlayerComingUpNext}}</strong></p>
                        <p v-show="nextPlaylistMediaTitle">{{nextPlaylistMediaTitle}}</p>
                        <p>
                            <span v-show="nextPlaylistMediaSNo">S{{nextPlaylistMediaSNo}}</span>
                            <span v-show="nextPlaylistMediaENo">| E{{nextPlaylistMediaENo}}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="v-controls" id="v-kids-controls">
                <div class="v-toggle" id="v-kids-toggle">
                    <img src="../../assets/player/play.svg" alt="v-pause" id="v-kids-toggler">
                    <!-- <img src="../../assets/player/pause.svg" alt="v-pause" v-show="isPlayerPlaying">
                    <img src="../../assets/player/play.svg" alt="v-play" v-show="!isPlayerPlaying"> -->
                </div>
                <div class="v-main-ctrls" id="v-kids-main-ctrls">
                    <div class="v-group left-group">
                        <span class="v-text v-timer" id="v-kids-current-time">00:00</span>
                        <!-- <span class="v-text v-timer">{{currentTime}}</span> -->
                    </div>
                    <div class="v-group v-bar">
                        <input type="range" value="0" min="0" max="100" class="v-progress" id="v-kids-progress">
                        <!-- <input type="range" :value="seekPosition" min="0" max="100" :step="videoStep" class="v-progress" id="v-kids-progress" @change="seekCallback"> -->
                    </div>
                    <div class="v-group right-group">
                        <span class="v-text v-timer" id="v-kids-duration">00:00</span>
                        <!-- <span class="v-text v-timer">{{duration}}</span> -->
                        <!-- <div class="v-icon">
                        <img src="../../assets/player/cc-off.svg" alt="button-cc">-->
                        <span class="v-icon" id="v-kids-fullsrc-switch">
                            <img src="../../assets/player/full-screen.svg" alt="button-fullscreen">
                        </span>
                    </div>
                    <!-- <div class="v-icon" id="v-kids-fullsrc-switch">
                        <img src="../../assets/player/full-screen.svg" alt="button-fullscreen">
                    </div> -->
                </div>
            </div>
            <div id="v-kids-loader" class="v-loader" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998; display: none;">
                <div class="loading" style="position: relative;width: 56px;height: 56px;margin: 0 auto;top: 50%;transform: translateY(-50%);">
                    <div class="inner"></div>
                </div>
            </div>
        </div>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
const Header = () => import (/* webpackChunkName: "kids-Player-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "kids-Player-Modals" */ '../shared/Modals.vue');

// import Header from './Header.vue';
// import Modals from '../shared/Modals.vue';
// import PopupKidsDvcRmv from '../shared/PopupKidsDvcRmv.vue';

import shaka from 'shaka-player';
import { eventBus } from '../../main';
import { store } from '../../store/store'
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            pinError: false,
            pinErrorMessage: '',
            altKidsPlayer: undefined,
            contentType: undefined,
            mediaId: undefined,
            seriesId: undefined,
            seasonId: undefined,
            stream: undefined,
            manifestUrl: undefined,
            drmType: undefined,
            poster: undefined,
            vContain: undefined,
            vPlayer: undefined,
            vShaka: undefined,
            vControls: undefined,
            vToggler: undefined,
            vLoader: undefined,
            vProgress: undefined,
            vCurrentTime: undefined,
            vDuration: undefined,
            vFullsrcSwitch: undefined,
            showPopupKidsDvcRmv: false,
            playerPlaylist: undefined,
            playListPosition: 0,
            currentPlaylistItem: undefined,
            nextPlaylistMediaTitle: undefined,
            nextPlaylistMediaSNo: undefined,
            nextPlaylistMediaENo: undefined,
            nextPlaylistPosition: 0,
            showComUpNextTag: false,
            showComUpNextTime: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'kidsPlayerContent',
            'kidsVideoPoster',
            'altMessages',
        ]),
    },
    watch: {
        appActive() {
            this.initActivePlayerScreen();
        },
        '$route'(to, from) {
            // console.log('[Player | watch | ]');
            this.initMountedPlayerScreen();
            // this.initActivePlayerScreen();
        }
    },
    methods: {
        ...mapMutations([
            'setKidsVideoPoster',
            'setKidsPlayerContent',
        ]),
        ...mapActions([
            'actGetDrmTickt',
            'actGetSingleEpisode',
            'actGetKidsProfileSwitch',
            'actKidsMediaAccess',
            'actGetKidsMediaVideo',
            'actGetPlayerProgress',
            'actPutPlayerProgress',
            'actGetEpisodes',
        ]),
        initMountedPlayerScreen() {
            // console.log('[Player | initMountedPlayerScreen]');
            // console.log('[Player | initMountedPlayerScreen | kidsPlayerContent | ]', this.kidsPlayerContent);

            this.showComUpNextTag = false;
            this.contentType = this.$route.params.type;
            this.mediaId = this.$route.params.id;
            this.stream = this.kidsPlayerContent.stream;

            // console.log('[Player | initMountedPlayerScreen | mediaId | ]', this.mediaId);

            // console.log('[Player | initMountedPlayerScreen | contentType | ]', this.contentType);
            // console.log('[Player | initMountedPlayerScreen | mediaId | ]', this.mediaId);

            this.processContent();
        },
        initActivePlayerScreen() {
            // console.log('[Player | initActivePlayerScreen | ]');

            this.showComUpNextTag = false;
            this.contentType = this.$route.params.type;
            this.mediaId = this.$route.params.id;
            this.fetchMedia();
        },
        processContent() {
            // console.log('[Player | [processContent ]]');

            if (this.stream) {
                // console.log('[Player | processContent | stream | ]', this.stream);
                // console.log('[Player | kidsPlayerContent | ]', this.kidsPlayerContent);

                this.manifestUrl = this.kidsPlayerContent.stream.streamUrl;
                this.drmType = this.kidsPlayerContent.stream.drm;
                this.streamId = this.kidsPlayerContent.stream.streamId;
                this.seriesId = this.kidsPlayerContent.seriesId;
                this.seasonId = this.kidsPlayerContent.seasonId;
                this.poster = this.kidsPlayerContent.images.cover;
                this.showComUpNextTime = this.kidsPlayerContent.nextIn ? this.kidsPlayerContent.nextIn : 10;

                // this.getMediaAccess();
                // this.fetchPlaylist();

                this.fetchPlaylist(() => {
                    this.getMediaAccess();
                })
            } else {
                this.fetchMedia();
                // this.fetchPlaylist();
            }
        },
        fetchMedia() {
            // console.log('[Player | fetchMedia]');

            this.actGetKidsMediaVideo(this.mediaId).then(
                (response) => {
                    // console.log('[Player | fetchMedia | response | ]', response);

                    if (response) {
                        this.setKidsPlayerContent(this.parseContents(response));
                        // console.log('[Player | fetchMedia | kidsPlayerContent | ]', this.kidsPlayerContent);

                        this.stream = this.kidsPlayerContent.stream;
                        this.processContent();
                    }
                },
                (error) => {
                    // console.log('[Player | fetchMedia | error | ]', error);

                },
            );
        },
        getMediaAccess() {
            // console.log('[Player | getMediaAccess | ]');

            this.actKidsMediaAccess(this.mediaId).then(
                (response) => {
                    // console.log('[Player | getMediaAccess | response | ]', response);

                    if (response.status && response.status == 'ok') {
                        this.getPlayerProgress(() => {
                            this.processScreen();
                        });
                    }
                },
                (error) => {
                    // console.log('[Player | getMediaAccess | error | ]', error);

                }
            );
        },
        processScreen() {
            // console.log('[Player | processScreen | manifestUrl ]', this.manifestUrl);
            // console.log('[Player | processScreen | drmType ]', this.drmType);

            if (this.drmType) {
                this.renderDrmPlayer();
                // console.log('[processScreen | renderDrmPlayer ]');
                this.toggleLoader(false);
            } else {
                this.renderNormalPlayer();
                // console.log('[processScreen | renderNormalPlayer ]');
                this.toggleLoader(false);
            }
        },
        renderNormalPlayer() {
            // console.log('[Player | processScreen | renderNormalPlayer ]');

            shaka.polyfill.installAll();
            if (shaka.Player.isBrowserSupported()) {
                // console.log('[Player | renderNormalPlayer | this | ]', this);

                var self = this;
                function loadVideo() {
                    self.vShaka.unload().then(() => {
                        self.vShaka.load(self.manifestUrl).then(() => {
                            localStorage.setItem('awsContentUrl', self.manifestUrl);

                            self.vTogglePlay();
                            self.toggleLoader(false);
                            eventBus.$on('playTrailerEvent', self.playTrailerCallback);
                        });
                    });
                }

                if (this.vPlayer && this.vShaka) {

                    this.vShaka.destroy().then(() => {
                        this.vPlayer = document.getElementById('v-kids-player');
                        this.vShaka = new shaka.Player(this.vPlayer);
                        self.configurePlayer();
                        loadVideo();
                    });
                } else {
                    this.vPlayer = document.getElementById('v-kids-player');
                    this.vShaka = new shaka.Player(this.vPlayer);

                    this.configurePlayer();
                    loadVideo();
                }
            }
        },
        renderDrmPlayer() {
            // console.log('[Player | processScreen | renderDrmPlayer ]');

            shaka.polyfill.installAll();
            if (shaka.Player.isBrowserSupported()) {
                var self = this;
                function loadVideo() {
                    self.vShaka.unload().then(() => {
                        self.vShaka.load(self.manifestUrl).then(() => {
                            localStorage.setItem('awsContentUrl', self.manifestUrl);

                            // console.log('[Player | continueProgress | ]', self.continueProgress);

                            self.vTogglePlay();
                            self.toggleLoader(false);
                            eventBus.$on('playStreamEvent', self.playStreamCB);
                        });
                    });
                }

                if (self.vPlayer && self.vShaka) {
                    self.vShaka.destroy().then(() => {
                        self.vPlayer = document.getElementById('v-kids-player');
                        self.vShaka = new shaka.Player(self.vPlayer);

                        self.configurePlayer();
                        self.configureDrmPlayback(loadVideo);
                    });
                } else {
                    self.vPlayer = document.getElementById('v-kids-player');
                    self.vShaka = new shaka.Player(self.vPlayer);

                    self.configurePlayer();
                    self.configureDrmPlayback(loadVideo);
                }

                localStorage.setItem('awsContentStreamId', this.streamId);
            }
        },
        configureDrmPlayback(callback) {
            this.actGetDrmTickt(this.streamId).then(
                (response) => {
                    this.licenseUrl = window.licenseUrl = response.license_server_url;
                    this.drmTicket = window.drmTicket = response.ticket;

                    // console.log('[PlayerScreen | licenceUrl | ]', this.licenseUrl);
                    // console.log('[PlayerScreen | vShaka | ]', this.vShaka);

                    this.vShaka.configure({
                        drm: {
                            servers: {
                                'com.widevine.alpha' : this.licenseUrl
                            }
                        }
                    });

                    this.vShaka.getNetworkingEngine().registerRequestFilter(function(type, request) {
                        var StringUtils = shaka.util.StringUtils;
                        var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
                        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                            var rawLicenseRequest = new Uint8Array(request.body);

                            // Create the wrapped request structure.
                            var wrapped = {};

                            request.allowCrossSiteCredentials = true;

                            // Encode the raw license request in base64.
                            // The server we are using in this tutorial expects this field and this
                            // encoding for the raw request.
                            wrapped.payload = btoa(String.fromCharCode.apply(null, rawLicenseRequest));

                            // Add whatever else we want to communicate to the server.
                            // None of these values are read by the server we are using in this
                            // tutorial.
                            // In practice, you would send what the server needs and the server would
                            // react to it.
                            // console.log(window.drmTicket);

                            wrapped.content_id = 'undefined';
                            wrapped.ticket = window.drmTicket;

                            // Encode the wrapped request as JSON.
                            var wrappedJson = JSON.stringify(wrapped);
                            // Convert the JSON string back into an ArrayBuffer to replace the request
                            // body.
                            request.body = new Uint8Array(wrappedJson.length);
                            for (var i = 0; i < wrappedJson.length; ++i) {
                                request.body[i] = wrappedJson.charCodeAt(i);
                            }
                        }
                    });

                    this.vShaka.getNetworkingEngine().registerResponseFilter(function(type, response) {
                        var StringUtils = shaka.util.StringUtils;
                        var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
                        if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
                            // this is the wrapped license.
                            var wrappedArray = new Uint8Array(response.data);
                            // convert it to a string.
                            var wrappedString = String.fromCharCode.apply(null, wrappedArray);
                            // parse the JSON string into an object.
                            var wrapped = JSON.parse(wrappedString);

                            // this is a base64-encoded version of the raw license.
                            var rawLicenseBase64 = wrapped.license;


                            // decode it to a string.
                            var rawLicenseString = atob(rawLicenseBase64);
                            // convert that string into a Uint8Array and replace the response data to feed it to the Widevine CDM.
                            response.data = new Uint8Array(rawLicenseString.length);
                            for (var i = 0; i < rawLicenseString.length; ++i) {
                                response.data[i] = rawLicenseString.charCodeAt(i);
                            }
                        }
                    });

                    callback();

                    window.vShaka = this.vShaka;
                    this.vShaka.addEventListener('error', onErrorEvent);
                },
                (error) => {
                    // console.log('[PlayerScreen | actGetDrmTickt | error | ]', error);

                    if (error.code == 400 && 'device_uuid' in error.errors) {
                        this.showPopupKidsDvcRmv = true;
                        setTimeout(this.clearAndExitKidsMode, 3000);
                        return;
                    }
                    if (error) {
                        this.vShaka.destroy().then(() => {
                            this.showVideoLoader = false;
                        });
                    }
                }
            );

            function onErrorEvent(event) {
                onError(event.detail);
                this.vShaka.destroy().then(() => {
                    this.showVideoLoader(false);
                });
            }
            function onError(error) {
                // console.error('Error code', error.code, 'object', error);
                this.vShaka.destroy().then(() => {
                    this.showVideoLoader(false);
                });
            }

        },
        configurePlayer() {
            localStorage.setItem('awsContentStreamId', "N.A.");

            this.vContain = document.getElementById('v-kids-contain');
            this.vControls = document.getElementById('v-kids-controls');
            this.vProgress = document.getElementById('v-kids-progress');
            this.vLoader = document.getElementById('v-kids-loader');
            this.vToggler = document.getElementById('v-kids-toggler');
            this.vCurrentTime = document.getElementById('v-kids-current-time');
            this.vDuration = document.getElementById('v-kids-duration');
            this.vMainCtrls = document.getElementById('v-kids-main-ctrls');
            this.vFullsrcSwitch = document.getElementById('v-kids-fullsrc-switch');

            // console.log('[configurePlayer | poster | ]', this.poster);
            if (this.poster) {
                document.getElementById('v-kids-player').setAttribute('poster', this.poster);
            }

            this.vPlayer.addEventListener('play', this.vPlayEventCB);
            this.vPlayer.addEventListener('pause', this.vPauseEventCB);
            this.vPlayer.addEventListener('timeupdate', this.vHandleProgress);
            this.vPlayer.addEventListener('loadstart', this.vToggleLoader(true));
            this.vPlayer.addEventListener('loadeddata', this.vLoadedData);
            this.vPlayer.addEventListener('ended', this.vEnded);
            this.vShaka.addEventListener('buffering', (event) => {
                this.vToggleLoader(event.buffering);
            });
            this.vProgress.addEventListener('input', this.vSeek);
            this.vProgress.addEventListener('change', this.contentSeeked);
            this.vToggler.addEventListener('click', this.vTogglePlay);
            this.vFullsrcSwitch.addEventListener('click', this.vToggleFullscreen);
        },
        getPlayerProgress(callback) {
            // console.log('[Player | getPlayerProgress | ]');

            this.actGetPlayerProgress(this.mediaId).then((response) => {
                // console.log('[getPlayerProgress | response | ]', response);

                if (response.progress) {
                    // this.continueProgress = 0;
                    this.continueProgress = response.progress;
                } else {
                    this.continueProgress = 0;
                }
                if (callback) {
                    callback();
                }
            }, (error) => {
                // console.log('[getPlayerProgress | error | ]', error);

                this.continueProgress = 0;
                if (callback) {
                    callback();
                }
            });
        },
        playComUpNextItem() {
            // console.log('[PlayerScreen | playComUpNextItem | ]');

            // this.showComUpNextTag = false;

            // console.log('[PlayerScreen | playComUpNextItem | vPlayer ]', this.vPlayer);

            if (this.vPlayer) {
                // console.log('[PlayerScreen | playComUpNextItem | vPlayer | mediaId ]', this.mediaId);

                this.vPlayer.pause();

                this.updateMediaProgress().then(() => {
                    this.vPlayer.removeEventListener('timeupdate', this.vHandleProgress);
                    this.showComUpNextTag = false;
                    this.playNextPlaylistItem();
                    return;
                });
            }

            this.showComUpNextTag = false;

            this.playNextPlaylistItem();
        },
        playNextPlaylistItem() {
            // console.log('[PlayerScreen | playNextPlaylistItem | currentPlaylistItem | ]', this.currentPlaylistItem);
            // console.log('[PlayerScreen | playNextPlaylistItem | playerPlaylist | ]', this.playerPlaylist);

            // this.nextPlaylistPosition += 1;

            // console.log('[PlayerScreen | playNextPlaylistItem | playListPosition | ]', this.playListPosition);
            // console.log('[PlayerScreen | playNextPlaylistItem | nextPlaylistPosition | ]', this.nextPlaylistPosition);

            // this.showComUpNextTag = false;

            if (!(this.playerPlaylist && this.playerPlaylist.length)) return;

            // var nextPlaylistItem = this.playerPlaylist[this.nextPlaylistPosition];
            // console.log('[vEnded | nextPlaylistItem | ]', nextPlaylistItem);
            // this.nextPlaylistMediaTitle = nextPlaylistItem.title;
            // this.nextPlaylistMediaSNo = nextPlaylistItem.seasonNumber;
            // this.nextPlaylistMediaENo = nextPlaylistItem.episodeNumber;

            this.currentPlaylistItem = this.playerPlaylist[this.playListPosition];

            // console.log('[PlayerScreen | vEnded | currentPlaylistItem | ]', this.currentPlaylistItem);

            this.setKidsPlayerContent(this.currentPlaylistItem);

            if (this.currentPlaylistItem.contentType == 'episode') {
                this.playlistCallbackEvent = true;

                // var routerObj = {
                //     name: 'player',
                //     query: {
                //         type: this.currentPlaylistItem.contentType,
                //         contentid: this.currentPlaylistItem.mediaId,
                //         seasonid: this.currentPlaylistItem.seasonId,
                //         seriesid: this.currentPlaylistItem.seriesId
                //     }
                // };
                this.$router.push({ name: 'kidsPlayer', params: { type: this.currentPlaylistItem.contentType, id: this.currentPlaylistItem.mediaId } });
                // this.playListPosition += 1;
            }

            // if (this.vPlayer) {
            //     this.vPlayer.addEventListener('timeupdate', this.vHandleProgress);
            // }
        },
        updateButton(data) {
             if(data){
                this.vToggler.src = '/src/assets/player/replay.svg';
            } else {
                this.vToggler.src = this.vPlayer.paused ? '/src/assets/player/play.svg' : '/src/assets/player/pause.svg';
            }
        },
        vPlayEventCB() {
            // console.log('[Player | vPlayEventCB | ]', this.kidsPlayerContent);
            //gtm start
            var series_title = this.kidsPlayerContent.seriesTitle ? this.kidsPlayerContent.seriesTitle : "";

            var altGeoData = undefined;
            if (localStorage.getItem('altGeoData')) {
                altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
            }
            var platformDetails = this.altDetectPlatform();

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'gt_play',
                'eventAction':'playback',
                'eventCategory':'gt_play',
                'eventLabel':'playback',
                'eventValue':1,
                'gtl_content_parent_title':series_title,
                'gtl_episode_title':this.kidsPlayerContent.title ? this.kidsPlayerContent.title : '',
                'gtl_platform': platformDetails.os + " " + platformDetails.osVersion,
                'gtl_device_make': platformDetails.browser ? platformDetails.browser : '',
                'gtl_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
                'gtl_city': (altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? altGeoData.city.names.en : '',
                'gtl_device_timestamp': new Date().getTime(),
                'gtl_content_source':localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : '',
                'gtl_content_id':this.kidsPlayerContent.contentId ? this.kidsPlayerContent.contentId : '',
                'gtl_content_type':this.kidsPlayerContent.contentType ? this.kidsPlayerContent.contentType : '',
                'gtl_content_alt_id': (this.kidsPlayerContent && this.kidsPlayerContent.externalId) ? this.kidsPlayerContent.externalId : ''
            });
            // gtm end
            this.updateButton();
        },
        vPauseEventCB() {
            this.updateButton();

            var altKidsUser = JSON.parse(localStorage.getItem('altKidsUser'));
            if (altKidsUser) {
                // console.log('[Player | vPauseEventCB | mediaId | ]', this.mediaId);

                var duration = Math.round(this.vPlayer.duration);
                var currentTime = Math.round(this.vPlayer.currentTime);
                var progress = Math.round((currentTime / duration) * 100);

                var currItem = { mediaId: this.mediaId, progress, length: duration };

                this.actPutPlayerProgress({ media_id: this.mediaId, progress: Math.round(this.vPlayer.currentTime) }).then(
                    (response) => {
                        // console.log('[Player | vPlayerPausedCB | response | ]', response);

                    },
                    (error) => {
                        // console.log('[Player | vPlayerPausedCB | error | ]', error);
                    }
                );

                if (localStorage.getItem('mediaProgressList')) {
                    var mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
                    var updtdProgList = this.getUniqueProgressList(currItem, mediaProgressList);

                    // console.log('[Player | updtdProgList | ]', updtdProgList);

                    localStorage.setItem('mediaProgressList', JSON.stringify(updtdProgList));
                } else {
                    var mediaProgressList = new Array();
                    mediaProgressList.push(currItem);
                    localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));
                }
            }
        },
        vHandleProgress() {
            this.vProgress.value = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
            this.vCurrentTime.innerHTML = this.vCalcTimeLine(this.vPlayer.currentTime);

            if (this.playerPlaylist && (this.vPlayer.duration - this.vPlayer.currentTime) < parseInt(this.showComUpNextTime)) {
                this.showComUpNextTag = true;
            } else {
                this.showComUpNextTag = false;
            }

        },
        vToggleLoader(show) {
            if (show) {
                this.vLoader.style.display = 'block';
            } else {
                this.vLoader.style.display = 'none';
            }
        },
        vToggleToggler(show) {
            if (show) {
                this.vToggler.style.display = 'inline-block';
            } else {
                this.vToggler.style.display = 'none';
            }
        },
        vLoadedData() {
            this.vReset();
            this.vToggleControls(true);
            this.vToggleToggler(true);
            this.vToggleLoader(false);

            if (this.continueProgress) {
                // this.vPlayer.currentTime = this.continueProgress;
                this.vPlayer.currentTime = 0;
            }
        },
        vEnded() {
            // console.log('[PlayerScreen | vEnded | loadedContent | ]', this.loadedContent);
            //// console.log('[PlayerScreen | vEnded | contentType | ]', this.contentType);


            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                window.mobileAnalyticsClient.recordEvent( '_content.playback',
                this.stuffPlaybackAttributes('complete'),
                this.buildPlaybackMetrics('complete', this.vPlayer.duration, this.vPlayer.duration));
            }
            // End of AWS Mobile SDK Events


            if (this.playerPlaylist) {
                this.currentPlaylistItem = this.playerPlaylist[this.playListPosition];
                // console.log('[vEnded | currentPlaylistItem | ]', this.currentPlaylistItem);

                this.setKidsPlayerContent(this.currentPlaylistItem);
                this.playNextPlaylistItem();
            } else {
                //NOTE: commentted by sumit 07.11

                // this.vShaka.unload().then(() => {
                //     this.vShaka.load(this.manifestUrl).then(() => {
                //         localStorage.setItem('awsContentUrl', this.manifestUrl);
                //        // this.vReset();
                //         // console.log('[vEnded | shaka-player | unloaded | loaded | ]');
                //     });
                // });

                 //added by sumit
                this.vResetForReplay();
            }
        },
        vSeek(event) {
            this.showComUpNextTag = false;

            this.vPlayer.currentTime = parseFloat(event.target.value / 100) * this.vPlayer.duration;
        },
        vReset() {
            this.vPlayer.currentTime = 0;
            this.vCurrentTime.innerHTML = this.vCalcTimeLine(0);
            this.vDuration.innerHTML = this.vCalcTimeLine(isNaN(this.vPlayer.duration) ? 0 : this.vPlayer.duration);
            this.vProgress.value = 0;
            this.updateButton();
        },
        vResetForReplay() {
           this.vPlayer.currentTime = 0;
            this.vCurrentTime.innerHTML = this.vCalcTimeLine(0);
            this.vDuration.innerHTML = this.vCalcTimeLine(isNaN(this.vPlayer.duration) ? 0 : this.vPlayer.duration);
            this.vProgress.value = 0;
            this.updateButton(true);
        },
        vTogglePlay() {
            this.vToggler.removeEventListener('click', this.vTogglePlay);

            if (this.contentRestricted) {
                var altUser = JSON.parse(localStorage.getItem('altUser'));
                if (altUser) {
                    eventBus.$emit('toggleSubscribePopupEvent', true);
                } else {
                    eventBus.$emit('toggleSigninPopupEvent', true);
                }
                this.vToggler.addEventListener('click', this.vTogglePlay);
                return false;
            }

            const method = this.vPlayer.paused ? 'play' : 'pause';
            this.vPlayer[method]();

            this.vToggler.addEventListener('click', this.vTogglePlay);

            // AWS Mobile SDK Events
            var playbackOperation = this.determinePlaybackOperation(method, this.vPlayer);

            if (window.mobileAnalyticsClient) {
                window.mobileAnalyticsClient.recordEvent( '_content.playback', this.stuffPlaybackAttributes(playbackOperation), this.buildPlaybackMetrics( playbackOperation, this.kidsPlayerContent.durationInSec, this.vPlayer.currentTime));
            }
            // End of AWS Mobile SDK Events
        },
        vToggleControls(show) {
            if (show) {
                this.vMainCtrls.style.display = 'block';
            } else {
                this.vMainCtrls.style.display = 'none';
            }
        },
        vCalcTimeLine: (duration) => {
            var duration = parseInt(duration, 10);
            var hours   = Math.floor(duration / 3600);
            var minutes = Math.floor((duration - (hours * 3600)) / 60);
            var seconds = duration - (hours * 3600) - (minutes * 60);

            // console.log('[calculateTimeLine | ]', hours, minutes, seconds);

            hours = hours ? (hours < 10 ? '0' + hours + ':' : hours + ':') : '';
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours + minutes + ':'+seconds;
        },
        vToggleFullscreen() {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                if (this.vContain.requestFullscreen) {
                    this.vContain.requestFullscreen();
                } else if (this.vContain.msRequestFullscreen) {
                    this.vContain.msRequestFullscreen();
                } else if (this.vContain.mozRequestFullScreen) {
                    this.vContain.mozRequestFullScreen();
                } else if (this.vContain.webkitRequestFullscreen) {
                    this.vContain.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }


            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                window.mobileAnalyticsClient.recordEvent( '_content.playback', this.stuffPlaybackAttributes('mode'), this.buildPlaybackMetrics('mode', 0, 0));
            }
            // End of AWS Mobile SDK Events

        },
        contentSeeked(event) {
            // console.log('[Player | contentSeeked | kidsPlayerContent | ]', this.kidsPlayerContent);

            var seekedPositionPercentage = parseInt(event.target.value);
            var seekedPositionAbsolute = (this.kidsPlayerContent.durationInSec * seekedPositionPercentage) / 100;


            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                window.mobileAnalyticsClient.recordEvent( '_content.playback', this.stuffPlaybackAttributes( 'seek'), this.buildPlaybackMetrics('seek', this.kidsPlayerContent.durationInSec, seekedPositionAbsolute));
            }
            // End of AWS Mobile SDK Events

        },
        determinePlaybackOperation(method, videoTag) {
            var playbackOperation = "Unknown";

            if (videoTag != undefined && method != "") {
                if (method == "play") {
                    if (videoTag.played.length == 0) {
                        playbackOperation = "start";
                    } else {
                        playbackOperation = "resume";
                    }
                } else {
                    playbackOperation = method;
                }
            }

            return playbackOperation;
        },
        buildPlaybackMetrics(operation, durationInSec, currentTime) {
            var playbackMetricsObj = {}
            if (operation == 'start' || operation == 'resume' || operation == 'stop'
                || operation == 'pause' || operation == 'complete') {
                var contentProgress = ((100 * currentTime)/durationInSec);
                playbackMetricsObj.progress = contentProgress;

                if (operation == 'stop' || operation == 'complete') {
                    playbackMetricsObj.stop_time = currentTime;
                } else {
                    playbackMetricsObj.start_time = currentTime;
                }
            } else if (operation == 'seek') {
                playbackMetricsObj.start_time = 0;
                playbackMetricsObj.stop_time = currentTime;
            }

            return playbackMetricsObj;
        },
        stuffCommonAttributes(eventAttributeObj) {
            var localAttributeObj = {}
            var geo_location = localStorage.getItem('geo_location');
            var altConfig = JSON.parse(localStorage.getItem('altConfig'));
            var deviceOrientation = this.getDeviceOrientation();

            if (geo_location) {
                geo_location = JSON.parse(geo_location);
                localAttributeObj = geo_location;
            }
            localAttributeObj.user_email = localStorage.getItem('user_email');
            localAttributeObj.user_id = localStorage.getItem('account_id');
            localAttributeObj.user_session = localStorage.getItem('token');
            localAttributeObj.user_name = localStorage.getItem('user_name');
            localAttributeObj.user_dob = localStorage.getItem('user_birthday');
            localAttributeObj.user_gender = localStorage.getItem('user_gender');
            localAttributeObj.app_env = altConfig.environment.title;
            localAttributeObj.event_mode = deviceOrientation;

            return localAttributeObj;
        },
        stuffPlaybackAttributes(action) {
            // console.log('[Player | stuffPlaybackAttributes | kidsPlayerContent ]', this.kidsPlayerContent);

            var eventAttributeObj = {};
            eventAttributeObj = this.stuffCommonAttributes(eventAttributeObj);

            eventAttributeObj.content_id = this.kidsPlayerContent ? this.kidsPlayerContent.id : 'N.A';
            eventAttributeObj.content_title = this.kidsPlayerContent ? this.kidsPlayerContent.title.toLowerCase() : 'N.A';
            eventAttributeObj.content_url = (this.kidsPlayerContent && this.kidsPlayerContent.stream) ? this.kidsPlayerContent.stream.streamUrl : 'N.A';
            eventAttributeObj.content_type = this.kidsPlayerContent ? this.kidsPlayerContent.contentType : 'N.A';
            eventAttributeObj.content_streamid = (this.kidsPlayerContent && this.kidsPlayerContent.stream) ? this.kidsPlayerContent.stream.streamId : 'N.A';
            eventAttributeObj.content_duration = this.kidsPlayerContent ? this.kidsPlayerContent.durationInSec : 'N.A';
            eventAttributeObj.event_action = action;

            return eventAttributeObj;
        },
        getUniqueProgressList(currItem, list) {
            // console.log('[Player | getUniqueProgressList | typeof list ]', typeof(list));
            // console.log('[Player | getUniqueProgressList | list ]', list);

            var index = -1;
            for (var i in list) {
                if (list[i].mediaId === currItem.mediaId) {
                    index = i;
                }
            }
            if (index > -1) {
                list[index] = currItem;
                return list;
            } else {
                list.push(currItem);
                return list;
            }
        },
        clearAndExitKidsMode() {
            // console.log('[Player | clearAndExitKidsMode | ]');
            localStorage.removeItem('altUser');
            localStorage.removeItem('altDevice');
            localStorage.removeItem('altAccount');
            localStorage.removeItem('altOrder');
            localStorage.removeItem('account_id');
            localStorage.removeItem('token');
            localStorage.removeItem('user_birthday');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_gender');
            localStorage.removeItem('user_name');
            localStorage.removeItem('altDefSearches');
            localStorage.removeItem('mediaProgressList');
            localStorage.setItem('altProfileMode', 'default');
            this.$router.push({ name: 'home' });
        },
        fetchPlaylist(callback) {
            // console.log('[Player | fetchPlaylist | ]');
            // console.log('[Player | fetchPlaylist | mediaId ]', this.mediaId);
            // console.log('[Player | fetchPlaylist | seriesId ]', this.seriesId);
            // console.log('[Player | fetchPlaylist | seasonId ]', this.seasonId);

            this.actGetEpisodes({
                seriesId: this.seriesId,
                seasonId: this.seasonId,
                limit: 80,
                offset: 0
            }).then((response) => {
                // console.log('[fetchPlaylist | response | ]', response);
                if (response.count) {
                    var playlist = new Array();
                    var slicePoint = 0;
                    for (var i in response.episodes) {
                        if (response.episodes[i].media_id == this.mediaId) {
                            slicePoint = parseInt(i);
                            continue;
                        }
                        playlist.push(this.parseContents(response.episodes[i]));
                    }
                    this.playerPlaylist = playlist.slice(slicePoint);

                    // console.log('[fetchPlaylist | playerPlaylist | ]', this.playerPlaylist);

                    if (this.playerPlaylist && this.playerPlaylist.length) {
                        var nextPlaylistItem = this.playerPlaylist[0];

                        // console.log('[fetchPlaylist | nextPlaylistItem | ]', nextPlaylistItem);

                        if (!nextPlaylistItem) return;

                        this.nextPlaylistMediaTitle = nextPlaylistItem.title;
                        this.nextPlaylistMediaSNo = nextPlaylistItem.noShow ? false : nextPlaylistItem.seasonNumber;
                        this.nextPlaylistMediaENo = nextPlaylistItem.noShow ? false : nextPlaylistItem.episodeNumber;
                    } else {
                        this.playerPlaylist = undefined;
                    }


                    // if (this.playerPlaylist && this.playerPlaylist.length > 1) {
                    //     var nextPlaylistItem = this.playerPlaylist[0];
                    //
                    //     // console.log('[fetchPlaylist | nextPlaylistItem | ]', nextPlaylistItem);
                    //
                    //     if (!nextPlaylistItem) return;
                    //
                    //     this.nextPlaylistMediaTitle = nextPlaylistItem.title;
                    //     this.nextPlaylistMediaSNo = nextPlaylistItem.seasonNumber;
                    //     this.nextPlaylistMediaENo = nextPlaylistItem.episodeNumber;
                    // }

                    if (callback) callback();
                }
            }, (error) => {
                // console.log('[fetchPlaylist | error | ]', error);
            });
        },
        exitKidsModeCB() {
            // console.log('[Player | exitKidsModeCB | ]');

            if (this.vPlayer && !this.vPlayer.paused) {
                this.vPlayer.pause();
            }
        },
        updateMediaProgress() {
            if (!this.vPlayer) return;

            var self = this;

            var duration = Math.round(this.vPlayer.duration);
            var currentTime = Math.round(this.vPlayer.currentTime);
            var progress = Math.round((currentTime / duration) * 100);

            var currItem = { mediaId: this.mediaId, progress, length: duration };

            return new Promise(function(resolve, reject) {
                self.actPutPlayerProgress({ media_id: self.mediaId, progress: Math.round(self.vPlayer.currentTime) }).then((response) => {
                    // console.log('[Player | vPlayerPausedCB | response | ]', response);


                }, (error) => {
                    // console.log('[Player | vPlayerPausedCB | error | ]', error);
                });

                if (localStorage.getItem('mediaProgressList')) {
                    var mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
                    var updtdProgList = self.getUniqueProgressList(currItem, mediaProgressList);

                    // console.log('[Player | updtdProgList | ]', updtdProgList);

                    localStorage.setItem('mediaProgressList', JSON.stringify(updtdProgList));
                } else {
                    var mediaProgressList = new Array();
                    mediaProgressList.push(currItem);
                    localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));
                }

                resolve(true);
            });
        }
    },
    created() {
        eventBus.$on('clearAndExitKidsModeEvent', this.clearAndExitKidsMode);
        eventBus.$on('exitKidsModeEvent', this.exitKidsModeCB);
    },
    mounted() {
        if (this.appActive) {
            // console.log('[Player | mounted | kidsPlayerContent | ]', this.kidsPlayerContent);

            if (this.kidsPlayerContent) {
                this.initMountedPlayerScreen();
            } else {
                this.initActivePlayerScreen();
            }
        }
    },
    components: {
        'kids-header': Header,
        'alt-modals': Modals,
    },
    beforeRouteLeave: (to, from, next) => {
        store.commit('setRouterFromParam', from);
        next();
    },
    beforeDestroy() {
        eventBus.$off('clearAndExitKidsModeEvent');
        eventBus.$off('exitKidsModeEvent');
    },
    mixins: [altMixins]
}
</script>
