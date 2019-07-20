<template>
  <div class="v-contain" id="v-contain">
    <video id="v-poster" class="v-player player-default" style="width:100%;" :poster="plrPosterImage" :src="silentTrack"></video>

    <video id="v-player" class="v-player player-default" style="width:100%;" :poster="plrPosterImage" :src="silentTrack"></video>

    <div class="v-cmup-nxt" v-show="showComUpNextTag" @click="playComUpNextItem(true)">
      <div class="v-cmup-nxt-bx">
        <div class="v-cmnxtbx-img">
          <img :src="nextEpisodeImage" alt="v-cmngup">
        </div>
        <div class="v-cmnxtbx-text" >
          <p style="font-size:15px;font-weight:bold;">NEXT EPISODE IN {{showComUpNextTimeNextEpisodeCountDown}} </p>
          <p v-show="nextPlaylistMediaTitle" style="padding: 2px 2px 6px;font-size: 12px;font-weight: normal;">{{nextPlaylistMediaTitle}}</p>
          <p style="font-size: 12px;font-weight: bold;"><span v-show="nextPlaylistMediaSNo">S{{nextPlaylistMediaSNo}}</span><span v-show="nextPlaylistMediaENo">| E{{nextPlaylistMediaENo}}</span></p>
          <img src="../../assets/player/v2/ic_Play.png" class="play-icon-on-player-nextEpisode">
        </div>
      </div>
    </div>

    <img src="/src/assets/player/v2/ic_Play.png" alt="v-pause" @click="playContent" v-show="showOnlyPlayButton" style="display: inline-block;width: 13%;position: absolute;top: 50%;left: 46%;z-index: 980;width: 34px;">

    <div v-if="ShowSkipTag" @click="skipActionForward">
      <span class="skipTag">SKIP INTRO</span>
    </div>

    <popup-episode-listing v-show="showPopupEpisodeList"></popup-episode-listing>
    <popup-player-video-resolution v-show="showVideoResolution"></popup-player-video-resolution>

    <div class="v-controls" id="v-controls" style="display:none">
      <div class="v-toggle" id="v-toggle">
        <img src="../../assets/player/v2/backward.png" alt="v-backward" id="v-backward">
        <img src="../../assets/player/v2/ic_Play.png" alt="v-pause" id="v-kids-toggler">
        <img src="../../assets/player/v2/ic_Next_Episode.png" alt="v-ic_Next_Episode" id="v-ic_Next_Episode" style="width:43px;" v-show="gt_next_episode_id && !showTagTrailer" @click="playComUpNextItem(false)">
        <img src="../../assets/player/v2/forward.png" alt="v-forward" id="v-forward">
      </div>
      <div class="v-main-ctrls" id="v-main-ctrls" style="display: none;">
        <div class="v-group left-group">
          <span class="v-text v-timer" id="v-current-time">00:00</span>
        </div>
        <div class="v-group v-bar">
          <input type="range" value="0" min="0" max="100" class="v-progress" id="v-progress" style="display:none">
        </div>

        <div class="v-group right-group">
          <span class="v-text v-timer" id="v-duration" style="margin-right: 8px;">00:00</span>
          <!-- <div class="v-icon" id="v-fullsrc-switch">
          <img src="../../assets/player/full-screen.svg" alt="button-fullscreen">
        </div> -->
      </div>
      <div class="player-footer-icon-list">
        <img src="../../assets/player/v2/ic_episodes.png" alt="v-episodesList" id="v-episodesList" style="width:31px" v-if="episodeIdentifier">
        <img src="../../assets/player/v2/ic_VideoQuality.png" alt="v-VideoQuality" id="v-VideoQuality" @click="vPlayerVideoQuality">
      </div>
    </div>
    <div class="v-main-header" id="v-main-header" style="display: none;">
      <div style="display:inline-flex;padding: 11px;">
        <div class="player-header-episode" v-if="headerEpisodeDetails && headerEpisodeDetails.seasonNumber && headerEpisodeDetails.episodeNumber && !showTagTrailer">
          <h3 >S{{headerEpisodeDetails.seasonNumber}}</h3>
          <h3 class="header-season-details"> | E{{headerEpisodeDetails.episodeNumber}}</h3>
        </div>
        <div v-if="showTagTrailer">
          <span class=" player-header-episode">TRAILER</span>
        </div>
        <div class="">
          <h3 v-if="playerContent && playerContent.title" class="player-title">{{makeTitleUpperCase(playerContent.title)}}</h3>
        </div>
      </div>
      <div id="player-cast">
        <google-cast-launcher class="chrome-cast-icon"></google-cast-launcher>
      </div>
    </div>
  </div>

  <div id="v-loader-play" class="v-loader" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998;display:none;">
    <div class="loading" style="position: relative;width: 56px;height: 56px;margin: 0 auto;top: 50%;transform: translateY(-50%);">
      <div class="inner"></div>
    </div>
  </div>

  <div id="v-loader" class="v-loader" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998;" v-show="showVideoLoader">
    <div class="loading" style="position: relative;width: 56px;height: 56px;margin: 0 auto;top: 50%;transform: translateY(-50%);">
      <div class="inner"></div>
    </div>
  </div>
</div>
</template>

<script>
  import shaka from 'shaka-player';
  import { eventBus } from '@/main';
  import { altMixins } from '@/mixins';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  const PopupEpisodesList = () => import(/* webpackChunkName: "PopupFBStateSelect" */ '@/components/shared/PopupEpisodesList.vue');
  const PopupVideoResolutionChange = () => import(/* webpackChunkName: "PopupFBStateSelect" */ '@/components/shared/PopupVideoResolutionChange.vue');

  export default {
    data() {
      return {
        contentName: undefined,
        id: undefined,
        altUser: undefined,
        altOrder: undefined,
        contentType: undefined,
        contentId: undefined,
        episodeId: undefined,
        seriesId: undefined,
        mediaId: undefined,
        seasonId: undefined,
        progressId: undefined,
        seriesSeasons: undefined,
        manifestUrl: undefined,
        licenseUrl: undefined,
        drmTicket: undefined,
        trailerEnabled: undefined,
        loadedContent: undefined,
        showVideoLoader: true,
        altPlayer: undefined,
        videoTag: undefined,
        isPlayerReady: false,
        isPlayerPlaying: false,
        currentTime: '00:00',
        duration: '00:00',
        durationInSec: undefined,
        playTime: 0,
        seekPosition: 0,
        videoStep: 0,
        videoTimer: 0,
        contentRestricted: false,
        contentGeoBlocked: false,
        contentDrmBlocked: false,
        showLoginTag: false,
        showSubTag: false,
        showRentTag: false,
        videoCanPlay: false,
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
        trailerPlayFlag: true,
        continueProgress: undefined,
        playerPlaylist: undefined,
        playlistEpisodes: new Array(),
        playlistEpisodeCount: 0,
        playListPosition: 0,
        currentPlaylistItem: undefined,
        nextPlaylistItem: undefined,
        playlistCallbackEvent: false,
        toggleControlTimer: undefined,
        toggleCtrlTimerTime: 5000,
        nextPlaylistMediaTitle: undefined,
        nextPlaylistMediaSNo: undefined,
        nextPlaylistMediaENo: undefined,
        nextPlaylistPosition: 0,
        showComUpNextTag: false,
        showComUpNextTime: undefined,
        showComUpNextTimeNextEpisode: undefined,
        showComUpNextTimeNextEpisodeCountDown:0,
        replayFlag: true,
        showDrmNotSupportError: true,
        showEnablePcError: true,
        limit: 50,
        offset: 0,
        comingSoonTag: false,
        plrPosterImage: undefined,
        plrDuration: undefined,
        plrStreamAvailable: false,
        plrStreamUrl: undefined,
        plrIsStreamDrm: false,
        plrStreamId: undefined,
        plrTrailerAvailable: false,
        plrTrailerUrl: undefined,
        plrIsTrailerDrm: false,
        plrTrailerId: undefined,
        plrVideoUrl: undefined,
        plrIsDrmVideo: false,
        plrVideoLoaded: false,
        plrVideoEnded: false,
        plrContentLength: undefined,
        plrLoadedVideoType: undefined,
        silentTrack: '/src/assets/silent-track.mp3',
        plrInitialized: false,
        showTagTrailer: false,
        showTagComingsoon: false,
        showTagLogin: false,
        showTagSubscribe: false,
        showTagRentTvod: false,
        playNextPlaylistItemFlag: false,
        isVPlayerBuffering: false,
        playRelatedEpisodeClickFlag: false,
        contentSeekStartTime: undefined,
        contentSeekStopTime: undefined,
        contentBufferStartTime: undefined,
        contentBufferStopTime: undefined,
        countBufferFlag: false,
        webenageState: "null",
        crossDomainCheck : true,
        showTagGeoCta:false,
        trailerCountinueGeoCheck:false,
        showTagGeoCtaCheck:false,
        flagRouteChanged: false,
        bufferStartTime: 0,
        gt_next_episode_thumbnail_url:undefined,
        gt_next_episode_description:undefined,
        gt_next_episode_id:undefined,
        completeEventChecker:false,
        currentAWSEvent:undefined,
        vForward:undefined,
        vBackward:undefined,
        flagVideoTag:false,
        episodeIdentifier:false,
        headerEpisodeDetails:undefined,
        playerVideoTrackList:[],
        showPopupEpisodeList:false,
        showVideoResolution:false,
        ShowSkipTag:false,
        nextEpisodeImage:false,
        skipIntroEventFlag:true,
        checkChromeCast:undefined,
        plrLoadedVideoTypeMovieTrailer: undefined,
        nextEpisodePlayLoadMainfest:undefined,
        eventContentViewData:undefined,
        returnFromLoadAfterStop:false,
        loaderCheck:undefined,
        episodePopupPlayState:undefined,
        videoResolutionPopupState:undefined,
        containInfoDetails : undefined,
        showOnlyPlayButton : undefined,
      };
    },
    computed: {
      ...mapGetters([
        'appActive',
        'playerContent',
        'relatedEpisodes',
        'previewEnabled',
        'videoPoster',
        'altMessages',
        'chromecastState',
        'onboardPlayer',
        // Getter defined in home.js store. Used to get the title of the active section in the page. Based on this, we identify, whether the content clicked is from watching section or not
        'homeActiveSectionTitle'
      ]),
    },
    watch: {
      appActive() {
        this.initActivePlayerScreen();
      },
      '$route'(to, from) {
        this.flagRouteChanged = true;
        this.routeChangeCB();
        this.initRoutePlayerScreen();
      },
    },
    methods: {
      ...mapMutations([
        'setPlayerContent',
        'setVideoPoster',
        'setTrailerAvailable',
        'setShowTrailerButton',
        'setShowMovieButton',
        'setRouterFromParam',
        'setEpisodeListing',
        'setPlayerVideoResolution',
        'setRelatedEpisodes',
        'setCurrentShowPlaylists',
        'setCurrentEpisodeInfo',
        'setPopupPlaylist'
      ]),
      ...mapActions([
        'actGetMediaSeries',
        'actGetMediaVideo',
        'actGetSingleEpisode',
        'actGetEpisodes',
        'actGetMediaAccess',
        'actGetDrmTickt',
        'actGetPlayerProgress',
        'actPutPlayerProgress',
        'actGetSeriesSeasons',
        'actAddtoFavouriteMedia',
        'actGetMediaGeoAccess',
      ]),
      initActivePlayerScreen() {
        this.initMountedPlayerScreen();
      },
      initRoutePlayerScreen() {
        this.showComUpNextTag = false;
        this.plrVideoLoaded = false;

        this.plrVideoEnded = false;
        this.contentDrmBlocked = false;
        this.limit = 50;
        this.offset = 0;
        this.playlistEpisodeCount = 0;
        this.playlistEpisodes = new Array();
        this.skipIntroEventFlag = false;
        this.checkChromeCast = false;
        this.plrLoadedVideoTypeMovieTrailer = false;
        this.nextEpisodePlayLoadMainfest = true;
        this.eventContentViewData = false;
        this.loaderCheck = false;

        // hide add to fav error popup **** 24.03.2018
        eventBus.$emit('toggleVideoAddToFavError', false);
        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "relative";
        }

        if (this.vPlayer) {
          this.vToggleLoader(true);
          this.toggleControls(false);
          this.vToggleToggler(false, 'initRoutePlayerScreen');
          this.vToggleMainControls(false);
        }

        this.initMountedPlayerScreen();
      },
      initMountedPlayerScreen() {
        this.hideVideoController(false);

        this.hidePosterPlayerScreen("block","none");

        this.setPlayerContent(undefined);

        this.comingSoonTag = false;
        this.showLoginTag = false;
        this.showSubTag = false;
        this.showRentTag = false;
        this.contentRestricted = false;
        this.contentGeoBlocked = false;
        this.showComUpNextTag = false;
        this.showDrmNotSupportError = true;
        this.showEnablePcError = true;

        // NOTE: CODE UPDATE @SANGEETH
        // NOTE: Applicable only for Kids Mode. In kids mode, the only way user will play the content is through the popup player. The data @ property containInfoDetails is required. If not, return.
        let altProfileMode;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        }

        if (altProfileMode === 'kids' && !this.containInfoDetails) return;
        // NOTE: END CODE UPDATE

        // NOTE fromOutSideClick play contain details
        if(this.containInfoDetails) {
          this.contentName = this.containInfoDetails.contentName;
          this.id = this.containInfoDetails.id;
        } else {
          this.contentName = this.$route.name;
          this.id = this.$route.params.id;
        }

        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "relative";
        }

        if (this.contentName == 'show') {
          this.seriesId = this.id;
          this.processSeriesContent();
        } else if (this.contentName == 'media' || this.contentName == 'episode') {
          this.mediaId = this.id;
          this.processMediaContent();
        }
      },
      outputUpdate(vol) {
        var output = document.querySelector("#volume");
        output.value = vol;
        output.style.left = vol + 'px';
      },
      skipActionForward() {
        if(this.vPlayer && this.vPlayer.currentTime && this.playerContent && this.playerContent.skipIntro) {
          this.ShowSkipTag = false;
          let current_time = this.vPlayer.currentTime;
          let endTime = this.playerContent.skipIntro.endskipintro ? parseInt(this.playerContent.skipIntro.endskipintro) : undefined;
          if(endTime) {
            this.vPlayer.currentTime = endTime;
          }

          let duration = undefined;
          duration = (endTime - current_time);
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();
            eventAttributeObj.start_time = current_time ? current_time : 'N.A';
            eventAttributeObj.stop_time = endTime ? endTime : 'N.A';
            eventAttributeObj.duration = duration ? duration : 'N.A';
            window.mobileAnalyticsClient.recordEvent('_skip.intro', eventAttributeObj, {});
          }

        }
      },
      makeTitleUpperCase(title) {
        return title.toUpperCase();
      },
      filterVideoTrackList(tracks) {
        var first = tracks[0].height;
        var contener = [];
        contener.push(tracks[0]);
        tracks.shift();
        for(let i in  tracks) {
          if(first == tracks[i].height) {
            break;
          }
          contener.push(tracks[i]);
        }
        contener.sort(function(a,b) {
          return a.height - b.height;
        });
        return contener;
      },
      vPlayerVideoQuality() {
        // console.log('[vPlayerVideoQuality > this.vShaka]', this.vShaka);

        if(this.vShaka) {
          let videoTracksList = undefined;
          let filterTracks = undefined;
          videoTracksList = this.vShaka.getVariantTracks();
          filterTracks = this.filterVideoTrackList(videoTracksList);
          this.filterVideoResolutation(filterTracks);
          this.twoSeratePart();
        }

        eventBus.$emit("togglePlayerVideoResolution", true);
      },
      twoSeratePart() {
        var partOne =[];
        var partTwo = [];
        var part = [];
        for(let j = 0 ;j < this.playerVideoTrackList.length;j++) {
          if(j % 2 == 0) {
            partOne.push(this.playerVideoTrackList[j]);
          } else {
            partTwo.push(this.playerVideoTrackList[j]);
          }
        }
        part.push(partOne);
        part.push(partTwo);
        this.setPlayerVideoResolution(part);
      },
      filterVideoResolutation(videoTracksList) {
        localStorage.setItem("videoResolution",JSON.stringify(videoTracksList));

        if(this.playerVideoTrackList && this.playerVideoTrackList.length > 0) {
          return;
        }
        let qualitySelection = undefined;
        let config = undefined;
        config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;

        qualitySelection = (config && config.qualitySelection && config.qualitySelection.options) ? config.qualitySelection.options : undefined;

        if(!qualitySelection) {
          return;
        }
        let quality;
        let autoData = {};
        for(let i in qualitySelection) {
          quality = parseInt(qualitySelection[i].bitrateIndex);
          if(quality >= 0) {
            videoTracksList[quality].info = qualitySelection[i].info;
            videoTracksList[quality].title = qualitySelection[i].title;
            this.playerVideoTrackList.push(videoTracksList[quality]);
          } else {
            autoData.info = qualitySelection[i].info;
            autoData.title = qualitySelection[i].title;
            this.playerVideoTrackList.push(autoData);
          }
        }
      },
      processSeriesContent() {
        var altProfileMode = undefined;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        } else {
          altProfileMode = 'default';
          localStorage.setItem('altProfileMode', altProfileMode);
        }

        this.getTheContents(() => {
          if (!this.playerContent) return;

          if (altProfileMode == 'kids' && !this.playerContent.kidsContent) {
            this.$router.push({ name: 'home' });
            return;
          }

          this.getSeriesSeasons(() => {
            this.getSeriesEpisodes(() => {
              this.renderSeriesScreen();
            });
          });
        });
      },
      renderSeriesScreen() {
        // Initially reset the flags
        this.showTagTrailer = false;
        this.showTagComingsoon = false;
        this.showTagLogin = false;
        this.showTagSubscribe = false;
        this.showTagRentTvod = false;

        this.configurePlayerMetadata();

        // Set the progressId to undefined, because trailer doesn't have continue play
        this.progressId = undefined;

        // Disable the coming up next tag
        this.showComUpNextTime = false;
        this.showComUpNextTimeNextEpisode = false;
        this.showComUpNextTimeNextEpisodeCountDown = 0;

        // Check whether the video url of the trailer comes in as stream or trailer
        // If trailer url comes as part of stream data
        if (this.playerContent && this.playerContent.stream) {
          this.plrVideoUrl = this.plrStreamUrl;
          this.plrIsDrmVideo = this.plrIsStreamDrm;
          // If trailer url comes as part of trailer data
        } else if (this.playerContent && this.playerContent.trailer) {
          this.plrVideoUrl = this.plrTrailerUrl;
          // Trailer url will always be non-DRM
          this.plrIsDrmVideo = false;
        }

        // Set the restricted flag to false
        this.contentRestricted = false;

        // Check the user state
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // initialize the player
        this.configurePlayer(() => {
          // Show the screen loader when initialized
          this.vToggleLoader(true);

          // rendering player based on user type
          if (altUser) {
            if (this.plrIsDrmVideo) {
              this.configureDrmPlayback(() => {
                // Show the play button for first time
                // this.vUpdateButton();
                // Hide the loader
                this.vToggleLoader(false);

                this.toggleLoader(false);

                // Notify the player that the loaded content is trailer
                this.plrLoadedVideoType = 'trailer';
              });
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);

              this.toggleLoader(false);

              // NOTE this for play trailer only @@@
              if(this.containInfoDetails) {
                this.vToggleLoader(false);
                this.toggleLoader(false);
                this.showOnlyPlayButton = true;
              }

              // Notify the player that the loaded content is trailer
              this.plrLoadedVideoType = 'trailer';
            }
          } else {
            // If anonymous user, and content is DRM, don't play the content.
            // instead hide the controls
            if (this.plrIsDrmVideo) {
              this.toggleControls(false);
              this.vToggleToggler(false, 'renderSeriesScreen');
              this.vToggleMainControls(false);
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);
            }

            this.toggleLoader(false);
            // NOTE this for play trailer only @@@
            if(this.containInfoDetails) {
              this.vToggleLoader(false);
              this.toggleLoader(false);
              this.showOnlyPlayButton = true;
            }

            // Notify the player that the loaded content is trailer
            this.plrLoadedVideoType = 'trailer';
          }
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          if(this.eventContentViewData) {
            return;
          }

          eventAttributeObj.content_id =  (this.playerContent && this.playerContent.seriesId) ? this.playerContent.seriesId : 'N.A';
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_url = "/media/series/" + (this.playerContent && this.playerContent.seriesId) ? this.playerContent.seriesId : 'N.A';
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.content_source = localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : 'category';

          this.eventContentViewData = eventAttributeObj;

          window.mobileAnalyticsClient.recordEvent('_content.view', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      geoCtaCheck () {
        if (this.vPlayer && !this.vPlayer.paused) {
          this.vPlayer.pause();
        }
        this.vExitFullScreenMode();
        eventBus.$emit('toggleGeoBlockEvent', true);
      },
      processMediaContent() {
        var altProfileMode = undefined;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        } else {
          altProfileMode = 'default';
          localStorage.setItem('altProfileMode', altProfileMode);
        }

        this.getTheContents(() => {

          if (!this.playerContent) return;

          if (altProfileMode == 'kids' && !this.playerContent.kidsContent) {
            this.$router.push({ name: 'home' });
            return;
          }
          switch (this.playerContent.contentType) {
            case 'trailer':
            this.processTrailerContent();
            break;
            case 'movie':
            this.processMovieContent();
            break;
            case 'poster':
            this.processPosterContent();
            break;
            case 'episode':
            this.processEpisodeContent();
            break;
            default:
          }
        });
      },
      setContentInformationLocal(contentNode) {
        if (contentNode != undefined) {
          if (contentNode.contentId == undefined) {
            if (contentNode.contentType == 'series') {
              localStorage.setItem('awsContentId', contentNode.seriesId);
            }
          } else {
            localStorage.setItem('awsContentId', contentNode.contentId);
          }
          localStorage.setItem('awsContentTitle', contentNode.title);
          localStorage.setItem('awsContentType', contentNode.contentType);
          localStorage.setItem('awsContentDuration', contentNode.durationInSec);
        }
      },
      processTrailerContent() {
        this.playerPlaylist = undefined;
        this.renderTrailerScreen();
      },
      renderTrailerScreen() {
        this.configurePlayerMetadata();

        // Set the progressId to undefined, because trailer doesn't have continue play
        this.progressId = undefined;

        // Check whether the video url of the trailer comes in as stream or trailer
        // If trailer url comes as part of stream data

        // NOTE: Code change for coming-soon content
        // Detected Android app and website not playing the content
        // Showing poster only
        // Plays the content only when user clicks on trailer button
        // Code added by sangeeth_ks (10-01-2018)
        if (this.playerContent && this.playerContent.trailer) {
          this.plrVideoUrl = this.plrTrailerUrl;
          // Trailer url will always be non-DRM
          this.plrIsDrmVideo = false;
        } else {
          // NOTE added by sumit 22.03.2018 for Trailer data
          this.plrVideoUrl = this.playerContent.stream.streamUrl;
        }

        // Check the user state
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // initialize the player
        this.configurePlayer(() => {
          // Show the screen loader when initialized
          this.vToggleLoader(true);

          // rendering player based on user type
          if (altUser) {
            if (this.plrIsDrmVideo) {
              this.configureDrmPlayback(() => {
                // Show the play button for first time
                // this.vUpdateButton();
                // Hide the loader
                this.vToggleLoader(false);
                this.toggleLoader(false);

                // Notify the player that the loaded content is trailer
                this.plrLoadedVideoType = 'trailer';
              });
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);
              this.toggleLoader(false);

              // Notify the player that the loaded content is trailer
              this.plrLoadedVideoType = 'trailer';
            }
          } else {
            // If anonymous user, and content is DRM, don't play the content.
            // instead hide the controls
            if (this.plrIsDrmVideo) {
              this.toggleControls(false);
              this.vToggleToggler(false, 'renderTrailerScreen');
              this.vToggleMainControls(false);
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);
            }

            this.toggleLoader(false);

            // Notify the player that the loaded content is trailer
            this.plrLoadedVideoType = 'trailer';
          }
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          if(this.eventContentViewData) {
            return;
          }

          eventAttributeObj.content_id = this.playerContent.contentId;
          eventAttributeObj.content_title = this.playerContent.title.toLowerCase();
          eventAttributeObj.content_url = "/media/video/" + this.playerContent.contentId;
          eventAttributeObj.content_type = this.playerContent.contentType;
          eventAttributeObj.content_source = localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : 'category';

          this.eventContentViewData = eventAttributeObj;

          window.mobileAnalyticsClient.recordEvent( '_content.view', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      processEpisodeContent() {
        this.seriesId = this.playerContent.seriesId;
        this.seasonId = this.playerContent.seasonId;
        this.episodeIdentifier = true;

        this.showTagTrailer = false;
        this.showTagComingsoon = false;
        this.showTagLogin = false;
        this.showTagSubscribe = false;
        this.showTagGeoCta = false;

        const postGetEpisodes = () => {
          if (localStorage.getItem('altUser')) {
            this.getMediaAccess(() => {
              this.renderEpisodeScreen();
            });
          } else {
            this.renderEpisodeScreen();
          }
        }

        // Checking the active tab is watching or not. If watching, we don't need to create the playlist with episodes. Play only single selected content.
        if (this.homeActiveSectionTitle === 'Watching') {
          postGetEpisodes();
        } else {
          this.getSeriesEpisodes(() => {
            postGetEpisodes();
          });
        }
      },
      renderEpisodeScreen() {
        // Initially reset the flags
        this.showTagTrailer = false;
        this.showTagComingsoon = false;
        this.showTagLogin = false;
        this.showTagSubscribe = false;
        this.showTagRentTvod = false;

        this.configurePlayerMetadata();

        // Disable all the trialer data, because for episode rendering, trailer data is not required
        this.plrTrailerAvailable = false;
        this.plrTrailerUrl = undefined;
        this.plrIsTrailerDrm = false;
        this.plrTrailerId = undefined;

        if (!this.playerContent) return;

        this.headerEpisodeDetails = {"episodeNumber":this.playerContent.episodeNumber ? this.playerContent.episodeNumber : " ","seasonNumber":this.playerContent.seasonNumber ? this.playerContent.seasonNumber : ""};

        // Setting the progressId for getting and setting the media progress.
        this.mediaId = this.progressId = this.playerContent.id;
        // Set the time to display the coming up next tag
        this.showComUpNextTime = this.playerContent.nextIn ? this.playerContent.nextIn : 15;
        // this.showComUpNextTimeNextEpisode = this.showComUpNextTime;

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (this.playerContent && this.playerContent.stream) {
          this.plrVideoUrl = this.playerContent.stream.streamUrl;
        }

        // To handle the continue playback when the user come back to previously played content
        var prevPlayedMediaId = undefined;
        if (localStorage.getItem('prevPlayedMediaId')) {
          prevPlayedMediaId = localStorage.getItem('prevPlayedMediaId');
        }

        // If previous played content id matched with the current id of the media, clear the contious playback event and stop playing
        if (this.id == prevPlayedMediaId) this.playlistCallbackEvent = false;

        this.configurePlayer(() => {
          this.vToggleLoader(true);

          this.plrLoadedVideoType = 'episode';

          if (altUser) {
            this.getPlayerProgress(() => {
              // If user data exists, treal all the episodes as drm content, inorder to add them to the watching list

              // Check the restriction state of the content
              if (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamUrl && (this.playerContent.isFreeContent || this.playerContent.userHasAccess)) {

                // no restriction to play the content
                this.plrIsDrmVideo = true;
                this.contentRestricted = false;
              } else {
                this.plrIsDrmVideo = false;
                this.contentRestricted = true;
              }

              // Hide the loader
              this.vToggleLoader(false);
              this.toggleLoader(false);

              this.hideVideoController(true);

              if (this.playlistCallbackEvent) {
                this.vTogglePlay();
              }
            });
          } else {
            // Check the restriction state of the content
            if (this.playerContent.stream && this.playerContent.stream.streamUrl && this.playerContent.anonymousAccess) {
              this.contentRestricted = false;
            } else {
              this.contentRestricted = true;
            }

            // Hide the loader
            this.vToggleLoader(false);
            this.vToggleToggler(true, 'renderEpisodeScreen');
            this.toggleControls(true);
            this.toggleLoader(false);

            if (this.playlistCallbackEvent) {
              this.vTogglePlay();
            }
          }
        });

        // NOTE: Code for Analytics
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;

          eventAttributeObj.content_id = this.playerContent.contentId;
          eventAttributeObj.content_title = content_title.toLowerCase();
          eventAttributeObj.content_url = "/media/video/" + this.playerContent.contentId;

          if (this.playerContent && this.playerContent.seriesId) {
            // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
          }

          if (this.playerContent && this.playerContent.seriesTitle) {
            eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
          }

          eventAttributeObj.content_type = this.playerContent.contentType;
          eventAttributeObj.content_source = localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : 'category';

          if(this.eventContentViewData) {
            return;
          }

          this.eventContentViewData = eventAttributeObj;

          window.mobileAnalyticsClient.recordEvent('_content.view', eventAttributeObj, {});
        }
        // NOTE: Endof Code for Analytics
      },
      processMovieContent() {
        this.playerPlaylist = undefined;

        if (localStorage.getItem('altUser')) {
          this.getMediaAccess(() => {
            this.renderMovieScreen();
          });
        } else {
          this.renderMovieScreen();
        }
      },
      renderMovieScreen() {
        // Initially reset the flags
        this.showTagTrailer = false;
        this.showTagComingsoon = false;
        this.showTagLogin = false;
        this.showTagSubscribe = false;
        this.showTagRentTvod = false;
        this.showTagGeoCta = false;

        this.showTagGeoCtaCheck = false;

        this.configurePlayerMetadata();

        this.mediaId = this.progressId = this.playerContent.contentId;

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        this.configurePlayer(() => {
          this.vToggleLoader(true);
          if (altUser) {
            // If user data exists, treal all the episodes as drm content, inorder to add them to the watching list

            // Check the restriction state of the content
            if (this.playerContent.isFreeContent || this.playerContent.userHasAccess) {
              // no restriction to play the content
              this.contentRestricted = false;

              if (this.playerContent.stream) {
                this.plrVideoUrl = this.playerContent.stream.streamUrl;
                this.plrLoadedVideoType = 'movie';
                this.plrIsDrmVideo = true;
              } else if (this.playerContent.trailer) {
                this.plrVideoUrl = this.playerContent.trailer.trailerUrl;
                this.plrLoadedVideoType = 'trailer';
                this.plrIsDrmVideo = false;

                this.contentGeoBlocked = false;
              } else {
                this.toggleControls(false);
                this.vToggleToggler(false, 'renderMovieScreen');
                this.vToggleLoader(false);
              }
            } else if (this.playerContent.trailer) {
              this.plrVideoUrl = this.playerContent.trailer.trailerUrl;
              this.plrLoadedVideoType = 'trailer';
              this.plrIsDrmVideo = false;

              this.contentRestricted = false;
              this.contentGeoBlocked = false;
            } else {
              this.contentRestricted = true;
              return;
            }

            this.getPlayerProgress(() => {
              // Hide the loader
              this.vToggleLoader(false);
              this.toggleLoader(false);
            });
          } else {
            if (this.playerContent.anonymousAccess && this.playerContent.stream) {
              this.plrVideoUrl = this.playerContent.stream.streamUrl;
              this.plrIsDrmVideo = false;
              this.plrLoadedVideoType = 'movie';

              this.contentRestricted = false;
              this.contentGeoBlocked = false;
            } else if (this.playerContent.trailer) {
              this.plrVideoUrl = this.playerContent.trailer.trailerUrl;
              this.plrIsDrmVideo = false;
              this.plrLoadedVideoType = 'trailer';

              this.contentRestricted = false;
              this.contentGeoBlocked = false;
            } else {
              this.toggleControls(false);
              this.vToggleToggler(false, 'renderMovieScreen else');
              this.vToggleLoader(false);
            }
            this.vToggleLoader(false);
            this.toggleLoader(false);
          }
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = this.playerContent.contentId;
          eventAttributeObj.content_title = this.playerContent.title.toLowerCase();
          eventAttributeObj.content_url = "/media/video/" + this.playerContent.contentId;
          eventAttributeObj.content_type = this.playerContent.contentType;
          eventAttributeObj.content_source = localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : 'category';

          if(this.eventContentViewData) {
            return;
          }

          this.eventContentViewData = eventAttributeObj;

          window.mobileAnalyticsClient.recordEvent('_content.view', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      processPosterContent() {
        this.playerPlaylist = undefined;
        this.renderPosterScreen();
      },
      renderPosterScreen() {
        this.configurePlayerMetadata();

        // Set the progressId to undefined, because trailer doesn't have continue play
        this.progressId = undefined;

        // For content type as poster, trailer or stream will not be there
        this.plrVideoUrl = undefined;

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // initialize the player
        this.configurePlayer(() => {
          // If no video url available for poster media
          if (!this.plrVideoUrl) {
            this.toggleControls(false);
            this.vToggleToggler(false, 'renderPosterScreen');
            this.vToggleMainControls(false);
            this.vToggleLoader(false);
            this.toggleLoader(false);
            return;
          }

          // Show the screen loader when initialized
          this.vToggleLoader(true);
          this.toggleLoader(false);

          // rendering player based on user type
          if (altUser) {
            if (this.plrIsDrmVideo) {
              this.configureDrmPlayback(() => {
                // Show the play button for first time
                // this.vUpdateButton();
                // Hide the loader
                this.vToggleLoader(false);

                // Notify the player that the loaded content is trailer
                this.plrLoadedVideoType = 'poster';
              });
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);

              // Notify the player that the loaded content is trailer
              this.plrLoadedVideoType = 'poster';
            }
          } else {
            // If anonymous user, and content is DRM, don't play the content.
            // instead hide the controls
            if (this.plrIsDrmVideo) {
              this.toggleControls(false);
              this.vToggleToggler(false, 'renderPosterScreen altUser');
              this.vToggleMainControls(false);
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);
            }

            // Notify the player that the loaded content is trailer
            this.plrLoadedVideoType = 'poster';
          }
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = this.playerContent.contentId;
          eventAttributeObj.content_title = this.playerContent.title.toLowerCase();
          eventAttributeObj.content_type = this.playerContent.contentType;
          eventAttributeObj.content_source = localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : 'category';

          if(this.eventContentViewData) {
            return;
          }

          this.eventContentViewData = eventAttributeObj;

          window.mobileAnalyticsClient.recordEvent( '_content.view', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events
      },
      configurePlayerMetadata() {
        if (!this.playerContent) return;

        this.comingSoonTag = this.playerContent.comingSoon;
        this.plrPosterImage = (this.playerContent.images && this.playerContent.images.cover) ? this.playerContent.images.cover : '/src/assets/alt-cover.jpg';
        this.plrDuration = this.playerContent.durationInSec ? this.playerContent.durationInSec : 0;

        if (this.playerContent.stream) {
          this.plrStreamAvailable = true;
          this.plrStreamUrl = this.playerContent.stream.streamUrl ? this.playerContent.stream.streamUrl : undefined;
          this.plrStreamId = this.playerContent.stream.streamId ? this.playerContent.stream.streamId : undefined;
          this.plrIsStreamDrm = this.playerContent.stream.drm;
        }

        if (this.playerContent.trailer) {
          this.plrTrailerAvailable = true;
          this.plrTrailerUrl = this.playerContent.trailer.trailerUrl ? this.playerContent.trailer.trailerUrl : undefined;
          this.plrTrailerId = this.playerContent.trailer.trailerId ? this.playerContent.trailer.trailerId : undefined;
        }

        if (this.comingSoonTag) {
          this.showTagComingsoon = true;
        } else {
          this.showTagComingsoon = false;
        }

        let geoStatus = undefined;
        if(this.playerContent && this.playerContent.geoBlock) {
          geoStatus = this.geoBlockCountryWise(this.playerContent.geoBlock);
          if(geoStatus) {
            this.plrPosterImage = '/src/assets/alt-cover.jpg';
            eventBus.$emit('toggleCountrywiseVideoBlock', true);
            return;
          }
        }


      },
      loginRedirection() {
        var routeObj = {
          fullPath: this.$route.fullPath,
          name: this.$route.name,
          params: this.$route.params,
          path: this.$route.path,
          query: this.$route.query,
          extra: {
            name: 'player'
          }
        };

        this.setRouterFromParam(routeObj);
        this.$router.push({ name: 'login'});
      },
      configurePlayer(callback) {
        if (this.vShaka) {
          this.vShaka.destroy().then(() => {
            this.vPlayer = document.getElementById('v-player');
            this.vShaka = new shaka.Player(this.vPlayer);

            this.configurePlayerSettings();

            if (callback) callback();
          });
        } else {
          this.vPlayer = document.getElementById('v-player');
          this.vShaka = new shaka.Player(this.vPlayer);

          this.configurePlayerSettings();

          if (callback) callback();
        }
      },
      nextEpisodePlayEventTrigger(event_action) {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.start_time = (this.vPlayer && this.vPlayer.currentTime) ? this.vPlayer.currentTime : 'N.A';
          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : 'N.A';
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : 'N.A';
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : 'N.A';

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          eventAttributeObj.event_action = event_action;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          window.mobileAnalyticsClient.recordEvent('_next.playback', eventAttributeObj, {});
        }
      },
      videoResolutionEventTrigger(event_action) {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.$route.path;
          // eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';


          eventAttributeObj.event_action = event_action;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            // eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              //  eventAttributeObj.content_type = 'trailer';
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          window.mobileAnalyticsClient.recordEvent('_content.quality', eventAttributeObj, {});
        }
      },
      backwardForwardEventTrigger(start_time,stop_time,event_action) {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          eventAttributeObj.event_action = event_action;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          let metrics = { start_time, stop_time }

          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

        }
      },
      vBackwardPlay() {
        if(this.vPlayer) {
          let start_time,stop_time,event_action;
          start_time = this.vPlayer.currentTime ? this.vPlayer.currentTime : 0;
          this.vPlayer.currentTime = (this.vPlayer.currentTime > 10) ? this.vPlayer.currentTime - 10 : 0;
          stop_time = this.vPlayer.currentTime ? this.vPlayer.currentTime : 0;
          event_action = "quick_seek_backward";
          this.backwardForwardEventTrigger(start_time,stop_time,event_action);
        }
      },
      vForwardPlay() {
        if(this.vPlayer) {
          let start_time,stop_time,event_action;
          start_time = this.vPlayer.currentTime ? this.vPlayer.currentTime : 0;

          this.vPlayer.currentTime = (this.vPlayer.currentTime + 10 < this.vPlayer.duration) ? this.vPlayer.currentTime + 10 : this.vPlayer.duration;

          stop_time = this.vPlayer.currentTime ? this.vPlayer.currentTime : 0;
          event_action = "quick_seek_forward";
          this.backwardForwardEventTrigger(start_time,stop_time,event_action);
        }
      },
      vEpisodesListDisplay() {
        this.episodePopupPlayState = this.vPlayer.paused ? "pause" : "play";

        if(this.vPlayer && !this.vPlayer.paused) {
          this.vPlayer.pause();
        }

        let listingEpisodeBody = document.getElementById('listingEpisodeBody');

        if (listingEpisodeBody) {
          listingEpisodeBody.style.height = (parseInt(screen.height) - 120) + "px";
          listingEpisodeBody.style.overflow = "auto";
          document.getElementById('body').style.height = (parseInt(screen.height)) + "px";
        }

        if (document.getElementById('body')) {
          document.getElementById('body').style.overflow='auto';
        }

        eventBus.$emit("toggleEpisodelistPopup",true);
      },
      configurePlayerSettings() {
        this.vContain = document.getElementById('v-contain');
        this.vControls = document.getElementById('v-controls');
        this.vProgress = document.getElementById('v-progress');
        this.vLoader = document.getElementById('v-loader');
        this.vToggler = document.getElementById('v-kids-toggler');
        this.vCurrentTime = document.getElementById('v-current-time');
        this.vDuration = document.getElementById('v-duration');
        this.vMainCtrls = document.getElementById('v-main-ctrls');
        this.vMainHeader = document.getElementById('v-main-header');
        // this.vFullsrcSwitch = document.getElementById('v-fullsrc-switch');
        this.vBackward = document.getElementById('v-backward');
        this.vForward = document.getElementById('v-forward');
        this.vEpisodesList = document.getElementById('v-episodesList');


        this.vShaka.addEventListener('buffering', this.vShakaBufferingCB);

        this.vPlayer.addEventListener('play', this.vPlayEventCB);
        this.vPlayer.addEventListener('pause', this.vPauseEventCB);
        this.vPlayer.addEventListener('timeupdate', this.vHandleProgress);
        this.vPlayer.addEventListener('loadstart', this.vToggleLoader(true));
        this.vPlayer.addEventListener('loadeddata', this.vLoadedData);
        this.vPlayer.addEventListener('ended', this.vEndedCB);
        this.vPlayer.addEventListener('seeking', this.vSeekingCB);
        this.vPlayer.addEventListener('seeked', this.vSeekedCB);
        this.vPlayer.addEventListener('canplaythrough', this.vCanPlayThroughCB);

        this.vProgress.addEventListener('input', this.vSeek);
        this.vProgress.addEventListener('change', this.contentSeeked);
        this.vProgress.addEventListener('touchstart', this.vProgressTouchStartCB);

        this.vPlayer.addEventListener('error', this.vErrorCB);
        this.vPlayer.addEventListener('stalled', this.vStalledCB);

        // Remove the event listener when got initialized.
        // For solving the bug on Vue.js (Mounted event gets called two times)
        if (this.vToggler) {
          this.vToggler.removeEventListener('click', this.vTogglePlay);
          this.vToggler.addEventListener('click', this.vTogglePlay);
        }

        if(this.vForward && this.vBackward) {
          this.vBackward.removeEventListener('click', this.vBackwardPlay);
          this.vForward.removeEventListener('click', this.vForwardPlay);
        }
        this.vBackward.addEventListener('click', this.vBackwardPlay);
        this.vForward.addEventListener('click', this.vForwardPlay);
        if(this.vEpisodesList) {
          this.vEpisodesList.removeEventListener("click",this.vEpisodesListDisplay);
          this.vEpisodesList.addEventListener("click",this.vEpisodesListDisplay);
        }

        this.vControls.removeEventListener('click', this.vControlsClickEventCB);

        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
        }
        this.vUpdateButton();
        this.vToggleToggler(true, 'configurePlayerSettings');
        this.vToggleMainControls(false);
        this.toggleControls(true);
      },
      renderNormalPlayer(callback) {
        shaka.polyfill.installAll();
        if (shaka.Player.isBrowserSupported()) {
          this.vShaka.destroy().then(() => {

            this.vPlayer = document.getElementById('v-player');
            this.vShaka = new shaka.Player(this.vPlayer);

            this.vShaka.load(this.plrVideoUrl).then(() => {
              this.vDuration.innerHTML = this.vCalcTimeLine(this.vPlayer.duration);

              this.vPlayer.play();

              this.vPlayer.addEventListener('loadeddata', () => {
                // this.vPlayer.play();
              });

              if (callback) callback()
            });
          });
        }
      },
      renderDrmPlayer(callback) {
        shaka.polyfill.installAll();
        if (shaka.Player.isBrowserSupported()) {

          this.vShaka.destroy().then(() => {
            this.vPlayer = document.getElementById('v-player');
            this.vShaka = new shaka.Player(this.vPlayer);

            this.configureDrmPlayback(() => {
              this.vShaka.load(this.plrVideoUrl).then(() => {

                this.vDuration.innerHTML = this.vCalcTimeLine(this.vPlayer.duration);

                if (callback) callback();
              });
            });
          });
        }
      },
      configureDrmPlayback(callback) {
        var self = this;
        self.showDrmNotSupportError = true;
        self.showEnablePcError = true;

        // this.actGetDrmTickt(this.streamId).then(
        this.actGetDrmTickt(this.plrStreamId).then((response) => {
          this.licenseUrl = window.licenseUrl = response.license_server_url;
          this.drmTicket = window.drmTicket = response.ticket;

          this.vShaka.configure({
            drm: {
              servers: {
                'com.widevine.alpha' : this.licenseUrl
              },
              advanced: {
                'com.widevine.alpha': {
                  'videoRobustness': 'SW_SECURE_CRYPTO',
                  'audioRobustness': 'SW_SECURE_CRYPTO'
                }
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

          if (callback) callback();

          window.vShaka = this.vShaka;
          this.vShaka.addEventListener('error', onErrorEvent);
        }, (error) => {
          //  If device got removed from backend
          if (error.code == 400) {
            eventBus.$emit('togglePopupDeviceRemoved', true);
            this.toggleControls(false);
            this.vToggleLoader(false);
            // ("player");
            return;
          }

          this.vShaka.destroy().then(() => {
            this.vToggleToggler(false, 'configureDrmPlayback shaka destroy');
            this.vToggleMainControls(false);
            this.vToggleLoader(false);
          });

          if (error.code == 404 && error.message == 'Media not available for domain row') {
            eventBus.$emit('toggleVideoBlockPopupEvent', true);
          }
        });

        function onErrorEvent(event) {
          onError(event.detail);
        }
        function onError(error) {
          // If shaka-player doesn't support DRM playback, player will throw two error codes (3015 & 3016). Based on this we will show the popup
          if (self.showDrmNotSupportError && (error.code == 3016)) {
            self.contentDrmBlocked = true;
            self.showDrmNotSupportError = false;

            eventBus.$emit('toggleVideoErrorPopupEvent', true);

            if (self.vShaka) {
              self.vShaka.destroy().then(() => {
                self.configurePlayerSettings();

                self.vToggleLoader(false);
                self.vToggleMainControls(false);
              });
            }
          }

        }
      },
      makeFullscreen(callback) {
        let vContain = document.getElementById('v-contain');

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          if (vContain.requestFullscreen) {
            vContain.requestFullscreen();
          } else if (vContain.msRequestFullscreen) {
            vContain.msRequestFullscreen();
          } else if (vContain.mozRequestFullScreen) {
            vContain.mozRequestFullScreen();
          } else if (vContain.webkitRequestFullscreen) {
            vContain.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
        }
        if(callback) {
          callback();
        }
      },
      landscapeRotation(){
        let _this = this;
        screen.orientation.lock('landscape').then((response) => {
        },(error) => {
          this.vToggleLoader(false);

          // handel episode list part
          this.returnFromLoadAfterStop = true;
        });
      },
      screenRotationLandscape() {
        if(('orientation' in screen)) {
          if (matchMedia('(orientation: portrait)').matches) {
            this.vToggleLoader(true);
            this.makeFullscreen(this.landscapeRotation);
          } else {
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
            }
          }
        }
      },
      hideEpisodeListingIcon() {
        switch (this.playerContent.contentType) {
          case 'trailer':
          this.episodeIdentifier = false;
          break;
          case 'movie':
          this.episodeIdentifier = false;
          break;
          case 'poster':
          this.episodeIdentifier = false;
          break;
          case 'episode':
          this.episodeIdentifier = true;
          break;
          default:
          this.episodeIdentifier = false;
        }
      },
      vTogglePlay(flag) {
        // NOTE: @params: flag - to handle the chromecast event
        var playerFlag = undefined;
        this.returnFromLoadAfterStop = false;

        this.hideEpisodeListingIcon();

        playerFlag = flag || false;

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (this.contentDrmBlocked) {
          eventBus.$emit('toggleVideoErrorPopupEvent', true);
          this.vToggleLoader(false);
          return;
        }

        if (!this.crossDomainCheck) {
          eventBus.$emit('toggleGeoBlockEvent', true);
          if(document.getElementById('alt-app')) {
            document.getElementById('alt-app').style.position = "fixed";
          }
          this.vToggleLoader(false);
          return;
        }

        if (this.contentGeoBlocked) {
          eventBus.$emit('toggleGeoBlockEvent', true);
          this.vToggleLoader(false);
          return;
        }

        if (this.contentRestricted) {
          this.playlistCallbackEvent = false;

          // If video is in fullscreen mode, exit out of fullscreen mode
          this.vExitFullScreenMode();

          if (altUser) {
            if (this.playerContent.tvod) {
              eventBus.$emit('toggleRentNowPopupEvent', true);

              if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "fixed";
              }

            } else {
              eventBus.$emit('toggleSubscribePopupEvent', true);
            }
          } else {
            if (this.playerContent.tvod) {
              if (this.playerContent.isFreeContent) {
                eventBus.$emit('togglePlayerSigninPopupEvent', true);
              } else {
                eventBus.$emit('toggleRentTvodItemEvent', true);

                if(document.getElementById('alt-app')) {
                  document.getElementById('alt-app').style.position = "fixed";
                }
              }
            } else {
              eventBus.$emit('togglePlayerSigninPopupEvent', true);
            }
          }
          this.vToggleLoader(false);
          return;
        }

        let contentLoadFlag = localStorage.getItem('currentPlayerDetails') ? localStorage.getItem('currentPlayerDetails') : undefined;
        // NOTE chromecast connection
        if(this.chromecastState && this.playerContent && playerFlag == 'play') {
          let content = undefined;
          content = this.playerContent;
          content.timeProgress = this.vPlayer.currentTime ? Math.ceil(this.vPlayer.currentTime) : 0;

          if (this.$route.name && this.$route.name == 'media') {
            content.contentName = this.plrLoadedVideoType ? this.plrLoadedVideoType : "trailer";
          }

          eventBus.$emit("chromecastPlayback",content);

          this.checkChromeCast = true;
          if(playerFlag == "play") {
            this.vToggleLoader(false);
            return;
          } else {
            if (this.vPlayer && !this.vPlayer.paused) {
              this.vPlayer.pause();
            }
          }
        }
        // end chromecast connection

        // Make screen rotation
        this.loaderCheck = true;
        this.hidePosterPlayerScreen("block","none");

        this.screenRotationLandscape();

        this.vToggler.src = '/src/assets/player/v2/ic_Play.png';

        // Make screen rotation
        let _this = this;
        if(playerFlag == "play" || this.nextEpisodePlayLoadMainfest) {
          this.plrVideoLoaded = false;

          this.nextEpisodePlayLoadMainfest = false;
        }

        if (this.plrVideoLoaded) {
          var method = this.vPlayer.paused ? 'play' : 'pause';
          this.vPlayer[method]();
          this.vToggleLoader(false);
        } else {
          // Show the loader immediately on toggleplay button click
          this.vToggleLoader(true);

          if (!this.plrInitialized) {
            this.vPlayer.play();
            this.plrInitialized = true;
          }

          if (this.plrVideoEnded && this.plrIsDrmVideo) {
            this.configurePlayer(() => {
              this.getPlayerProgress(() => {
                this.configureDrmPlayback(() => {
                  this.vShaka.unload().then(() => {
                    // Load the video and initiate play event
                    this.vShaka.load(this.plrVideoUrl).then(() => {
                      // this.vPlayer.play();
                    }, (error) => {
                      if (error.code == 6001) {
                        // If the user disabled the protected content playback, prompt the user to enable the protected content playback
                        eventBus.$emit('toggleEnablePcPrompt', true);

                        // Clear timer and reset the screen
                        if (this.toggleControlTimer) {
                          clearTimeout(this.toggleControlTimer);
                        }
                        this.vControls.removeEventListener('click', this.vControlsClickEventCB);

                        // Update the button to play button on unload
                        this.vToggler.src = '/src/assets/player/v2/ic_Play.png';

                        this.vToggleToggler(true, 'vTogglePlay plrIsDrmVideo');
                        this.vToggleMainControls(false);
                        this.vToggleLoader(false);
                      }
                    });
                  });
                });
              });
            });
          } else {
            if (altUser && this.plrIsDrmVideo) {
              this.getPlayerProgress(()  => {
                this.configureDrmPlayback(() => {
                  this.vShaka.unload().then(() => {
                    // Load the video and initiate play event
                    this.vShaka.load(this.plrVideoUrl).then(() => {
                      // this.vPlayer.play();
                    }, (error) => {
                      if (error.code == 6001) {
                        // If the user disabled the protected content playback, prompt the user to enable the protected content playback
                        eventBus.$emit('toggleEnablePcPrompt', true);

                        // Clear timer and reset the screen
                        if (this.toggleControlTimer) {
                          clearTimeout(this.toggleControlTimer);
                        }

                        this.vControls.removeEventListener('click', this.vControlsClickEventCB);

                        this.vToggleToggler(true, 'vTogglePlay !plrIsDrmVideo');
                        this.vToggleMainControls(false);
                        this.vToggleLoader(false);
                      }
                    });
                  });
                });
              });
            } else {
              this.vShaka.unload().then(() => {
                // Load the video and initiate play event
                this.vShaka.load(this.plrVideoUrl).then(() => {
                  // this.vPlayer.play();

                  // NOTE added for first time play added logo

                  this.vToggler.src = '/src/assets/player/v2/ic_Play.png';
                }, (error) => {
                  if (error.code == 6001) {
                    // If the user disabled the protected content playback, prompt the user to enable the protected content playback
                    eventBus.$emit('toggleEnablePcPrompt', true);

                    // Clear timer and reset the screen
                    if (this.toggleControlTimer) {
                      clearTimeout(this.toggleControlTimer);
                    }

                    this.vControls.removeEventListener('click', this.vControlsClickEventCB);

                    // Update the button to play button on unload
                    this.vToggler.src = '/src/assets/player/v2/ic_Play.png';

                    this.vToggleToggler(true, 'vTogglePlay !plrIsDrmVideo');
                    this.vToggleMainControls(false);
                    this.vToggleLoader(false);
                  }
                });
              });
            }
          }
        }
      },
      vUpdateButton() {
        // If vPlayer instance not available, return from the method
        if (!this.vPlayer) return;

        if (this.plrVideoEnded) {
          if(this.vToggler) {
            this.vToggler.src = '/src/assets/player/v2/ic_Play.png';
          }
          return;
        }
        if(this.vToggler) {
        this.vToggler.src = this.vPlayer.paused ? '/src/assets/player/v2/ic_Play.png' : '/src/assets/player/v2/ic_Pause.png';
      }
      },
      vProgressMouseDownCB(event) {
        // if (!this.vPlayer) return
        //
        // this.contentSeekStartTime = this.vPlayer.currentTime
      },
      vProgressTouchStartCB(event) {
        if (!this.vPlayer) return

        this.contentSeekStartTime = this.vPlayer.currentTime
      },
      completeEventTrigger(progress) {
        if(localStorage.getItem('currentPlayerDetails') && window.mobileAnalyticsClient ) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          this.countBufferFlag = false;

          this.currentAWSEvent = false;

          let metrics = { progress }
          let event_action = 'complete';
          let  playerContent = undefined;

          metrics.stop_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A';

          playerContent = JSON.parse(localStorage.getItem('currentPlayerDetails'));

          this.webenageEventTrigger(event_action,progress);

          eventAttributeObj.event_action = event_action;
          eventAttributeObj.content_id = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_id) ? playerContent.eventAttributeObj.content_id : " ";
          eventAttributeObj.content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_title) ? playerContent.eventAttributeObj.content_title.toLowerCase() : " ";
          eventAttributeObj.content_type = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_type) ? playerContent.eventAttributeObj.content_type : " ";
          eventAttributeObj.content_streamid = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_streamid) ? playerContent.eventAttributeObj.content_streamid : "";
          eventAttributeObj.content_url = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_url) ? playerContent.eventAttributeObj.content_url : " ";
          eventAttributeObj.content_duration = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_duration) ? playerContent.eventAttributeObj.content_duration : "";

          if(playerContent && playerContent.currentPlayerType && playerContent.currentPlayerType == 'episode') {
            eventAttributeObj.parent_content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.parent_content_title) ? playerContent.eventAttributeObj.parent_content_title.toLowerCase() : "";
          }

          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

          localStorage.removeItem('currentPlayerDetails');
        }
      },
      vHandleProgress() {
        let _this = this;
        if (this.vPlayer) {
          this.vProgress.value = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          this.vCurrentTime.innerHTML = this.vCalcTimeLine(this.vPlayer.currentTime);
          this.showComUpNextTimeNextEpisodeCountDown = Math.ceil(this.vPlayer.duration - this.vPlayer.currentTime);
        }

        if (this.playerPlaylist && this.playerPlaylist.length && this.vPlayer && this.vPlayer.duration && this.vPlayer.currentTime && this.showComUpNextTime && ((this.vPlayer.duration - this.vPlayer.currentTime) < this.showComUpNextTime)) {
          this.showComUpNextTag = true;

          // this.hideVideoController(false);
        } else {
          this.showComUpNextTag = false;
        }


        // NOTE for Skip Tag
        if(this.vPlayer && this.vPlayer.currentTime && this.playerContent && this.playerContent.skipIntro) {
          let timeTag = Math.floor(this.vPlayer.currentTime);
          let startTime = parseInt(this.playerContent.skipIntro.startskipintro);
          let endTime = this.playerContent.skipIntro.endskipintro ? parseInt(this.playerContent.skipIntro.endskipintro) : undefined;

          if(timeTag >= startTime && timeTag <= endTime) {
            this.ShowSkipTag = true;
          } else {
            this.ShowSkipTag = false;
          }
        }

        // End

        if (this.vPlayer && this.vPlayer.currentTime) {
          let progressWebengage = undefined;
          progressWebengage = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          let progressPercent = undefined;
          let config = undefined;
          config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;

          progressPercent = (config && config.webEngage && config.webEngage.completePercentage) ? parseFloat(config.webEngage.completePercentage) * 100 : 90;
          if(progressWebengage >= progressPercent) {
            this.completeEventTrigger(progressWebengage);
          }
        }

      },
      vLoadedData() {
        this.playRelatedEpisodeClickFlag = false;
        this.flagRouteChanged = false;
        this.vToggleLoader(true);

        if(this.returnFromLoadAfterStop) {
          this.vToggleLoader(false);

          if(this.vPlayer && !this.vPlayer.paused) {
            this.vPlayer.pause();
          }
          this.hideVideoController(false);
          return;
        }

        if (this.vToggler) {
          this.vToggler.src = '/src/assets/player/v2/ic_Play.png';
        }

        // Reset the video ended floag. Used for replay button toggling
        this.plrVideoEnded = false;
        // If continuity data availbale, play from continue position
        if (this.continueProgress && this.plrLoadedVideoType != 'trailer') {
          this.vPlayer.currentTime = this.continueProgress;
        }

        // The event to play the video
        this.vPlayer.play();
        // Setting the duration timeline
        this.vDuration.innerHTML = this.vCalcTimeLine(this.vPlayer.duration);
        // updating the button for changing the replay button back to pause button
        this.vUpdateButton();
        // Set the flag that the video has been loaded. Used on the play button toggle
        this.plrVideoLoaded = true;

        // Setting the content length
        this.plrContentLength = this.vPlayer.duration;

        // Reset the controls toggle by resetting the timer
        this.vToggleMainControls(true);
        this.toggleControls(true);
        this.vToggleLoader(false);

        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
        }
        this.toggleControlTimer = setTimeout(() => {
          this.toggleControls(false);
          this.vToggleMainControls(false);
          this.vToggleToggler(false, 'vLoadedData toggleControlTimer');
        }, this.toggleCtrlTimerTime);

        document.getElementById('v-progress').style.display = "block";

        // NOTE: AWSMA
        // _content.playback 'start'
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let event_action = 'start'



          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          eventAttributeObj.event_action = event_action

          localStorage.setItem("currentPlayerDetails",JSON.stringify({"eventAttributeObj" : eventAttributeObj,"currentPlayerType" :this.$route.name}));

          this.currentAWSEvent = true;

          let progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          progress = isNaN(progress) ? 0 : progress

          let start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A'

          let metrics = { start_time, progress }

          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

          // NOTE webEnage added
          this.webenageEventTrigger(event_action,progress);
          // NOTE webEnage added
        }
        // NOTE: End AWSMA

        // Code for displaying different tags on the screen
        // Trailer tag
        if (this.plrLoadedVideoType == 'trailer') {
          this.showTagTrailer = true;
        } else {
          this.showTagTrailer = false;
        }

        // Coming soon tag
        if (this.comingSoonTag) {
          this.showTagComingsoon = true;
        } else {
          this.showTagComingsoon = false;
        }

        // Checking the state of the user
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }
        // Checking the order status of the user
        var altOrder = undefined;
        if (altUser && localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }

        // If player content data is not availbale, exit out of the method
        if (!this.playerContent) return;

        if (altUser) {
          // If user is logged in hide the login tag
          this.showTagLogin = false;

          if (this.playerContent.contentType == 'episode') {
            this.showTagSubscribe = false;
            this.showTagRentTvod = false;
            return;
          }

          if(this.showTagGeoCtaCheck) {
            this.showTagGeoCta = true;
          } else {
            this.showTagGeoCta = false;
          }

          if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
            this.showTagSubscribe = false;
            this.showTagRentTvod = false;
            return;
          }

          if (this.playerContent.isFreeContent || this.playerContent.anonymousAccess || this.playerContent.comingSoon) {
            this.showTagSubscribe = false;
            this.showTagRentTvod = false;
            return;
          }

          if (this.playerContent.tvod) {
            this.showTagSubscribe = false;
            //NOTE added by sumit for hide tvod CTA 16.01.2019
            var homeDomain = localStorage.getItem('homeDomain').toLowerCase();
            var singleProduct = undefined;
            if(altOrder && altOrder.tvod && altOrder.tvod.hasOrder) {
              var singleTvod = undefined;
              for (singleTvod in altOrder.tvod.products) {
                if (altOrder.tvod.products[singleTvod].product.id == this.playerContent.tvod[homeDomain]) {
                  this.showTagRentTvod = false;
                  break;
                } else {
                  this.showTagRentTvod = this.altMessages.playerRentSubscribeLabel;
                }
              }
            } else {
              this.showTagRentTvod = this.altMessages.playerRentSubscribeLabel;
            }
          } else {
            this.showTagRentTvod = false;
            this.showTagSubscribe = this.altMessages.playerSubscribeLabel;
          }
          if(this.showTagGeoCtaCheck) {
            this.showTagGeoCta = true;
          } else {
            this.showTagGeoCta = false;
          }
        } else {
          // If the player content is TVOD
          if (this.playerContent.tvod) {
            // If tvod item is episode, don't show the CTA
            if (this.playerContent.contentType == 'episode') return;

            this.showTagLogin = this.altMessages.playerSignInToRentLabel;
          } else {
            // if the content has anonymousAccess, donot display the login tag
            if (this.playerContent.anonymousAccess || this.playerContent.comingSoon) {
              this.showTagLogin = false;
              return;
            }
            if (this.playerContent.contentType == 'movie') {
              if (this.playerContent.isFreeContent) {
                this.showTagLogin = this.altMessages.playerSignInLabel;
              } else {
                this.showTagLogin = this.altMessages.playerSignInAndSubscribeLabel;
              }
            } else {
              this.showTagLogin = this.altMessages.playerSignInAndSubscribeLabel;
            }
          }
        }
      },
      vResetForReplay() {
        this.vPlayer.currentTime = 0;
        this.vCurrentTime.innerHTML = this.vCalcTimeLine(0);
        this.vProgress.value = 0;
        this.vDuration.innerHTML = this.vCalcTimeLine(isNaN(this.vPlayer.duration) ? 0 : this.vPlayer.duration);
        this.updateButton(true);
      },
      vCanPlayThroughCB() {
        // if (this.vPlayer.paused
      },
      getTitleNameWebEnage() {
        // If playerContent doesnot exists, return from method
        if (!this.playerContent) return '';

        var contentId = "";
        var series_title = "";

        if (this.playerContent.contentType == 'trailer') {
          contentId = this.playerContent.contentId;
          if(this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        } else if (this.playerContent.contentType == 'series' || this.playerContent.contentType == 'standup') {
          contentId = this.playerContent.seriesId;
          if (this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        } else if (this.playerContent.contentType == 'movie') {
          contentId = this.playerContent.contentId;
          if (this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        } else if (this.playerContent.contentType == 'episode') {
          // routerObj.query.contentid = this.playerContent.episodeId;
          contentId = this.playerContent.contentId;
          contentId = this.playerContent.seasonId;
          contentId = this.playerContent.seriesId;
          if (this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        }

        return series_title;
      },
      webenageEventTrigger(playback_state, progress) {

        if(playback_state == 'pause' || playback_state == 'resume' || playback_state == 'stop') {
          return;
        }

        var platformDetails = this.altDetectPlatform();
        var altGeoData = undefined;
        if (localStorage.getItem('altGeoData')) {
          altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
        }
        var content_type = (this.playerContent && this.playerContent.contentType) ? String(this.playerContent.contentType) : 'N.A';
        var webEnageData = {
          'gt_content_parent_title': this.getTitleNameWebEnage() ? this.getTitleNameWebEnage() : '',
          'gt_episode_title': (this.playerContent && this.playerContent.title && this.playerContent.seriesTitle) ? this.playerContent.title : '',
          'gt_platform': (platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ',
          'gt_device_make': (platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ' ,
          'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
          'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
          'gt_device_timestamp': new Date(),
          'gt_content_source': localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : '',
          'gt_content_id':  (this.playerContent && this.playerContent.id) ? this.playerContent.id : '',
          'gt_content_type': content_type,
          'gt_content_alt_id': (this.playerContent && this.playerContent.externalId) ? this.playerContent.externalId : '',
          'gt_episode_count': (this.playerContent && this.playerContent.episodeNumber) ? this.playerContent.episodeNumber : '',
          'gt_playback_mode' : 'live',
          'gt_playback_media_type' : (this.playerContent && this.playerContent.isFreeContent) ? 'free' : 'paid',
          'gt_playback_state' : playback_state ? playback_state : '',
          'percentage_video_played' : progress,
        };
        if(content_type == "episode") {
          if(playback_state == "start") {
            webEnageData['gt_episode_thumbnail_url'] = (this.playerContent && this.playerContent.images &&  this.playerContent.images.webengage) ? this.playerContent.images.webengage : '';
            webEnageData['gt_episode_description'] = (this.playerContent && this.playerContent.shortDescription) ? this.playerContent.shortDescription : '';

          } else if(playback_state == "complete") {

            webEnageData['gt_next_episode_thumbnail_url'] = (this.gt_next_episode_thumbnail_url && this.gt_next_episode_id != this.playerContent.id)? this.gt_next_episode_thumbnail_url : '';
            webEnageData['gt_next_episode_description'] = (this.gt_next_episode_description && this.gt_next_episode_id != this.playerContent.id) ? this.gt_next_episode_description : '';
            webEnageData['gt_next_episode_id'] = (this.gt_next_episode_id && this.gt_next_episode_id != this.playerContent.id )? this.gt_next_episode_id : '';

          }

        }

        if(webengage) {
          webengage.track('gt_play' ,webEnageData);
        }
      },
      vPlayEventCB() {
        this.playNextPlaylistItemFlag = false;
        this.vUpdateButton();

        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
        }
        this.toggleControlTimer = setTimeout(() => {
          this.toggleControls(false);
          this.vToggleToggler(false, 'vPlayEventCB toggleControlTimer');
          this.vToggleMainControls(false);
        }, this.toggleCtrlTimerTime);

        this.vControls.addEventListener('click', this.vControlsClickEventCB);

        if (this.plrLoadedVideoType == 'trailer') {
          eventBus.$emit('plrPlayingTrailerEvent', true);
        }

        // NOTE: AWSMA begins
        if (window.mobileAnalyticsClient && this.plrVideoLoaded) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }
          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          let event_action = 'resume';

          eventAttributeObj.event_action = event_action

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          progress = isNaN(progress) ? 0 : progress


          let start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A'

          let metrics = { start_time, progress }
          if(this.currentAWSEvent) {
            return;
          }
          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

          // NOTE webEnage added
          // commmented 24.06.2018
          // this.webenageEventTrigger(event_action,progress);
          //NOTE webEnage added
        }
        // NOTE: End of AWSMA

        // NOTE: Begining of GTM Code
        // Coded by Sumit
        // Code reviewed and corrected
        // (sangeeth_ks) 29-12-2017
        if (!this.playerContent) return;
        var contentId = "";
        var series_title = "";

        if (this.playerContent.contentType == 'trailer') {
          contentId = this.playerContent.contentId;
          if(this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        } else if (this.playerContent.contentType == 'series' || this.playerContent.contentType == 'standup') {
          contentId = this.playerContent.seriesId;
          if (this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        } else if (this.playerContent.contentType == 'movie') {
          contentId = this.playerContent.contentId;
          if (this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        } else if (this.playerContent.contentType == 'episode') {
          contentId = this.playerContent.contentId;
          contentId = this.playerContent.seasonId;
          contentId = this.playerContent.seriesId;
          if (this.playerContent.seriesTitle) {
            series_title = this.playerContent.seriesTitle;
          } else {
            series_title = this.playerContent.title;
          }
        }

        var platformDetails = this.altDetectPlatform();

        var altGeoData = undefined;
        if (localStorage.getItem('altGeoData')) {
          altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
        }

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'gt_play',
          'eventAction': 'playback',
          'eventCategory': 'gt_play',
          'eventLabel': 'playback',
          'eventValue': 1,
          'gtl_content_parent_title': series_title ? series_title : '',
          'gtl_episode_title': (this.playerContent && this.playerContent.title && this.playerContent.seriesTitle) ? this.playerContent.title : '',
          'gtl_platform': (platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ' ,
          'gtl_device_make': (platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ' ,
          'gtl_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
          'gtl_city': (altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? altGeoData.city.names.en : '',
          'gtl_device_timestamp': new Date().getTime(),
          'gtl_content_source': localStorage.getItem('AWSMA_content_source') ? localStorage.getItem('AWSMA_content_source') : '',
          'gtl_content_id':  (this.playerContent && this.playerContent.id) ? this.playerContent.id : '',
          'gtl_content_type': (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : '',
          'gtl_content_alt_id': (this.playerContent && this.playerContent.externalId) ? this.playerContent.externalId : '',
          'gtl_episode_count': (this.playerContent && this.playerContent.episodeNumber) ? this.playerContent.episodeNumber : ''
        });
      },
      vPauseEventCB() {
        this.vUpdateButton();

        // Clear the timeout event for toggling the controls and show the controls
        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
        }

        this.vToggleToggler(true, 'vPauseEventCB');
        this.vToggleMainControls(true);
        this.toggleControls(true);

        // AWSMA
        // _content.playback start event
        if (this.plrVideoLoaded == false && this.plrVideoEnded && this.playNextPlaylistItemFlag) return;

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          // NOTE for show streamId && content_type

          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let episodeNumber = (this.playerContent && this.playerContent.episodeNumber) ? this.playerContent.episodeNumber : 'N.A';
            let episodeTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : 'N.A';
            let content_title = 'Ep' + episodeNumber + '-' + episodeTitle;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          let event_action = (this.playRelatedEpisodeClickFlag || this.flagRouteChanged) ? 'stop' : 'pause';

          if(event_action == 'stop') {
            this.returnFromLoadAfterStop = true;
            this.nextEpisodePlayLoadMainfest = true;
          }

          this.currentAWSEvent = false;

          let progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          progress = isNaN(progress) ? 0 : progress ;


          eventAttributeObj.event_action = event_action;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let metrics = { progress }

          if (event_action == 'pause') {
            // metrics.start_time = this.vPlayer && this.vPlayer.currentTime ? this.vPlayer.currentTime : 'N.A'
          }

          let stop_time = 'N.A'
          if (event_action == 'stop') {

            // stop event
            var playerContent = undefined;
            if(localStorage.getItem('currentPlayerDetails')) {
              metrics.stop_time = this.vPlayer && this.vPlayer.currentTime ? this.vPlayer.currentTime : 'N.A'

              playerContent = JSON.parse(localStorage.getItem('currentPlayerDetails'));
              eventAttributeObj.content_id = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_id) ? playerContent.eventAttributeObj.content_id : " ";
              eventAttributeObj.content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_title) ? playerContent.eventAttributeObj.content_title.toLowerCase() : " ";
              eventAttributeObj.content_type = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_type) ? playerContent.eventAttributeObj.content_type : " ";
              eventAttributeObj.content_streamid = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_streamid) ? playerContent.eventAttributeObj.content_streamid : "";
              eventAttributeObj.content_url = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_url) ? playerContent.eventAttributeObj.content_url : " ";
              eventAttributeObj.content_duration = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_duration) ? playerContent.eventAttributeObj.content_duration : "";

              if(playerContent && playerContent.currentPlayerType && playerContent.currentPlayerType == 'episode') {
                // eventAttributeObj.parent_content_id =(playerContent && playerContent.eventAttributeObj &&  playerContent.eventAttributeObj.parent_content_id) ? playerContent.eventAttributeObj.parent_content_id : " ";
                eventAttributeObj.parent_content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.parent_content_title) ? playerContent.eventAttributeObj.parent_content_title.toLowerCase() : "";
              }

              window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

              localStorage.removeItem('currentPlayerDetails');
            }
            //end stop event
          }

          if(event_action == 'pause' && metrics && metrics.progress == 100) {
            event_action = 'complete';
          }

          if(event_action != 'complete' && event_action != 'stop') {
            window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
          }
        }
        // AWSMA

        // Begining update media progress list
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = true;
        }

        if (!altUser) return;

        var contentName = this.$route.name;
        var contentId = this.$route.params.id;
        var progress = this.vPlayer ? this.vPlayer.currentTime : undefined;
        var duration = this.vPlayer ? this.vPlayer.duration : undefined;

        if (!contentId) return;

        if (this.plrVideoLoaded && (contentId == this.id)) {
          this.updateMediaProgress(this.id, progress, duration);
        }

      },
      updateMediaProgressList() {
        var duration = Math.round(this.vPlayer.duration);
        var currentTime = Math.round(this.vPlayer.currentTime);
        var progress = Math.ceil((currentTime / duration) * 100);

        // If progress value comes as 0 set it as 100.
        // Sometimes progress will return 0 at the end of video
        progress = (progress == 0) ? 100 : progress;

        // This method will execute 2 times when the video ends.
        // Second time, the progress will return NaN
        // To update the media progress list correctly donot update the progress list when progress value returns NaN
        if (isNaN(duration) || isNaN(progress)) return;

        var currItem = { media_id: this.mediaId, progress, length: duration };

        if (localStorage.getItem('mediaProgressList')) {
          var mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
          var updatedProgressList = this.getUniqueProgressList(currItem, mediaProgressList);

          localStorage.setItem('mediaProgressList', JSON.stringify(updatedProgressList));
        } else {
          var mediaProgressList = new Array();
          mediaProgressList.push(currItem);
          localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));
        }
      },
      updateMediaProgress(media_id, progress, duration) {
        if (this.plrLoadedVideoType == 'trailer') return;

        if (!progress || !duration) return;

        if (isNaN(progress) || isNaN(duration)) return;

        progress = (progress > duration) ? duration : progress;

        this.actPutPlayerProgress({ media_id, progress }).then((response) => {
        }, (error) => {
        });

        var progressPercent = Math.ceil((Math.round(progress) / Math.round(duration)) * 100);

        var currItem = { media_id, progress: progressPercent, length: duration };

        if (localStorage.getItem('mediaProgressList')) {
          var mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
          var updatedProgressList = this.getUniqueProgressList(currItem, mediaProgressList);

          localStorage.setItem('mediaProgressList', JSON.stringify(updatedProgressList));
        } else {
          var mediaProgressList = new Array();
          mediaProgressList.push(currItem);
          localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));
        }
      },
      vEndedCB() {
        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
        }
        this.vControls.removeEventListener('click', this.vControlsClickEventCB);

        // Hide the play button immediately on video end
        this.vToggleToggler(false, 'vEndedCB');
        this.vToggleMainControls(false);
        this.toggleControls(false);

        // Setting the flags to notify the player
        this.plrVideoEnded = true;
        this.plrVideoLoaded = false;

        this.showTagLogin = false;
        this.showTagSubscribe = false;
        this.showTagGeoCta = false;

        let progress = 100;
        let stop_time = undefined
        if (this.vPlayer) {
          progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          progress = isNaN(progress) ? 100 : progress

          stop_time = this.vPlayer.currentTime
        }

        // If playlist data is present, play the next item
        if (this.playerPlaylist && this.playerPlaylist.length) {
          this.playNextPlaylistItemFlag = true

          // Unload the contents first and load call for play
          this.vShaka.unload().then(() => {
            this.playNextPlaylistItem();
          });

          return;
        }

        // Getting the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (this.plrLoadedVideoType == 'trailer') {
          if (this.playerContent.contentType == 'movie') {
            if (altUser) {
              if (this.playerContent.stream && (this.playerContent.isFreeContent || this.playerContent.userHasAccess)) {
                // Set the flag, to notify the player that the content to be loaded is DRM
                this.plrIsDrmVideo = true;

                // unload and continue, otherwise player will throw 6007 error
                this.vShaka.unload().then(() => {
                  this.playMovieBtnClickCB();

                  // AWSMA
                  // _content.playback start event
                  if (window.mobileAnalyticsClient) {
                    var eventAttributeObj = this.getAWSMACommonAttributes();

                    eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
                    eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
                    eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
                    eventAttributeObj.content_url = this.$route.path;
                    eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
                    eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

                    // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
                    if (this.$route.name && this.$route.name == 'episode') {
                      let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
                      eventAttributeObj.content_title = content_title.toLowerCase();

                      if (this.playerContent && this.playerContent.seriesId) {
                        // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
                      }

                      if (this.playerContent && this.playerContent.seriesTitle) {
                        eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
                      }
                    }

                    eventAttributeObj.event_action = 'complete';

                    let deviceOrientation = this.getPlayerEventMode()
                    eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

                    let metrics = { progress, stop_time }

                    window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
                  }
                  // AWSMA
                });
                return;
              }
            } else {
              if (this.playerContent.anonymousAccess && this.playerContent.stream) {
                // Set the flag, to notify the player that the content to be loaded is non-DRM
                this.plrIsDrmVideo = false;

                // unload and continue, otherwise player will throw 6007 error
                this.vShaka.unload().then(() => {
                  this.playMovieBtnClickCB();

                  // AWSMA
                  // _content.playback start event
                  if (window.mobileAnalyticsClient) {
                    var eventAttributeObj = this.getAWSMACommonAttributes();

                    eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
                    eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
                    eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
                    eventAttributeObj.content_url = this.$route.path;
                    eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
                    eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

                    // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
                    if (this.$route.name && this.$route.name == 'episode') {
                      let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
                      eventAttributeObj.content_title = content_title.toLowerCase();

                      if (this.playerContent && this.playerContent.seriesId) {
                        // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
                      }

                      if (this.playerContent && this.playerContent.seriesTitle) {
                        eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
                      }
                    }

                    eventAttributeObj.event_action = 'complete';

                    let deviceOrientation = this.getPlayerEventMode()
                    eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

                    let metrics = { progress, stop_time }

                    window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
                  }
                  // AWSMA
                });
                return;
              }
            }
          }

          eventBus.$emit('plrPlayingTrailerEvent', false);
        }

        // If the loaded video is movie
        if (this.plrLoadedVideoType == 'movie') {
          if (altUser) {
            this.plrIsDrmVideo = true;
          } else {
            this.plrIsDrmVideo = false;
          }
        }

        this.vShaka.unload().then(() => {
          this.vUpdateButton();
          this.vToggleMainControls(false);
          this.vToggleToggler(true, 'vEndedCB unload');
          this.toggleControls(true);
        });

        // Method to handle the fullscreen switch and popup display
        this.vLoadedEndedCB();
      },
      vLoadedEndedCB() {
        // If video is in fullscreen mode, exit out of fullscreen mode

        if (!this.showComUpNextTag) {
          this.vExitFullScreenMode();
          eventBus.$emit('togglePlayerScreenEvent', false);
        }

        if (!this.playerContent.contentType == 'movie') return;

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }
        var altOrder = undefined;
        if (altUser && localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }

        if(this.plrLoadedVideoType == 'trailer' ) {
          if(this.trailerCountinueGeoCheck) {
            eventBus.$emit('toggleGeoBlockEvent', true);
            return;
          }

        }
        if (this.plrLoadedVideoType == 'trailer' || this.plrLoadedVideoType == 'episode' || this.plrLoadedVideoType == 'movie') {
          if (altUser) {
            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
              return false;
            } else {
              eventBus.$emit('toggleSubscribePopupEvent', true);
            }
          } else {
            eventBus.$emit('toggleSigninPopupEvent', true);
          }
        }
      },
      vSeekingCB(event) {

      },
      vSeekedCB(event) {
        if (!this.vPlayer) return;

        if (this.vPlayer.paused) {
          if (this.toggleControlTimer) {
            clearTimeout(this.toggleControlTimer);
          }

          this.vToggleToggler(true, 'vSeekedCB');
          this.vToggleMainControls(true);
          this.toggleControls(true);
        }
      },
      vHanleError(error) {
      },
      vShakaBufferingCB(event) {
        // this.vToggleLoader(event.buffering);

        this.isVPlayerBuffering = event.buffering

        if (event.buffering) this.contentBufferStartTime = event.timeStamp
        if (!event.buffering) this.contentBufferStopTime = event.timeStamp

        // AWSMA
        // _content.playback start event
        if (!this.plrVideoLoaded) return;

        this.vToggleLoader(event.buffering);

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          if (event.buffering) {
            // eventAttributeObj.event_action = 'buffer';
            //
            // let deviceOrientation = this.getPlayerEventMode()
            // eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';
            //
            // let start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A'
            //
            // this.bufferStartTime = start_time;
            //
            // let duration = Math.abs(((this.contentBufferStopTime - this.contentBufferStartTime) / 1000) / 15)
            // if (isNaN(duration)) duration = 1.00
            // console.log("this.contentBufferStopTime | ",this.contentBufferStopTime,"|this.contentBufferStartTime|",this.contentBufferStartTime);
            //
            // let metrics = { start_time, duration }
            //
            // console.log("playerscreen.vue | event.buffering |",metrics);
            // window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
          } else {
            if (!this.countBufferFlag) {
              this.countBufferFlag = true;
              return;
            }
            let duration = Math.abs((this.contentBufferStopTime - this.contentBufferStartTime) / 1000);
            let metrics;
            let event_action;
            let start_time;
            // buffer ********************************
            this.currentAWSEvent = false;

            var eventAttributeObj_buffer = this.getAWSMACommonAttributes();

            eventAttributeObj_buffer.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
            eventAttributeObj_buffer.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
            eventAttributeObj_buffer.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
            eventAttributeObj_buffer.content_url = this.$route.path;
            eventAttributeObj_buffer.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
            eventAttributeObj_buffer.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
            // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
            if (this.$route.name && this.$route.name == 'show') {
              eventAttributeObj_buffer.content_type = 'trailer';

              if (this.playerContent && this.playerContent.trailer) {
                eventAttributeObj_buffer.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
              }
            }
            if (this.$route.name && this.$route.name == 'episode') {
              let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
              eventAttributeObj_buffer.content_title = content_title.toLowerCase();

              if (this.playerContent && this.playerContent.seriesId) {
                eventAttributeObj_buffer.parent_content_id = this.playerContent.seriesId;
              }

              if (this.playerContent && this.playerContent.seriesTitle) {
                eventAttributeObj_buffer.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
              }
            }
            if (this.$route.name && this.$route.name == 'media') {
              if(this.plrLoadedVideoType == 'trailer') {
                eventAttributeObj_buffer.content_type = 'trailer';
              }
            }

            event_action = 'buffer';
            eventAttributeObj_buffer.event_action = event_action;
            let deviceOrientation_buffer = this.getPlayerEventMode()
            eventAttributeObj_buffer.event_mode = deviceOrientation_buffer ? deviceOrientation_buffer : 'N.A';
            start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A';
            metrics = { start_time, duration}

            window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj_buffer, metrics);


            event_action = 'resume';
            let method_stage = this.vPlayer.paused ? 'pause' : 'play';

            eventAttributeObj.event_action = event_action;

            let deviceOrientation = this.getPlayerEventMode()
            eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

            let progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
            progress = isNaN(progress) ? 0 : progress

            start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A'

            metrics = { start_time, progress }

            if(method_stage == 'play') {
              window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
              // NOTE webEnage added
              // commented 24.06.2018
              // this.webenageEventTrigger(event_action,progress);
              //NOTE webEnage added
            }
          }
        }
        // AWSMA
      },
      vBuggeringCB(event) {
        this.vToggleLoader(event.buffering);
      },
      vControlsClickEventCB() {
        this.toggleControls(true);
        this.vToggleToggler(true, 'vControlsClickEventCB');
        this.vToggleMainControls(true);

        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
        }
        this.toggleControlTimer = setTimeout(() => {
          this.toggleControls(false);
          this.vToggleToggler(false, 'vControlsClickEventCB toggleControlTimer');
          this.vToggleMainControls(false);
        }, this.toggleCtrlTimerTime);
      },
      vSeek(event) {
        this.vPlayer.removeEventListener('timeupdate', this.vHandleProgress);

        if (this.toggleControlTimer) clearTimeout(this.toggleControlTimer)

        this.toggleControlTimer = setTimeout(() => {

          this.toggleControls(false);
        }, this.toggleCtrlTimerTime);
      },
      contentSeeked(event) {
        this.vPlayer.addEventListener('timeupdate', this.vHandleProgress);
        var startTimeSeek = this.vPlayer.currentTime;

        this.showComUpNextTag = false;
        this.vPlayer.currentTime = parseFloat(event.target.value / 100) * this.vPlayer.duration;

        var seekedPositionPercentage = parseInt(event.target.value);
        var seekedPositionAbsolute = (this.playerContent.durationInSec * seekedPositionPercentage) / 100;

        this.contentSeekStopTime = this.vPlayer.currentTime

        // AWSMA
        // if (!this.contentSeekStartTime || !this.contentSeekStopTime) return;

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : null;
          eventAttributeObj.content_url = this.$route.path;
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer) ? this.vPlayer.duration : null;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY
          if (this.$route.name && this.$route.name == 'show') {
            eventAttributeObj.content_type = 'trailer';

            if (this.playerContent && this.playerContent.trailer) {
              eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.trailer && this.playerContent.trailer.trailerId) ? this.playerContent.trailer.trailerId : null;
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR EPISODES ONLY
          if (this.$route.name && this.$route.name == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title.toLowerCase();

            if (this.playerContent && this.playerContent.seriesId) {
              // eventAttributeObj.parent_content_id = this.playerContent.seriesId;
            }

            if (this.playerContent && this.playerContent.seriesTitle) {
              eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
            }
          }

          // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
          if (this.$route.name && this.$route.name == 'media') {
            if(this.plrLoadedVideoType == 'trailer') {
              eventAttributeObj.content_type = 'trailer';
            }
          }

          eventAttributeObj.event_action = 'seek';

          this.currentAWSEvent = false;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let start_time = startTimeSeek;

          let stop_time = this.contentSeekStopTime;

          let metrics = { start_time, stop_time }

          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
        }
        // AWSMA
      },
      vErrorCB(event) {
      },
      vStalledCB(event) {
      },
      playTrailerBtnClickCB() {

        // NOTE chromecast make empty variable
        this.checkChromeCast = false;
        this.plrLoadedVideoTypeMovieTrailer = "trailer";

        this.nextEpisodePlayLoadMainfest = true;

        // NOTE this for when we will switch movie to trailer the  stop event will trigger
        this.stopTriggerForMovieTrilerSwitch();

        this.vToggleMainControls(false);

        if (this.vPlayer && !this.vPlayer.paused) {
          this.vPlayer.pause();
          this.vPauseEventCB();
        }

        this.plrVideoLoaded = false;

        // Check if trailer url is present or not
        if (this.plrTrailerUrl) {
          this.plrVideoUrl = this.plrTrailerUrl;
        }
        this.plrIsDrmVideo = false;
        this.continueProgress = undefined;

        this.configurePlayer(() => {
          this.vTogglePlay();

          this.plrLoadedVideoType = 'trailer';
        });
      },
      playMovieBtnClickCB() {
        this.nextEpisodePlayLoadMainfest = true;
        // NOTE this for when we will switch trailer to movie the  stop event will trigger
        this.stopTriggerForMovieTrilerSwitch();

        // NOTE chromecast make empty variable
        this.checkChromeCast = false;
        this.plrLoadedVideoTypeMovieTrailer = "movie";
        eventBus.$emit('plrPlayingMovieEvent', true);

        this.vToggleMainControls(false);

        if (this.vPlayer && !this.vPlayer.paused) {
          this.vPlayer.pause();
        }

        if (this.plrStreamUrl) {
          this.plrVideoUrl = this.plrStreamUrl;
        }

        this.plrVideoLoaded = false;

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (this.plrIsDrmVideo) {
          if (this.altUser) {
            this.getPlayerProgress(() => {
              this.configurePlayer(() => {
                this.configureDrmPlayback(() => {
                  this.vTogglePlay();

                  this.plrLoadedVideoType = 'movie';

                });
              });
            });
          } else {
            this.configurePlayer(() => {
              this.vTogglePlay();

              this.plrLoadedVideoType = 'movie';
            });
          }
        } else {
          if (altUser) {
            this.getPlayerProgress(() => {
              this.configurePlayer(() => {
                this.configureDrmPlayback(() => {
                  this.vTogglePlay();

                  this.plrLoadedVideoType = 'movie';

                });
              });
            });
          } else {
            this.configurePlayer(() => {
              this.vTogglePlay();

              this.plrLoadedVideoType = 'movie';
            });
          }
        }
      },
      rentRedirect() {
        localStorage.setItem('session_track_link',window.location.href);
        this.$router.push({ name: 'rent', params: { type: 'show', id: this.seriesId } });
      },
      subscribeRedirect() {
        localStorage.setItem('session_track_link',window.location.href);
        this.$router.push({ name: 'subscribe'});
      },
      playTrailerCallback() {
        if (this.vPlayer) {
          this.vToggleControls(false);
        }

        if (this.loadedContent == 'STREAM' && this.vPlayer && !this.vPlayer.paused) {
          this.vPauseEventCB();
        }

        this.contentRestricted = false;
        this.loadedContent = 'TRAILER';
        this.progressId = undefined;
        this.continueProgress = 0;
        this.plrIsDrmVideo = false;

        this.manifestUrl = this.playerContent.trailer.trailerUrl;

        this.renderNormalPlayer(() => {
          eventBus.$off('playTrailerEvent');
        });
      },
      playStreamCB() {
        eventBus.$off('playStreamEvent');

        if (this.vPlayer) {
          this.vToggleControls(false);
        }

        this.contentRestricted = false;
        this.loadedContent = 'STREAM';
        this.manifestUrl = this.playerContent.stream.streamUrl;
        this.streamId = this.playerContent.stream.streamId;
        this.drmType = this.playerContent.stream.drm;

        if (this.drmType) {
          if (localStorage.getItem('altUser')) {
            this.getPlayerProgress(() => {
              this.renderDrmPlayer(() => {
                this.vTogglePlay();
                eventBus.$on('playStreamEvent', this.playStreamCB);
              });
            });
          } else {
            this.renderDrmPlayer(() => {
              this.vTogglePlay();
              eventBus.$on('playStreamEvent', this.playStreamCB);
            });
          }
        } else {
          if (localStorage.getItem('altUser')) {
            this.getPlayerProgress(() => {
              this.renderNormalPlayer(() => {
                this.vTogglePlay();
                eventBus.$on('playStreamEvent', this.playStreamCB);
              });
            });
          } else {
            this.renderNormalPlayer(() => {
              this.vTogglePlay();
              eventBus.$on('playStreamEvent', this.playStreamCB);
            });
          }
        }
      },
      crossDomainCheckPopup() {
        this.contentGeoBlocked = false;
        this.actGetMediaGeoAccess(this.mediaId).then((response) => {
          var priceListGeoAccessGeo = undefined;
          var singlePriceGeo = undefined;
          var homeDomainGeo = undefined;
          if (localStorage.getItem('homeDomain')) {
            homeDomainGeo = localStorage.getItem('homeDomain')
          } else {
            return;
          }
          var singleGeoData = undefined;
          for(priceListGeoAccessGeo in response.products) {
            singleGeoData = undefined;
            singleGeoData = response.products[priceListGeoAccessGeo];
            for(singlePriceGeo in singleGeoData.prices) {
              if(singleGeoData.prices[singlePriceGeo].domain == homeDomainGeo.toLowerCase()) {
                this.showTagGeoCtaCheck = false;
                this.contentGeoBlocked = false;
                return;
              }
            }
          }

          this.vExitFullScreenMode();

          if(this.playerContent && this.playerContent.contentType == "movie") {
            // NOTE: CODE CHANGE @SANGETH
            // If 'row' user access content in 'in' domain, and if the content is geoblocked, we need to show the geo block popup
            this.contentGeoBlocked = true;
            eventBus.$emit('toggleGeoBlockEvent', true);
            // NOTE: END CODE CHANGE @SANGETH

            this.showTagGeoCtaCheck = true;
            this.trailerCountinueGeoCheck = true;
          } else {
            this.contentGeoBlocked = true;
            eventBus.$emit('toggleGeoBlockEvent', true);
          }
        }, (error) => {
          // console.log('[PlayerScreen -> crossDomainCheck -> error]', error);
        });
      },
      getMediaAccess(callback) {
        var altConfig = undefined;
        var homeDomain = undefined;
        var visitedDomain = undefined;
        var altOrder = undefined;

        this.trailerCountinueGeoCheck = false;

        if (localStorage.getItem('altConfig')) {
          altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

        if (localStorage.getItem('homeDomain')) {
          homeDomain = localStorage.getItem('homeDomain')
        }

        if (localStorage.getItem('visitedDomain')) {
          visitedDomain = localStorage.getItem('visitedDomain');
        }
        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }

        this.actGetMediaAccess(this.mediaId).then((response) => {
          if (response.status && response.status == 'ok') {
            this.contentGeoBlocked = false;
            if (callback) callback();
          } else {
            this.crossDomainCheckPopup();
            if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {

              this.contentGeoBlocked = true;
              // this.geoBlockContent();
              if (callback) callback();
              return;
            }

            // NOTE: Code change
            // For fixing domain popup issue
            // NOTE: New code Added
            if (homeDomain == visitedDomain) {
              this.contentGeoBlocked = false
              if (callback) callback()

              return
            }

            if (visitedDomain && visitedDomain == 'IN') {
              this.contentGeoBlocked = false;

              if (callback) callback();
            } else {
              // this.contentGeoBlocked = true;

              if (callback) callback();
            }
          }
        }, (error) => {
          // If error code is 401. ie. Unauthorized: Token missing in token map
          if (error.code == 401) {
            eventBus.$emit('togglePopupDeviceRemoved', true);
          }
        });
      },
      geoBlockContent() {
        this.contentGeoBlocked = true;

        if (this.vPlayer) {
          this.vPlayer.pause();
          this.updateButton();
        } else {
          document.getElementById('v-kids-toggler').addEventListener('click', () => {
            eventBus.$emit('toggleGeoBlockEvent', true);
          });
        }

        this.vUpdateButton();

        if (this.vShaka) {
          this.vShaka.unload().then(() => {
            document.getElementById('v-loader').style.display = 'none';
            document.getElementById('v-player').setAttribute('poster', this.playerContent.images.cover);
          });
        } else {
          document.getElementById('v-loader').style.display = 'none';
          document.getElementById('v-player').setAttribute('poster', this.playerContent.images.cover);
        }
      },
      handleShowCtaGeo(parsedResponse) {
        let countPriceDetails = undefined;
        let homeDomain = undefined;
        if (localStorage.getItem('homeDomain')) {
          homeDomain = localStorage.getItem('homeDomain');
        }
        for(countPriceDetails in parsedResponse.pricing) {
          if(parsedResponse.pricing[countPriceDetails].domain == homeDomain.toLowerCase()) {
            this.showTagGeoCtaCheck = false;
            return;
          }
        }
        // this.showTagSubscribe = false;
        // this.showTagGeoCta = true;
        // this.showTagLogin = false;
        // this.showTagRentTvod = false;
        this.showTagGeoCtaCheck = true;

      },
      getTheContents(callback) {
        if (this.contentName == 'show') {
          this.actGetMediaSeries(this.seriesId).then((response) => {
            var parsedResponse = this.parseContents(response);

            this.handleShowCtaGeo(parsedResponse);
            // end

            this.setPlayerContent(parsedResponse);

            // GTM Webengage
            this.sendGTMpageViewData('show details', parsedResponse.title ? parsedResponse.title : '', '');
            this.webEnagePageView('show details', parsedResponse.title ? parsedResponse.title : '', '');

            eventBus.$emit('playerContentFetchEvent');

            if (response.seasons && response.seasons.length) {
              this.seriesSeasons = response.seasons;
            }

            if (callback) callback();
          }, (error) => {
            if (error.code == 404) {
              eventBus.$emit('toggleVideoBlockPopupEvent', true);
              this.toggleLoader(false);
              if (this.vPlayer && this.vShaka) {
                this.vShaka.destroy().then(() => {
                  this.vPlayer = document.getElementById('v-player');
                  this.vShaka = new shaka.Player(this.vPlayer);

                  this.configurePlayer();
                  this.vToggleLoader(false);
                });
              } else {
                this.configurePlayer(false);
                this.vToggleLoader(false);
              }

              // eventBus.$emit('toggleVideoBlockPopupEvent', true);
            } else if (!(error.body && error.code)) {
              eventBus.$emit('togglePopupNetworkError', true);
              document.getElementById('v-loader').style.display = 'none';
              document.getElementById('v-controls').style.display = 'none';
            }
          });
        } else if (this.contentName == 'media' || this.contentName == 'episode') {
          this.actGetMediaVideo(this.id).then((response) => {
            var parsedResponse = this.parseContents(response);

            this.setPlayerContent(parsedResponse);

            // GTM Webengage
            if (this.contentName == 'episode') {
              this.sendGTMpageViewData('episode details', parsedResponse.seriesTitle ? parsedResponse.seriesTitle : '', parsedResponse.title ? parsedResponse.title : '');
              this.webEnagePageView('episode details', parsedResponse.seriesTitle ? parsedResponse.seriesTitle : '', parsedResponse.title ? parsedResponse.title : '');
            } else {
              this.sendGTMpageViewData('media', parsedResponse.title ? parsedResponse.title : '', '')
            }

            eventBus.$emit('playerContentFetchEvent');

            if (callback) {
              callback();
            }
          }, (error) => {
            if (error.code) {

              if (error.code == 404 && error.message == 'This account is deleted') {
                eventBus.$emit('togglePopupDeviceRemoved', false);
                this.toggleLoader(false);
              }
              // NOTE added by sumit 21.03.2018
              if (error.code == 404 && error.message == 'Media not available for domain row') {
                eventBus.$emit('toggleVideoBlockPopupEvent', true);
                this.toggleLoader(false);
                return;
              }
            } else {
              eventBus.$emit('togglePopupNetworkError', true);
              document.getElementById('v-loader').style.display = 'none';
              document.getElementById('v-controls').style.display = 'none';
            }
          });
        }
      },
      loadVideo() {
        this.vShaka.unload().then(() => {
          this.vShaka.load(this.manifestUrl).then(() => {
            localStorage.setItem('awsContentUrl', this.manifestUrl);
          }).catch(this.vOnError);
        });
      },
      vOnError(error) {
      },
      updateButton(data) {
        if(data){
          this.vToggler.src = '/src/assets/player/v2/ic_Play.png';
        } else {
          this.vToggler.src = this.vPlayer.paused ? '/src/assets/player/v2/ic_Play.png' : '/src/assets/player/v2/ic_Pause.png';
        }
      },
      vReset() {
        this.vPlayer.currentTime = 0;
        this.vCurrentTime.innerHTML = this.vCalcTimeLine(0);
        this.vProgress.value = 0;
        this.vDuration.innerHTML = this.vCalcTimeLine(isNaN(this.vPlayer.duration) ? 0 : this.vPlayer.duration);
        this.updateButton();
      },
      vToggleLoader(show) {
        if(this.vLoader) {
          if (show) {
            this.vLoader.style.display = 'block';
            this.hideVideoController(false);
          } else {
            this.vLoader.style.display = 'none';
            if(this.loaderCheck) {
              this.hideVideoController(true);
            }

          }
        }
      },
      vToggleToggler(show, from) {
        if(this.vToggler) {
          if (show) {
            this.vToggler.style.display = 'inline-block';
          } else {
            this.vToggler.style.display = 'none';
          }
      }
      },
      vToggleMainControls(show) {
        if (show) {
          this.vMainCtrls.style.display = 'block';
          this.vMainHeader.style.display = 'block';
        } else {
          this.vMainCtrls.style.display = 'none';
          this.vMainHeader.style.display = 'none';

        }
      },
      vToggleScreen(state) {
        this.vToggleLoader(state);
        this.vToggleToggler(state, 'vToggleScreen');
        this.vToggleControls(state);
      },
      vCalcTimeLine: (duration) => {
        var duration = parseInt(duration, 10);
        var hours   = Math.floor(duration / 3600);
        var minutes = Math.floor((duration - (hours * 3600)) / 60);
        var seconds = duration - (hours * 3600) - (minutes * 60);

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
          window.mobileAnalyticsClient.recordEvent('_content.playback', this.stuffPlaybackAttributes('mode'), this.buildPlaybackMetrics('mode', 0, 0));
        }
        // End of AWS Mobile SDK Events
      },
      vExitFullScreenMode() {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
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
      },
      configurePlayerControls() {
        var self = this;

        self.videoTag.addEventListener('loadstart', function (event) {
          self.showVideoLoader = true;
        });

        self.videoTag.addEventListener('loadeddata', function (event) {
          self.showVideoLoader = false;
        });

        self.videoTag.addEventListener('error', function (event) {
        });

        self.altPlayer.addEventListener('buffering', function (event) {
          self.showVideoLoader = event.buffering;
          if (event.buffering) {
            if (self.videoTimer) {
              clearInterval(self.videoTimer);
            }
          } else {
            if (self.videoCanPlay) {
              self.playVideo();
            }
          }
        });
      },
      playVideo() {
        //  if loaded content is playing disable the trailer button in Detail Button page
        if (this.loadedContent == 'TRAILER') {
          eventBus.$emit('playingTrailerEvent');
        }

        if (this.contentRestricted) {
          var altUser = JSON.parse(localStorage.getItem('altUser'));
          if (altUser) {
            eventBus.$emit('toggleSubscribePopupEvent', true);
          } else {
            eventBus.$emit('toggleSigninPopupEvent', true);
          }
          return false;
        }
        this.togglePlayerState('PLAY');

        if (this.videoTimer) {
          clearInterval(this.videoTimer);
        }
        this.videoTimer = setInterval(() => {
          this.playTime += 1;
          this.currentTime = this.calculateTimeLine(this.playTime);
          this.seekPosition = String(Number(this.seekPosition) + this.videoStep);
        }, 1000);
        this.videoCanPlay = true;

        if (this.toggleControlTimer) {
          clearTimeout(this.toggleControlTimer);
          this.toggleControlTimer = setTimeout(() => {
            this.toggleControls(false);
          }, 5000);
        } else {
          this.toggleControlTimer = setTimeout(() => {
            this.toggleControls(false);
          }, 5000);
        }
      },
      pauseVideo() {
        var contentName = this.$route.name;
        if (this.vPlayer) {
          this.vPlayer.pause();
        }
      },
      togglePlayerState(state) {
        if (this.isPlayerReady && state == 'PLAY') {
          this.isPlayerPlaying = true;
          this.videoTag.play();
        } else if (state == 'PAUSE' && this.isPlayerPlaying) {
          this.toggleControls(true);
          this.isPlayerPlaying = false;
          this.videoTag.pause();
        }
      },
      showControls() {
        if ((this.contentGeoBlocked || this.contentRestricted || this.contentDrmBlocked) && this.toggleControls) {
          this.toggleControls(true);
          clearTimeout(this.toggleControlTimer);
          return false;
        }

        this.toggleControls(true);
        this.toggleControlTimer = setTimeout(() => {
          this.toggleControls(false);
        }, this.toggleCtrlTimerTime);
      },
      toggleControls(state) {
        var vControls = document.getElementById('v-controls');
        // If the element is not present
        if (!vControls) return;

        if (state) {
          vControls.style.opacity = 1;
        } else {
          vControls.style.opacity = 0;
        }
      },
      seekCallback(event) {
        this.showVideoLoader = true;

        this.seekPosition = String(event.target.value);

        var seekInSec = this.playTime = parseInt(Math.floor((event.target.value / 100) * this.durationInSec));
        this.videoTag.currentTime = seekInSec;
        this.currentTime = this.calculateTimeLine(seekInSec);

        if (this.videoTimer) {
          clearInterval(this.videoTimer);
          this.videoTimer = setInterval(() => {
            this.currentTime = this.calculateTimeLine(this.playTime);
            this.seekPosition = String(Number(this.seekPosition) + this.videoStep);
            this.playTime += 1;
          }, 1000);
        }

        this.showVideoLoader = false;
      },
      makeVideoFullscreen: () => {
        var self = this;
        var videoContainer = document.getElementById('v-player');
        var isFullScreen = false;
        if (videoContainer) {
          if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (videoContainer.requestFullscreen) {
              videoContainer.requestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
              videoContainer.msRequestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
              videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
              videoContainer.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
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
        }
      },
      getPlayerProgress(callback) {
        if (!(this.progressId)) {
          this.continueProgress = undefined;
          if (callback) callback();
          return;
        }

        this.actGetPlayerProgress(this.progressId).then((response) => {
          if (response.progress) {
            if (this.playerContent && (this.playerContent.durationInSec - response.progress) < 40) {
              this.continueProgress = undefined;
            } else {
              this.continueProgress = response.progress;
            }

          }

          if (callback) {
            callback();
          }
        }, (error) => {

          this.continueProgress = undefined;
          if (callback) {
            callback();
          }
        });
      },
      getSeriesSeasons(callback) {
        this.actGetSeriesSeasons(this.seriesId).then((response) => {
          if (response.count) {
            this.seasonId = response.seasons[0].id;

            if (callback) callback();
          }
        }, (error) => {
          // console.log('[PlayerScreen | getSeriesSeasons | error | ]', error);
        });
      },
      getSeriesEpisodes(callback) {
        this.actGetEpisodes({
          seriesId: this.seriesId,
          seasonId: this.seasonId,
          limit: this.limit,
          offset: this.offset
        }).then((response) => {
          if (response.count) {
            this.playlistEpisodes = this.playlistEpisodes.concat(response.episodes);
            this.playlistEpisodeCount += response.episodes.length;

            if (response.count > this.playlistEpisodeCount) {
              this.offset += this.limit;
              this.getSeriesEpisodes(callback);
              return;
            }

            this.playListPosition = 0;
            var playerPlaylist = new Array();

            if (this.contentName == 'show') {
              for (var i in this.playlistEpisodes) {
                playerPlaylist.push(this.parseContents(this.playlistEpisodes[i]));
              }

              this.setPopupPlaylist(playerPlaylist);

              this.playerPlaylist = playerPlaylist;
            } else {
              var playlist_slice_point = 0;

              for (var i in this.playlistEpisodes) {
                if (this.playlistEpisodes[i].media_id == this.id) {
                  playlist_slice_point = parseInt(i);
                  continue;
                }

                playerPlaylist.push(this.parseContents(this.playlistEpisodes[i]));
              }

              this.setPopupPlaylist(playerPlaylist);

              this.playerPlaylist = playerPlaylist.slice(playlist_slice_point);

              this.setEpisodeListing(this.playerPlaylist);

              if (this.playerPlaylist && this.playerPlaylist.length) {
                // NOTE: CODE CHANGE @SANGEETH

                // CODE COMMENTED
                this.nextPlaylistPosition = 0;

                // NEW CODE
                let altProfileMode;
                if (localStorage.getItem('altProfileMode')) {
                  altProfileMode = localStorage.getItem('altProfileMode');
                }
                if (altProfileMode === 'default') {
                  this.nextPlaylistPosition = 0;
                }
                // NOTE: END CODE CHANGE @SANGEETH

                var nextPlaylistItem = this.playerPlaylist[this.nextPlaylistPosition];
                this.nextPlaylistItem = nextPlaylistItem;

                this.gt_next_episode_thumbnail_url = (nextPlaylistItem && nextPlaylistItem.images &&  nextPlaylistItem.images.webengage) ? nextPlaylistItem.images.webengage : '';
                this.gt_next_episode_description = (nextPlaylistItem && nextPlaylistItem.shortDescription ) ? nextPlaylistItem.shortDescription : '';
                this.gt_next_episode_id = (nextPlaylistItem && nextPlaylistItem.id ) ? nextPlaylistItem.id: '';

                this.nextPlaylistMediaTitle = nextPlaylistItem.title;
                this.nextPlaylistMediaSNo = nextPlaylistItem.seasonNumber ? nextPlaylistItem.seasonNumber : undefined;
                this.nextPlaylistMediaENo = nextPlaylistItem.episodeNumber ? nextPlaylistItem.episodeNumber : undefined;

                if(nextPlaylistItem && nextPlaylistItem.images && nextPlaylistItem.images.episodeImageUrl) {
                  this.nextEpisodeImage = nextPlaylistItem.images.episodeImageUrl;
                }
              } else {
                this.playerPlaylist = undefined;

                this.gt_next_episode_thumbnail_url = '';
                this.gt_next_episode_description = '';
                this.gt_next_episode_id = '';
              }
            }

            this.setRelatedEpisodes(this.playerPlaylist);

            if (callback) callback();
          }
        }, (error) => {
          // console.log('[PlayerScreen | getSeriesSeasons | error | ]', error);
        });
      },
      assignComUpNextData() {
        if (this.playerPlaylist && this.playerPlaylist.length) {
          // NOTE: CODE CHANGE @SANGEETH

          // CODE COMMENTED
          // this.nextPlaylistPosition = 0;

          // NEW CODE
          let altProfileMode;
          if (localStorage.getItem('altProfileMode')) {
            altProfileMode = localStorage.getItem('altProfileMode');
          }
          if (altProfileMode === 'default') {
            this.nextPlaylistPosition = 0;
          }
          // NOTE: END CODE CHANGE @SANGEETH

          var nextPlaylistItem = this.playerPlaylist[this.nextPlaylistPosition];

          if (!nextPlaylistItem) return;

          if(nextPlaylistItem && nextPlaylistItem.images && nextPlaylistItem.images.episodeImageUrl) {
            this.nextEpisodeImage = nextPlaylistItem.images.episodeImageUrl;
          }

          this.nextPlaylistMediaTitle = nextPlaylistItem.title;
          this.nextPlaylistMediaSNo = nextPlaylistItem.noShow ? false : nextPlaylistItem.seasonNumber;
          this.nextPlaylistMediaENo = nextPlaylistItem.noShow ? false : nextPlaylistItem.episodeNumber;
        } else {
          this.playerPlaylist = undefined;
        }
      },
      playNextPlaylistItem() {
        this.nextPlaylistPosition += 1;

        localStorage.setItem('prevPlayedMediaId', this.id);

        this.nextEpisodePlayLoadMainfest = true;

        var progress = undefined;
        var duration = undefined;
        if (this.vPlayer) {
          this.toggleControls(false);
          this.vToggleToggler(false, 'playNextPlaylistItem');
          this.vToggleMainControls(false);
          progress = this.vPlayer.currentTime;
          duration = this.vPlayer.duration;
        }

        if (!(this.playerPlaylist && this.playerPlaylist.length)) return;

        this.currentPlaylistItem = this.playerPlaylist[this.playListPosition];

        // Assign data to the coming up next tag in player.
        this.assignComUpNextData();

        this.showComUpNextTag = false;

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = true;
        }

        if (altUser && !isNaN(progress) && !isNaN(duration)) {
          this.updateMediaProgress(this.id, progress, duration);
        }

        if (this.currentPlaylistItem.contentName != 'episode') return;

        let altProfileMode;
        if (localStorage.getItem('altProfileMode')) {
          altProfileMode = localStorage.getItem('altProfileMode');
        }

        if (altProfileMode === 'kids') {
          this.setPlayerContent(this.currentPlaylistItem);

          this.id = this.currentPlaylistItem.id;

          // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #880
          // Assign value to 'mediaId' which will be checked in 'getMediaAccess' method.
          this.mediaId = this.currentPlaylistItem.id;
          // NOTE: END CODE CHANGE @SANGEETH - RESOLVED Issue #880

          this.playlistCallbackEvent = true;

          this.playListPosition += 1;

          // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #880
          // Need to check the access before playing the item from playlist. Inorder to check the geo block access
          if (altUser) {
            this.getMediaAccess(() => {
              this.renderEpisodeScreen();
            });
          } else {
            this.renderEpisodeScreen();
          }
          // NOTE: END CODE CHANGE @SANGEETH - RESOLVED Issue #880
        } else {
          this.playlistCallbackEvent = true;
          var routerObj = {
            name: this.currentPlaylistItem.contentName,
            params: {
              id: this.currentPlaylistItem.id
            }
          };

          this.playListPosition += 1;
          this.$router.push(routerObj);
        }
      },
      playComUpNextItem(flag) {
        this.showComUpNextTag = false;

        this.ShowSkipTag = false;

        // if press next episode button then we have to load mpd file
        this.nextEpisodePlayLoadMainfest = true;

        // if press next Episode button then it will call stop event
        this.playRelatedEpisodeClickFlag = true;

        if (this.vPlayer) {
          this.vPlayer.pause();
          this.vPlayer.removeEventListener('timeupdate', this.vHandleProgress);

          // Hide the controls
          this.vToggleMainControls(false);
          this.toggleControls(false);
          this.vToggleToggler(false, 'playComUpNextItem');
          this.vToggleLoader(true);
        }

        let event_action = flag ? 'continuous playback' : 'player';
        this.nextEpisodePlayEventTrigger(event_action);

        this.playNextPlaylistItem();
      },
      languageChangeCB(seriesId) {
        var type = this.$route.query.type;
        var routerObj = {
          name: 'show',
          params: {
            id: seriesId
          }
        };

        this.$router.push(routerObj);
        eventBus.$emit('toggleLanguageFilterEvent', false);
      },
      popupOpenCB(state) {
        if (state) {
          this.vPlayer.pause();
        }
      },
      navOpenCB() {
        eventBus.$off('toggleNavOpenEvent', this.navOpenCB);

        if (this.vPlayer) {
          this.vPlayer.pause();
        }

        eventBus.$on('toggleNavOpenEvent', this.navOpenCB);
      },
      togglePopupKidsExitPinCB() {
        eventBus.$off('togglePopupKidsExitPin', this.togglePopupKidsExitPinCB);

        if (this.vPlayer) {
          this.vPlayer.pause();
        }

        eventBus.$on('togglePopupKidsExitPin', this.togglePopupKidsExitPinCB);
      },
      playRelatedEpisodeClickCB() {
        this.playRelatedEpisodeClickFlag = true

        this.playerPlaylist = undefined;
        this.playlistCallbackEvent = false;
      },
      getUniqueProgressList(currItem, list) {
        var index = -1;
        for (var i in list) {
          if (list[i].media_id === currItem.media_id) {
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
      routeChangeCB() {
        if (this.vPlayer && this.vShaka && this.playerContent) {
          this.vPauseEventCB();
        }
      },
      showSharingCB() {
        // Check for vplayer instance. If not return
        if (!this.vPlayer) return;

        // Pause the player by executing the callback
        if (!this.vPlayer.paused) {
          this.vPlayer.pause();

          if (this.toggleControlTimer) {
            clearTimeout(this.toggleControlTimer);
            this.vToggleToggler(true, 'showSharingCB');
          }
        }
      },
      toggleSigninPopupCB() {
      },
      handlePlayerBeforeRouteLeaveCB() {
        eventBus.$emit('toggleLanguageFilterEvent', false);

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = true;
        }

        if (!altUser) return;

        var contentName = this.$route.name;

        if (contentName == 'show') return;

        if (!this.vPlayer) return;
        var progress = this.vPlayer.currentTime;
        var duration = this.vPlayer.duration;

        if (isNaN(progress) || isNaN(duration)) return;

        this.updateMediaProgress(this.id, progress, duration);
      },
      browserStateBlurCB(state) {
        if (!this.vPlayer) return;

        if (!this.vPlayer.paused) this.vPlayer.pause();
      },
      togglePlayerFavSigninPopupCB() {
        this.pauseVideo();
      },
      stopTriggerForMovieTrilerSwitch() {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          // stop event
          var playerContent = undefined;
          if(localStorage.getItem('currentPlayerDetails')) {
            let metrics = {};
            metrics.stop_time = this.vPlayer && this.vPlayer.currentTime ? this.vPlayer.currentTime : 'N.A'

            playerContent = JSON.parse(localStorage.getItem('currentPlayerDetails'));
            eventAttributeObj.event_action = 'stop';

            eventAttributeObj.content_id = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_id) ? playerContent.eventAttributeObj.content_id : " ";
            eventAttributeObj.content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_title) ? playerContent.eventAttributeObj.content_title.toLowerCase() : " ";
            eventAttributeObj.content_type = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_type) ? playerContent.eventAttributeObj.content_type : " ";
            eventAttributeObj.content_streamid = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_streamid) ? playerContent.eventAttributeObj.content_streamid : "";
            eventAttributeObj.content_url = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_url) ? playerContent.eventAttributeObj.content_url : " ";
            eventAttributeObj.content_duration = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_duration) ? playerContent.eventAttributeObj.content_duration : "";

            if(playerContent && playerContent.currentPlayerType && playerContent.currentPlayerType == 'episode') {
              // eventAttributeObj.parent_content_id =(playerContent && playerContent.eventAttributeObj &&  playerContent.eventAttributeObj.parent_content_id) ? playerContent.eventAttributeObj.parent_content_id : " ";
              eventAttributeObj.parent_content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.parent_content_title) ? playerContent.eventAttributeObj.parent_content_title.toLowerCase() : "";
            }

            window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

            localStorage.removeItem('currentPlayerDetails');
          }
        }
      },
      togglePopupNetworkErrorCB(state) {
        if (!this.vPlayer || !this.vShaka) return;

        if (!this.vPlayer.paused) this.vPlayer.pause();

        this.vExitFullScreenMode();

        if (this.toggleControlTimer) clearTimeout(this.toggleControlTimer);
        this.vControls.removeEventListener('click', this.vControlsClickEventCB);
      },
      determinePlaybackOperation( method, videoTag) {
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

        return localAttributeObj;
      },
      stuffPlaybackAttributes(action) {
        var eventAttributeObj = this.getAWSMACommonAttributes();

        var contentName = this.$route.name;
        var content_url = 'N.A';
        var content_streamid = 'N.A';
        switch (contentName) {
          case 'show':
          content_url = this.playerContent.trailer ? this.playerContent.trailer.trailerUrl : 'N.A';
          content_streamid = this.playerContent.trailer ? this.playerContent.trailer.id : 'N.A';
          break;
          case 'media':
          content_url = this.playerContent.stream ? this.playerContent.stream.streamUrl : 'N.A';
          content_streamid = this.playerContent.stream ? this.playerContent.stream.streamId : 'N.A';
          break;
          case 'episode':
          content_url = this.playerContent.stream ? this.playerContent.stream.streamUrl : 'N.A';
          content_streamid = this.playerContent.stream ? this.playerContent.stream.streamId : 'N.A';
          break;
          default:
          content_url = 'N.A';
          content_streamid = 'N.A';
        }

        eventAttributeObj.content_id = this.playerContent.id ? this.playerContent.id : 'N.A';
        eventAttributeObj.content_title = this.playerContent.title ? this.playerContent.title.toLowerCase() : 'N.A';
        eventAttributeObj.content_url = content_url;
        eventAttributeObj.content_streamid = content_streamid;
        eventAttributeObj.content_type = this.playerContent.contentType ? this.playerContent.contentType : 'N.A';
        eventAttributeObj.content_duration = this.playerContent.durationInSec ? this.playerContent.durationInSec : 'N.A';

        var eventMode = this.getPlayerEventMode();

        eventAttributeObj.event_mode = eventMode ? eventMode : 'N.A';
        eventAttributeObj.event_action = action;

        return eventAttributeObj;
      },
      playContent() {
        // NOTE hide
        this.showOnlyPlayButton = false;
        this.vTogglePlay("play");
      },
      pressBackChangeToPoster() {
        if (screen.orientation.angle == 0) {
          this.toggleLoader(true);
          this.loaderCheck = false;

          this.initRoutePlayerScreen();
          this.playRelatedEpisodeClickFlag = true;

          if(this.vPlayer) {
            if (!this.vPlayer.paused) {
              this.vPlayer.pause();
            } else {
              this.vPlayer.pause();
              this.vPauseEventCB();
            }
          }

          this.flagVideoTag = true;
          this.vExitFullScreenMode();
          let _this = this;
          // Emitting event to kids.vue to hide the player when the user press back button or rotate the screen to portrait
          eventBus.$emit('togglePlayerScreenEvent', false);

          eventBus.$emit("toggleEpisodelistPopup",false);
          eventBus.$emit("togglePlayerVideoResolution", "back");
          localStorage.setItem('awsOrientation', 'portrait');

          // NOTE: NEW CODE CHANGE @SANGEETH
          this.nextPlaylistPosition = 0;
          this.playListPosition = 0;
          this.playerPlaylist = undefined;
          // NOTE: END NEW CODE CHANGE

          this.showComUpNextTag = false;
          this.ShowSkipTag = false;

          this.hidePosterPlayerScreen("none","block");
          this.hideVideoController(false);

          // if (window.mobileAnalyticsClient && this.eventContentViewData) {
          //     setTimeout(()=>{
          //         window.mobileAnalyticsClient.recordEvent( '_content.view', _this.eventContentViewData, {});
          //     },100);
          // }
        } else {
          localStorage.setItem('awsOrientation', 'landscape');
        }
      },
      fullScreenExitEvent(item) {
        if (document.webkitIsFullScreen === false || document.mozFullScreen === false || document.msFullscreenElement === false) {
          // if (this.vPlayer) {
          //   this.vPlayer.pause();
          // }
          this.flagVideoTag = true;
          this.hidePosterPlayerScreen("none","block");
          this.hideVideoController(false);
          this.vExitFullScreenMode();
          this.vToggleLoader(false);
          eventBus.$emit("toggleEpisodelistPopup",false);
          eventBus.$emit("togglePlayerVideoResolution", "back");
        }
      },
      hidePosterPlayerScreen(player,poster) {
        if(document.getElementById('v-player') && document.getElementById('v-poster')) {
          document.getElementById('v-player').style.display = player;
          document.getElementById('v-poster').style.display = poster;
          if(poster == "block") {
            this.showComUpNextTag = false;
            this.ShowSkipTag = false;
            if (this.vPlayer) {
              this.vPlayer.pause();
              this.hideVideoController(false);
            }
          }
        }
      },
      playerPopupViewEvent(event_mode) {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();
          eventAttributeObj.start_time = this.vPlayer && this.vPlayer.currentTime ? this.vPlayer.currentTime : 'N.A';
          eventAttributeObj.event_mode = event_mode;
          window.mobileAnalyticsClient.recordEvent('_popup.view', eventAttributeObj, {});
        }
      },
      handelChromecastPlayback() {
        if (this.vPlayer && localStorage.getItem('currentPlayerDetails')) {
          // if(this.vPlayer.paused) {
          //     this.playContent();
          // } else {
          //     this.pauseVideo();
          //     this.playContent();
          // }

          this.playContent();
          //this.hideVideoController(false);
        }
      },
      windowFocusCB (_event) {
        this.hideVideoController(false);
        this.hidePosterPlayerScreen("none","block");
        eventBus.$emit("toggleEpisodelistPopup",false);
        eventBus.$emit("togglePlayerVideoResolution", "back");
        this.showComUpNextTag = false;
        this.ShowSkipTag = false;
        this.initRoutePlayerScreen();
      },
      windowBlurCB (_event) {
        //onsole.log('[windowBlurCB > _event]', _event);
        this.hidePosterPlayerScreen("none","block");
      },
      setVideoTrackToPlayer(track) {
        if (this.vShaka) {
          let configOfPlayer = this.vShaka.getConfiguration();
          if((track.title).toLowerCase() == "auto") {
            configOfPlayer.abr.enabled = true;
            this.videoResolutionEventTrigger(track.title);
            this.vShaka.configure(configOfPlayer);
          } else {
            configOfPlayer.abr.enabled = false;
            this.vShaka.configure(configOfPlayer);
            this.vShaka.selectVariantTrack(track,true);
            this.videoResolutionEventTrigger(track.title);
          }
        }
      },
      toggleResolutionState(state) {
        if(state) {
          if(state == "back") {
            this.showVideoResolution = false;
            return;
          }
          this.showVideoResolution = true;
          this.videoResolutionPopupState = undefined;
          this.videoResolutionPopupState = (this.vPlayer &&  this.vPlayer.paused) ? 'pause' : 'play';
          this.playerPopupViewEvent('video quality');
          if(this.vPlayer &&  !this.vPlayer.paused) {
            this.vPlayer.pause();
          }
        } else {
          this.showVideoResolution = false;

          if(this.videoResolutionPopupState && this.videoResolutionPopupState == 'play') {
            this.vPlayer.play();
          } else {
            this.vPlayer.pause();
          }
        }
      },
      episodePopupState(state) {
        this.showPopupEpisodeList = state;
        if(state) {
          this.playerPopupViewEvent('other episodes');
        }
        if(!state) {
          if(this.episodePopupPlayState && this.vPlayer) {
            if(this.episodePopupPlayState == 'play') {
              this.vPlayer.play();
            } else {
              this.vPlayer.pause();
            }
          }
        }
      },
      loadContentAtPlayerScreen(content) {
        this.containInfoDetails = content;

        // NOTE: CODE CHANGE @SANGEETH - Issue #843 RESOLVED
        // This data property will be checked in 'vTogglePlay' method, which will change the value of 'plrVideoLoaded' data property which determines whether the content is loaded in the player or not.
        this.nextEpisodePlayLoadMainfest = true;
        // NOTE: END CODE CHANGE @SANGEETH - Issue #843 RESOLVED

        this.playerPlaylist = null;
        this.id = null;
        this.playlistEpisodes = [];

        this.makeFullscreen();
        this.initMountedPlayerScreen();
      },
      toggleEpisodelistPopupCB (state) {
        this.episodePopupState(state);
      }
    },
    created() {
      // NOTE: NEW CODE CHANGE
      eventBus.$on('initiatePlayEvent', this.initiatePlayCB);
      // NOTE: END NEW CODE CHANGE

      eventBus.$on('openSearchEvent', this.pauseVideo);
      eventBus.$on('toggleSigninPopupEvent', this.toggleSigninPopupCB);
      eventBus.$on('playTrailerEvent', this.playTrailerCallback);
      eventBus.$on('playStreamEvent', this.playStreamCB);
      eventBus.$on('languageChangeEvent', this.languageChangeCB);
      eventBus.$on('togglePopupSearch', this.popupOpenCB);
      eventBus.$on('toggleNavOpenEvent', this.navOpenCB);
      eventBus.$on('togglePopupKidsExitPin', this.togglePopupKidsExitPinCB);
      eventBus.$on('playRelatedEpisodeClickEvent', this.playRelatedEpisodeClickCB);
      eventBus.$on('showSharingEvent', this.showSharingCB);
      eventBus.$on('playTrailerBtnClickEvent', this.playTrailerBtnClickCB);
      eventBus.$on('playMovieBtnClickEvent', this.playMovieBtnClickCB);
      eventBus.$on('togglePlayerFavSigninPopupEvent', this.togglePlayerFavSigninPopupCB);
      eventBus.$on('handlePlayerBeforeRouteLeave', this.handlePlayerBeforeRouteLeaveCB);
      eventBus.$on('togglePopupNetworkError', this.togglePopupNetworkErrorCB);
      eventBus.$on('browserStateBlurEvent', this.browserStateBlurCB);
      eventBus.$on('toggleVideoAddToFavErrorVideoPause',this.pauseVideo);
      eventBus.$on("togglePlayContent",this.playContent);
      eventBus.$on("toggleChromeCastPlaying", this.handelChromecastPlayback);
      eventBus.$on("toggleFlagForPlay",(state) => {
        this.playlistCallbackEvent = true;
      });
      // NOTE: CODE CHANGE @SANGEETH
      eventBus.$on('toggleEpisodelistPopup', this.toggleEpisodelistPopupCB);
      // NOTE: END CODE CHANGE @SANGEETH

      eventBus.$on('togglePlayerVideoResolution', this.toggleResolutionState);
      eventBus.$on("togglePlayerSetResolution",(track) => {
        // console.log("kidsPlayer.vue || togglePlayerSetResolution");
        this.setVideoTrackToPlayer()
      });
      eventBus.$on("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);

      eventBus.$on("toggleSendDataToPlayerScreenForEpisodeList", this.loadContentAtPlayerScreen);
    },
    mounted() {
      // NOTE for testing localhost part

      if(location.hostname != "localhost") {
        window.addEventListener('focus', this.windowFocusCB);
        window.addEventListener('blur', this.windowBlurCB);
      }

      let _this = this;
      localStorage.setItem('awsOrientation', 'portrait');
      window.addEventListener('orientationchange', this.pressBackChangeToPoster);
      if (this.appActive) {
        this.initMountedPlayerScreen();
      }
    },
    components: {
      'popup-episode-listing':PopupEpisodesList,
      'popup-player-video-resolution':PopupVideoResolutionChange,
    },
    beforeDestroy() {
      eventBus.$off("togglePlayContent",this.playContent);
      eventBus.$off("togglePlayerSetResolution");
      eventBus.$off("toggleEpisodelistPopup", this.toggleEpisodelistPopupCB);
      eventBus.$off("togglePlayerVideoResolution", this.toggleResolutionState);
      eventBus.$off("toggleChromeCastPlaying",this.handelChromecastPlayback);
      eventBus.$off('toggleSendDataToPlayerScreen', this.loadContentAtPlayerScreen);
      eventBus.$off("toggleSendDataToPlayerScreenForEpisodeList", this.loadContentAtPlayerScreen);

      this.setCurrentShowPlaylists(undefined);
      this.setCurrentEpisodeInfo(undefined);

      this.setPlayerContent(undefined);
      this.playerPlaylist = undefined;

      if (this.vShaka) {
        this.vShaka.destroy().then(() => {
          // console.log('shaka destroy');
        }).catch((error) => {
          // console.log('Error shaka destroy');
        })
      }
    },
    mixins: [altMixins]
  }
</script>
