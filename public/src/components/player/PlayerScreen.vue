<template>
  <div>
    <div class="v-contain" id="v-contain">
      <video id="v-poster" class="v-player player-default" style="width:100%;" :poster="playerPosterImage" :src="silentTrack"></video>
      <video id="v-player" class="v-player player-default" style="width:100%;" :poster="plrPosterImage" :src="silentTrack"></video>
      
      <div id="adContainer"></div>

      <div class="v-cmup-nxt" v-show="showComUpNextTag" @click="playComUpNextItem(true)">
        <div class="v-cmup-nxt-bx">
          <div class="v-cmnxtbx-img">
            <img :src="nextEpisodeImage" alt="v-cmngup">
          </div>
          <div class="v-cmnxtbx-text" >
            <p style="font-size:15px;font-weight:bold;">NEXT EPISODE IN {{showComUpNextTimeNextEpisodeCountDown}} </p>
            <p v-show="nextPlaylistMediaTitle" style="padding: 8px 2px  8px 0;font-size: 12px;font-weight: normal;">{{nextPlaylistMediaTitle}}</p>
            <p style="font-size: 12px;font-weight: bold;"><span v-show="nextPlaylistMediaSNo">S{{nextPlaylistMediaSNo}} </span><span v-show="nextPlaylistMediaENo">| E{{nextPlaylistMediaENo}}</span></p>
            <img src="../../assets/player/v2/ic_Play.png" class="play-icon-on-player-nextEpisode">
          </div>
        </div>
      </div>

      <div v-if="ShowSkipTag" @click="skipActionForward">
        <span class="skipTag">SKIP INTRO</span>
      </div>

      <popup-episode-listing v-show="showPopupEpisodeList"></popup-episode-listing>
      <popup-player-video-resolution v-show="showVideoResolution"></popup-player-video-resolution>

      <!-- <p class="alt-tag vdo-tag tag-right" v-show="showTagTrailer" style="position: absolute; top: 0;">TRAILER</p>
      <p class="alt-tag vdo-tag tag-left" v-show="showTagComingsoon" style="position: absolute; top: 0;">COMING SOON</p> -->

      <div class="v-controls" id="v-controls" style="display:none">
        <div class="v-toggle" id="v-toggle">
          <img src="../../assets/player/v2/backward.png" alt="v-backward" id="v-backward">
          <img src="../../assets/player/v2/ic_Play.png" alt="v-pause" id="v-toggler">
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
          <img src="../../assets/player/v2/ic_episodes.png" alt="v-episodesList" id="v-episodesList" style="width:31px" v-if="episodeIdentifier" @click="vEpisodesListDisplay">
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
          <div v-if="movieTagName && !showTagTrailer">
            <span class="player-header-episode">MOVIE</span>
          </div>
          <div class="">
             <h3 v-if="playerContent && playerContent.title" class="player-title">{{makeTitleUpperCase(this.playerContent.title)}}</h3>
          </div>
        </div>
        <div id="player-cast" v-if="chromeCaseShow">
          <google-cast-launcher class="chrome-cast-icon" ></google-cast-launcher>
        </div>
      </div>
    </div>

    <div id="v-loader-play" class="v-loader" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998;display:none;">
      <div class="loading" style="position: relative;width: 56px;height: 56px;margin: 0 auto;top: 50%;transform: translateY(-50%);">
        <div class="inner"></div>
      </div>
    </div>
    <div id="v-loader" class="v-loader" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 998;" v-show="showVideoLoader">
        
        <div  v-if="buffer_campaign" style="position: relative;height: 56px;margin: 0 auto;top: 50%;transform: translateY(-50%); display:flex;left: 40%;">
            <div><img :src="buffer_campaign.apng" style="background: transparent;width: 85px;"></div>
            <div style=" white-space: normal;
          width: 40vw;
          margin-top: 0px;
          position: relative;
        "> 
        <div style="position: absolute; top: 25%;"> {{buffer_campaign.buffer_text}} </div>
        
        </div>
      </div> 

      <div v-else  class="loading" style="position: relative;width: 56px;height: 56px;margin: 0 auto;top: 50%;transform: translateY(-50%);">
          <div class="inner"></div>
        </div>

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

  var adsManager;
  var adsLoader;
  var adDisplayContainer;
  var intervalTimer;
  var playButton;
  var videoContent;

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
        showVideoLoader: false,
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
        limit: 10,
        offset: 0,
        comingSoonTag: false,
        plrPosterImage: undefined,
        playerPosterImage:undefined,
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
        showEpisodeIcon : undefined,
        playerPageheader: undefined,
        popupPlayer: false,
        contentTitle:undefined,
        movieTagName:undefined,
        isPlaybackExitEvent: false,
        // NOTE: CODE CHANGE @SANGEETH
        // Data property is been added to check whether the user is playing the last item in the playlist or not. If playing the last episode, no need to show the next episode button on the player controls and hence set 'gt_next_episode_id' to false
        isPlaylistEnd: false,
        // NOTE: END CODE CHANGE @SANGEETH
        episodeListContent:false,
        // NOTE added by sumit for webEngage
        gt_next_episode_id_webenage : undefined,
        // NOTE pressBackChangeToPoster function we made shaka unload so matrix we can not get at stop events.
        stopMatrixInfo: {},
        // NOTE: CODE CHANGE @SANGEETH - Issue #929
        isHeaderTitleSet: false,
        // NOTE: handle casting.
        chromeCaseShow: false,
        handleEventPlayer:true,
        trailerCheckCounter: false,
        isActiveAdd: false,
        isContinousPlayback: false,
        fullscreenExitProgress: {},
        buffer_campaign: null,
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
        'homeActiveSectionTitle',
        // default mode subcategory watching section
        'defaultModeCurrentSubcategory',
        'currentEpisodeInfo',
        'currentShowPlaylists',
        'showTrailerInfo',
        'playerScreenSource'
      ]),
    },
    watch: {
      appActive() {
        this.initActivePlayerScreen();
      },
      '$route'(to, from) {
        this.flagRouteChanged = true;
        this.containInfoDetails = undefined;
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
        'setShowtrailerInfo',
        'setCurrentShowPlaylists',
        'setCurrentEpisodeInfo',
        'setRelatedEpisodes',
        'setPopupPlaylist',
        'setPlayerScreenSource'
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
      playAds() {
          //// console.log("playAds ***");
          videoContent.load();
          adDisplayContainer.initialize();
          try {
            var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
            
            var h = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
            
            adsManager.init(w, h, google.ima.ViewMode.NORMAL)
   
            adsManager.start();
          } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
            videoContent.play();
          }
        },
      ads() {
        let _this = this;
        // var adsManager;
        // var adsLoader;
        // var adDisplayContainer;
        // var intervalTimer;
        // var playButton;
        // var videoContent;

        function init() {
          // console.log("init **********");
          // console.log("google", google);
          if(!google) {
            _this.vToggler.addEventListener('click', _this.vTogglePlay);
            return;
          } 
          videoContent = document.getElementById('v-player');
          playButton = document.getElementById('v-toggler');
          playButton.removeEventListener('click', _this.playAds);
          
          _this.vToggler.removeEventListener('click', _this.vTogglePlay);
          playButton.addEventListener('click', _this.playAds);
          setUpIMA();
        }

        function setUpIMA() {
          // Create the ad display container.
          createAdDisplayContainer();
          // Create ads loader.
          adsLoader = new google.ima.AdsLoader(adDisplayContainer);
          // Listen and respond to ads loaded and error events.
          adsLoader.addEventListener(
              google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
              onAdsManagerLoaded,
              false);
          adsLoader.addEventListener(
              google.ima.AdErrorEvent.Type.AD_ERROR,
              onAdError,
              false);
          var contentEndedListener = function() {adsLoader.contentComplete();};
          videoContent.onended = contentEndedListener;

          // Request video ads.
        var adsRequest = new google.ima.AdsRequest();
         adsRequest.adTagUrl = "https://pubads.g.doubleclick.net/gampad/ads?sz=720x480|360x240|640x360&iu=/21719602/"+ _this.playerContent.campaign_ads +"&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]";
          adsLoader.requestAds(adsRequest);

        }

        function createAdDisplayContainer() {
          adDisplayContainer = new google.ima.AdDisplayContainer(
              document.getElementById('adContainer'), videoContent);
        }

        // function playAds() {
        //   //// console.log("playAds ***");
        //   videoContent.load();
        //   adDisplayContainer.initialize();
        //   try {
        //     var w = window.innerWidth
        //     || document.documentElement.clientWidth
        //     || document.body.clientWidth;
            
        //     var h = window.innerHeight
        //     || document.documentElement.clientHeight
        //     || document.body.clientHeight;
            
        //     adsManager.init(w, h, google.ima.ViewMode.NORMAL)
   
        //     adsManager.start();
        //   } catch (adError) {
        //     // An error may be thrown if there was a problem with the VAST response.
        //     videoContent.play();
        //   }
        // }

        function onAdsManagerLoaded(adsManagerLoadedEvent) {
          // Get the ads manager.
          var adsRenderingSettings = new google.ima.AdsRenderingSettings();
          adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
          // videoContent should be set to the content video element.
          adsManager = adsManagerLoadedEvent.getAdsManager(
              videoContent, adsRenderingSettings);

          // Add listeners to the required events.
          adsManager.addEventListener(
              google.ima.AdErrorEvent.Type.AD_ERROR,
              onAdError);
          adsManager.addEventListener(
              google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
              onContentPauseRequested);
          adsManager.addEventListener(
              google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
              onContentResumeRequested);
          adsManager.addEventListener(
              google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
              onAdEvent);

          // Listen to any additional events, if necessary.
          adsManager.removeEventListener(
              google.ima.AdEvent.Type.LOADED,
              onAdEvent);
          adsManager.removeEventListener(
              google.ima.AdEvent.Type.STARTED,
              onAdEvent);
          adsManager.removeEventListener(
              google.ima.AdEvent.Type.COMPLETE,
              onAdEvent);


          adsManager.addEventListener(
              google.ima.AdEvent.Type.LOADED,
              onAdEvent);
          adsManager.addEventListener(
              google.ima.AdEvent.Type.STARTED,
              onAdEvent);
          adsManager.addEventListener(
              google.ima.AdEvent.Type.COMPLETE,
              onAdEvent);
        }

        function onAdEvent(adEvent) {
          // console.log("google.ima.AdEvent.Type.", google.ima.AdEvent.Type);
          // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
          // don't have ad object associated.
          var ad = adEvent.getAd();

          switch (adEvent.type) {
            case google.ima.AdEvent.Type.LOADED:
              if (ad.isLinear()) {
               // console.log("ads loaded");
               _this.vToggleLoader(true);
               document.getElementById('v-controls').style.display = 'none';
                
              }
              break;
            case google.ima.AdEvent.Type.STARTED:
               
              if (ad.isLinear()) {
         
                // console.log("ads started");
               document.getElementById('v-controls').style.display = 'none';

                intervalTimer = setInterval(
                    function() {
                      var remainingTime = adsManager.getRemainingTime();
                      if (remainingTime) {
                        // console.log("reached conosle");
                        if (document.getElementById('v-toggle')) {
                          document.getElementById('v-toggle').style.display = "none"
                        }
                         _this.vToggleLoader(false);
                      }
                      // console.log(remainingTime);
                    },
                    300); // every 300ms
              }
              break;
            case google.ima.AdEvent.Type.COMPLETE:
              
              if (ad.isLinear()) {
                // console.log("COMPLETE")
              }
              break;
              case google.ima.AdEvent.Type.ALL_ADS_COMPLETED: 
              // console.log("ALL_ADS_COMPLETED");
                completeAdd();
              break;
          }
        }
        function completeAdd() {
            // console.log("end");
            document.getElementById('v-controls').style.display = 'block';
            if (document.getElementById('v-toggle')) {
                document.getElementById('v-toggle').style.display = "flex"
              }
            _this.isActiveAdd = false; 
            _this.isContinousPlayback = false;
            _this.vToggler.addEventListener('click', _this.vTogglePlay);
            _this.vTogglePlay();
            playButton.removeEventListener('click', _this.playAds);
          clearInterval(intervalTimer);
        }
        function onAdError(adErrorEvent) {
          // Handle the error logging.
          // console.log(adErrorEvent.getError());
         // playButton.removeEventListener('click', playAds);
          // // console.log("adsManager")
          // if(adsManager)
          // adsManager.destroy();
        }

        function onContentPauseRequested() {
        }

        function onContentResumeRequested() {
        }
        init();
      },
      initRoutePlayerScreen() {
        this.showComUpNextTag = false;
        this.plrVideoLoaded = false;
        this.plrVideoEnded = false;
        this.contentDrmBlocked = false;
        this.limit = 10;
        this.offset = 0;
        this.playlistEpisodeCount = 0;
        this.playlistEpisodes = new Array();
        this.skipIntroEventFlag = false;
        this.checkChromeCast = false;
        this.plrLoadedVideoTypeMovieTrailer = false;
        this.nextEpisodePlayLoadMainfest = true;
        this.eventContentViewData = false;
        this.loaderCheck = false;

        this.setCurrentShowPlaylists(undefined);

        // Hide the Rent now popup when route changes or back button is pressed
        // NOTE hide by sumit from multiple event tigger 11.06.2018 ********
        // eventBus.$emit('toggleRentNowPopupEvent', false);
        // eventBus.$emit('toggleRentTvodItemEvent', false);

        eventBus.$emit('toggleGeoBlockEvent', false);

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
          // console.log("test----->")
          if (document.getElementsByClassName('app-bar')[0]) {
            document.getElementsByClassName('app-bar')[0].style.display = "block"
          }
          
        this.isActiveAdd = false;
        this.isContinousPlayback = false;

        this.hideVideoController(false);
        // NOTE initial state should be poster display
        this.hidePosterPlayerScreen("block", "none");

        // @sumit v-player height
        if(document.getElementById('v-player')) {
          document.getElementById('v-player').style.height = "auto";
        }

        this.setPlayerContent(undefined);

        this.showEpisodeIcon = false;

        this.comingSoonTag = false;
        this.showLoginTag = false;
        this.showSubTag = false;
        this.showRentTag = false;
        this.contentRestricted = false;
        this.contentGeoBlocked = false;

        this.showComUpNextTag = false;
        this.showDrmNotSupportError = true;
        this.showEnablePcError = true;

        this.movieTagName = false;

        // NOTE poster added default
        this.plrPosterImage ='/src/assets/alt-cover.jpg';
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
          // NOTE: CODE CHANGE @SANGEETH
          // Event emit should be off at this moment. Otherwise in mobile devices the event will trigger multiple times.
          if (this.contentName == 'episode') {
            //NOTE commented by sumit for, playing other episode that time eventbus not got available.

            eventBus.$off("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);
          }
          // NOTE: END CODE CHANGE @SANGEETH

          // NOTE if media,remove the trailer for show
          if(this.contentName == 'media' ) {
            if (this.containInfoDetails && this.containInfoDetails.bts) {
             // console.log("BTS");
            } else {
               this.setShowtrailerInfo(undefined);
            }
            
          }

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
          let current_time = this.vPlayer.currentTime;
          let endTime = this.playerContent.skipIntro.endskipintro ? parseInt(this.playerContent.skipIntro.endskipintro) : undefined;
          if(endTime) {
            this.vPlayer.currentTime = endTime;
          }

          this.ShowSkipTag = false;
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
        var containerOfTrack = [];
        containerOfTrack.push(tracks[0]);
        tracks.shift();
        for(let i in  tracks) {
          if(first == tracks[i].height) {
            break;
          }
          containerOfTrack.push(tracks[i]);
        }
        containerOfTrack.sort(function(a,b) {
          return a.height - b.height;
        });
        return containerOfTrack;
      },
      vPlayerVideoQuality() {
        if(this.vShaka) {
          let videoTracksList = undefined;
          let filterTracks = undefined;
          videoTracksList = this.vShaka.getVariantTracks();
          filterTracks = this.filterVideoTrackList(videoTracksList);
          this.filterVideoResolutation(filterTracks);
          this.twoSeratePart();
          eventBus.$emit("togglePlayerVideoResolution",true);
        }
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

        this.ShowSkipTag = false;
        this.setShowtrailerInfo(undefined);

        this.getTheContents(() => {
          if (!this.playerContent) return;
          this.playerPageheader = this.playerContent.title;

          // if kids content is there,redirect to home page, as per new requirement @sumit
          // if(this.playerContent.kidsContent) {
          //   this.$router.push({ name: 'home' });
          //   return;
          // }

          if (altProfileMode == 'kids' && !this.playerContent.kidsContent) {
            this.$router.push({ name: 'home' });
            return;
          }

          this.getSeriesSeasons(() => {
            this.getSeriesEpisodes(() => {
              this.setShowtrailerInfo(this.playerContent);

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

        this.showTagTrailer = true;
        this.gt_next_episode_id = '';

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
                //this.showOnlyPlayButton = true;
                this.hideVideoController(true, 'renderSeriesScreen');
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
              // this.showOnlyPlayButton = true;
              this.hideVideoController(true, 'renderSeriesScreen');
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
          eventAttributeObj.content_url = this.getContentUrl();

          // CODE CHANGE @SANGEETH - Issue #1013
          // As per new requirement.
          eventAttributeObj.content_type = 'show details';
          // END OF CODE CHANGE

          let content_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'category';

          eventAttributeObj.content_source = content_source;

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

          this.playerPageheader = this.playerContent.title;

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
            case 'video':
            // NOTE for BTS
            this.processMovieContent();
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
          // this.vToggleLoader(true);

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
                // NOTE: THE BELOW METHOD CALL IS REQUIRED
                // NOTE: sumit commented for hiding controller
                // this.hideVideoController(true, 'renderTrailerScreen');
              });
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);
              this.toggleLoader(false);

              // Notify the player that the loaded content is trailer
              this.plrLoadedVideoType = 'trailer';
              // NOTE: THE BELOW METHOD CALL IS REQUIRED
              // NOTE: sumit commented for hiding controller
              // this.hideVideoController(true, 'renderTrailerScreen');
            }
          } else {
            // If anonymous user, and content is DRM, don't play the content.
            // instead hide the controls
            if (this.plrIsDrmVideo) {
                this.toggleControls(false); 
              this.vToggleToggler(false, 'renderTrailerScreen');
              this.vToggleMainControls(false);
              // NOTE: THE BELOW METHOD CALL IS REQUIRED
              // NOTE: sumit commented for hiding controller
              // this.hideVideoController(true, 'renderTrailerScreen');
            } else {
              // Show the play button for first time
              // this.vUpdateButton();
              // Hide the loader
              this.vToggleLoader(false);
              // NOTE: THE BELOW METHOD CALL IS REQUIRED
              // NOTE: sumit commented for hiding controller
              // this.hideVideoController(true, 'renderTrailerScreen');
            }

            this.toggleLoader(false);

            // Notify the player that the loaded content is trailer
            this.plrLoadedVideoType = 'trailer';
          }
          // USE play button
          if(this.containInfoDetails) {
            this.hideVideoController(true, 'renderSeriesScreen');
          }
        });
      },
      processEpisodeContent() {
        this.seriesId = this.playerContent.seriesId;
        this.seasonId = this.playerContent.seasonId;

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
        if (this.homeActiveSectionTitle === 'Watching' || this.defaultModeCurrentSubcategory === 'Continue Watching' || this.defaultModeCurrentSubcategory === 'Watching') {
          // NOTE bug Issue #759
          this.gt_next_episode_id = true;
          // NOTE commented by sumit and for the get playlist at watching section
          //  postGetEpisodes();

          this.getSeriesEpisodes(() => {
            postGetEpisodes();
          });
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

        this.episodeIdentifier = true;

        // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #837
        // If the user is playing the last episode, the next playlist button should be disabled

        // NOTE  &sumit for checking this.playerPlaylist are there or not,
        // when we play last episode(directly) then,this.playerPlaylist get undefined Issue #884
        if(this.playerPlaylist && this.playerPlaylist.length) {
          this.gt_next_episode_id = !(this.playListPosition === this.playerPlaylist.length);
        }
        // NOTE: END CODE CHANGE @SANGEETH - RESOLVED Issue #837

        this.configurePlayerMetadata();

        // Disable all the trialer data, because for episode rendering, trailer data is not required
        this.plrTrailerAvailable = false;
        // this.plrTrailerUrl = undefined;
        this.plrIsTrailerDrm = false;
        this.plrTrailerId = undefined;

        if (!this.playerContent) return;

        this.headerEpisodeDetails = {
          "episodeNumber": this.playerContent.episodeNumber ? this.playerContent.episodeNumber : "",
          "seasonNumber": this.playerContent.seasonNumber ? this.playerContent.seasonNumber : ""
        }

        // NOTE: CODE CHANGE @SANGEETH
        // Set this data property the value of title of the current player content, so that when the contents from the playlist is playing, the title will change accordingly.
        this.playerPageheader = this.playerContent.title;

        // NOTE: END CODE CHANGE @SANGEETH

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

          this.hideVideoController(true, 'renderEpisodeScreen');

          // NOTE hack ****
          this.showEpisodeIcon = true;

          if (document.getElementById('v-toggle')) {
                  document.getElementById('v-toggle').style.display = "flex"
                }
            // NOTE ads
          if(this.playerContent.campaign_ads && !this.getProgressForAds()) {
            this.isContinousPlayback = true;
            this.isActiveAdd = true;
            this.ads();
          }
        // end ads

          if (altUser) {
            this.getPlayerProgress(() => {
              // If user data exists, treal all the episodes as drm content, inorder to add them to the watching list

              // NOTE episode is setting from related season. for register user only
              // if(this.currentEpisodeInfo) {
              //   this.setPlayerContent(this.currentEpisodeInfo);
              //   this.setCurrentEpisodeInfo(undefined);
              //   this.plrStreamId = this.playerContent.stream && this.playerContent.stream.streamId ? this.playerContent.stream.streamId : undefined;
              // }

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

        this.movieTagName = true;
        if (this.playerContent && this.playerContent.contentType == 'video') {
          this.movieTagName = false;
        }
        // console.log("this.playerContent || renderMovieScreen", this.playerContent);

        this.configurePlayerMetadata();

        this.mediaId = this.progressId = this.playerContent.contentId;

        // hide
        this.gt_next_episode_id = '';
        this.playerPlaylist = undefined;

        this.gt_next_episode_thumbnail_url = '';
        this.gt_next_episode_description = '';
        this.gt_next_episode_id = '';
        this.gt_next_episode_id_webenage = ' ';
        //

        // Get the user data
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // NOTE for recently watch media controller should display
        // for watching only display not from media

        if(this.$route.name && this.$route.name != 'media') {
          this.loaderCheck = true;
        }

        this.plrVideoLoaded = false;

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
              } else {
                  this.toggleControls(false); 
                this.vToggleToggler(false, 'renderMovieScreen');
                this.vToggleLoader(false);
              }
            } else {
              this.contentRestricted = true;
              this.vToggleLoader(false);
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
            }
            // else if (this.playerContent.trailer) {
            //   this.plrVideoUrl = this.playerContent.trailer.trailerUrl;
            //   this.plrIsDrmVideo = false;
            //   this.plrLoadedVideoType = 'trailer';
            //
            //   this.contentRestricted = false;
            //   this.contentGeoBlocked = false;
            // }
            else {
                this.toggleControls(false); 
              this.vToggleToggler(false, 'renderMovieScreen else');
              this.vToggleLoader(false);
              // NOTE content restricted true for movie
              this.contentRestricted = true;
            }
            this.vToggleLoader(false);
            this.toggleLoader(false);
          }

          this.vToggleLoader(false);
          // NOTE for displaying controllers

          if(this.containInfoDetails) {
              this.toggleControls(true);
            if(this.vToggler) {
              this.vToggler.style.display = 'block';
            }
            this.hideVideoController(true);
          }

          this.containInfoDetails = null;
        });

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = this.playerContent.contentId;
          eventAttributeObj.content_title = this.playerContent.title.toLowerCase();
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_type = 'movie details';

          let content_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'category';

          eventAttributeObj.content_source = content_source;

          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
            eventAttributeObj.content_type = 'trailer';
            }
            if (this.$route.name && this.$route.name == 'media') {
              if(this.plrLoadedVideoType && this.plrLoadedVideoType == 'trailer') {
                eventAttributeObj.content_type = 'trailer';
              }
            }

          if(this.eventContentViewData) {
            return;
          }

          this.eventContentViewData = eventAttributeObj;

          window.mobileAnalyticsClient.recordEvent('_content.view', eventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events

      },
      processPosterContent() {
        // console.log('[processPosterContent]');

        this.playerPlaylist = undefined;
        this.renderPosterScreen();
      },
      renderPosterScreen() {
        // console.log('[renderPosterScreen]');

        this.configurePlayerMetadata();

        // Set the progressId to undefined, because trailer doesn't have continue play
        this.progressId = undefined;

        // NOTE: MADE A STAETEMENT LIKE THIS BEFORE. DON'T KNOW WHATS THE PURPOSE
        // NEED CLARIFICATION. FOR FIXING ISSUE #1051, MADE THE BELOW CHANGES
        // // For content type as poster, trailer or stream will not be there
        // this.plrVideoUrl = undefined;

        this.contentRestricted = false;

        if (this.playerContent && this.playerContent.trailer) {
          this.plrVideoUrl = this.playerContent.trailer.trailerUrl;
        } else {
          this.plrVideoUrl = undefined;
        }

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
            // console.log('[renderPosterScreen > this.contentRestricted]', this.contentRestricted);

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
              // Hide the loader
              this.vToggleLoader(false);

              // NOTE this for play trailer only @@@
              if(this.containInfoDetails) {
                this.vToggleLoader(false);
                this.toggleLoader(false);
                //this.showOnlyPlayButton = true;
                this.hideVideoController(true, 'renderPosterScreen');

                this.contentRestricted = false;
              }

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
              this.vToggleLoader(false);
              this.toggleLoader(false);

              // NOTE this for play trailer only @@@
              if(this.containInfoDetails) {
                //this.showOnlyPlayButton = true;
                this.hideVideoController(true, 'renderPosterScreen');
              }
            }

            // Notify the player that the loaded content is trailer
            this.plrLoadedVideoType = 'poster';
          }
        });
      },
      configurePlayerMetadata() {
        if (!this.playerContent) return;

        this.comingSoonTag = this.playerContent.comingSoon;
        this.plrPosterImage = (this.playerContent.images && this.playerContent.images.cover) ? this.playerContent.images.cover : '/src/assets/alt-cover.jpg';

        // NOTE epidose poster don not changes

        if(this.playerContent.contentName != 'episode' && !this.playerContent.bts) {
          this.playerPosterImage = (this.playerContent.images && this.playerContent.images.cover) ? this.playerContent.images.cover : '/src/assets/alt-cover.jpg';
        }


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
      getProgressForAds(id) {
        let mediaProgressList = undefined;
        if (localStorage.getItem('mediaProgressList')) {
          mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
        }
       let cId =  id ? id : this.playerContent.id;
        // console.log("cID", cId)
        for (var j in mediaProgressList) {
          if (mediaProgressList[j].media_id == cId) {
             if(mediaProgressList[j].progress && mediaProgressList[j].progress != 100) {
               return true;
             }
          }
        }
        return false;
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

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;

            /**
             * Issue #924 RESOLVED next.playback event issue
             * CODE CHANGE @SANGEETH
             */
            eventAttributeObj.parent_content_title = (this.playerContent && this.playerContent.seriesTitle) ? this.playerContent.seriesTitle.toLowerCase() : 'N.A';
            /**
             * END Issue #924 RESOLVED
             */
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

          eventAttributeObj.content_title = (this.playerContent && this.playerContent.title) ? this.playerContent.title.toLowerCase() : 'N.A';
          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : 'N.A';
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : 'N.A';
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : 'N.A';

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          eventAttributeObj.event_action = event_action;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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
          eventAttributeObj.content_url = this.getContentUrl();
          // eventAttributeObj.content_type = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';


          eventAttributeObj.event_action = event_action;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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
          if (this.playerContent && this.playerContent.contentName == 'episode') {
            let content_title = 'Ep' + this.playerContent.episodeNumber + '-' + this.playerContent.title;
            eventAttributeObj.content_title = content_title ? content_title.toLowerCase() : 'N.A';
          }
          if (this.playerContent && this.playerContent.seriesTitle) {
            eventAttributeObj.parent_content_title = this.playerContent.seriesTitle.toLowerCase();
          }

          eventAttributeObj.event_source = 'player';

          window.mobileAnalyticsClient.recordEvent('_content.quality', eventAttributeObj, {});
        }
      },
      backwardForwardEventTrigger(start_time,stop_time,event_action) {
        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
          * END CODE CHANGE - Issue #918
          */

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;

          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.getContentUrl();

          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
          eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          eventAttributeObj.event_action = event_action;

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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

        document.getElementById('listingEpisodeBody').style.height = (parseInt(screen.height) - 120) + "px";
        document.getElementById('listingEpisodeBody').style.overflow = "auto";
        document.getElementById('body').style.height = (parseInt(screen.height)) + "px";
        document.getElementById('body').style.overflow='auto';

        eventBus.$emit("toggleEpisodelistPopup", true);
      },
      configurePlayerSettings() {
        this.vContain = document.getElementById('v-contain');
        this.vControls = document.getElementById('v-controls');
        this.vProgress = document.getElementById('v-progress');
        this.vLoader = document.getElementById('v-loader');
        this.vToggler = document.getElementById('v-toggler');
        this.vCurrentTime = document.getElementById('v-current-time');
        this.vDuration = document.getElementById('v-duration');
        this.vMainCtrls = document.getElementById('v-main-ctrls');
        this.vMainHeader = document.getElementById('v-main-header');
        // this.vFullsrcSwitch = document.getElementById('v-fullsrc-switch');
        this.vBackward = document.getElementById('v-backward');
        this.vForward = document.getElementById('v-forward');
        this.vEpisodesList = document.getElementById('v-episodesList');


        this.vShaka.addEventListener('buffering', this.vShakaBufferingCB);
        if(this.vPlayer) {
        }

       
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
          // console.log(2)
         // this.vToggler.removeEventListener('click', this.vTogglePlay);
        }
           // console.log("configurePlayerSettings >>>>>>>>", this.isActiveAdd, this.playerContent.campaign_ads);
        if(!this.playerContent.campaign_ads  || ( this.playerContent.campaign_ads && this.getProgressForAds())) {
           this.vToggler.removeEventListener('click', this.playAds);
           this.vToggler.removeEventListener('click', this.vTogglePlay);
          this.vToggler.addEventListener('click', this.vTogglePlay);
        } 

        if(this.vForward && this.vBackward) {
          this.vBackward.removeEventListener('click', this.vBackwardPlay);
          this.vForward.removeEventListener('click', this.vForwardPlay);
        }
        this.vBackward.addEventListener('click', this.vBackwardPlay);
        this.vForward.addEventListener('click', this.vForwardPlay);
        // if(this.vEpisodesList) {
        //   this.vEpisodesList.removeEventListener("click",this.vEpisodesListDisplay);
        //   this.vEpisodesList.addEventListener("click",this.vEpisodesListDisplay);
        // }

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
            // Exit the fullscreen, only so that the popup will be visible
            this.vExitFullScreenMode();

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
           eventBus.$emit('toggleVideoBlockPopupEvent', true);
        });

        function onErrorEvent(event) {
          onError(event.detail);
        }
        function onError(error) {
          // If shaka-player doesn't support DRM playback, player will throw two error codes (3015 & 3016). Based on this we will show the popup
          if (self.showDrmNotSupportError && (error.code == 3016)) {
            self.contentDrmBlocked = true;
            self.showDrmNotSupportError = false;

            // If video is in fullscreen mode, exit out of fullscreen mode
            this.vExitFullScreenMode();

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
      makeFullscreen(callback = null) {
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
          case 'series':
            this.episodeIdentifier = true;
            break;
          case 'episode':
            if(this.defaultModeCurrentSubcategory === 'Watching' || this.defaultModeCurrentSubcategory === 'Recently Watching') {
              this.episodeIdentifier = true;
            } else {
              this.episodeIdentifier = true;
            }
            break;
          default:
            this.episodeIdentifier = false;
        }
      },
      vTogglePlay(flag) {
        // console.log('[vTogglePlay]');
       

        var playerFlag = undefined;
        this.returnFromLoadAfterStop = false;

        this.hideEpisodeListingIcon();

        playerFlag = flag || false;

        if(this.playerContent.contentName == 'episode') {
          this.episodeIdentifier = true;
        } else {
          this.episodeIdentifier = false;
        }

        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        // console.log('[this.contentDrmBlocked]');

        if (this.contentDrmBlocked) {
          // If video is in fullscreen mode, exit out of fullscreen mode
          this.vExitFullScreenMode();

          eventBus.$emit('toggleVideoErrorPopupEvent', true);
          this.vToggleLoader(false);
          return;
        }

        // NOTE added by sumit 21.03.2018
        // for row user in domain video can not play and show geo popup using this crossDomainCheck

        if (!this.crossDomainCheck) {
          if(document.getElementById('alt-app')) {
            document.getElementById('alt-app').style.position = "fixed";
          }
          this.vToggleLoader(false);

          if (this.vShaka) {
            this.vShaka.unload().then(() => {
              eventBus.$emit('toggleGeoBlockEvent', true);
            });
          } else {
            eventBus.$emit('toggleGeoBlockEvent', true);
          }
          return;
        }

        // NOTE: CODE CHANGE @SANGEETH
        // If the content is geo blocked and the user is trying to play the trailer, the trailer should play. We have to check what the loaded video type by the data property 'plrLoadedVideoType' which is set to 'trailer' in the 'playTrailerBtnClickCB' method.

        if (this.contentGeoBlocked && this.plrLoadedVideoType !== 'trailer') {
          // NOTE: CODE CHANGE @SANGEETH Issue #746 RESOLVED
          // Need to unload the player when the popup appears. Otherwise when the user clicks on resume button the player will reject the playback
          this.vToggleLoader(false);

          if (this.vShaka) {
            this.vShaka.unload().then(() => {
              eventBus.$emit('toggleGeoBlockEvent', true);
            });
          } else {
            eventBus.$emit('toggleGeoBlockEvent', true);
          }
          return;
          // NOTE: END CODE CHANGE @SANGEETH Issue #746 RESOLVED
        }
        // NOTE: END CODE CHANGE @SANGEETH

        // console.log('[vTogglePlay > this.contentRestricted]', this.contentRestricted);
        // console.log('[vTogglePlay > this.plrLoadedVideoType]', this.plrLoadedVideoType);

        if (this.contentRestricted) {
          this.playlistCallbackEvent = false;
          if (altUser) {
            if (this.playerContent.tvod) {
              if (this.vShaka) {
                this.vShaka.unload().then(() => {
                  eventBus.$emit('toggleRentNowPopupEvent', true);
                });
              } else {
                 eventBus.$emit('toggleRentNowPopupEvent', true);
              }
            } else {
              if (this.vShaka) {
                this.vShaka.unload().then(() => {
                  eventBus.$emit('toggleSubscribePopupEvent', true);
                });
              } else {
              eventBus.$emit('toggleSubscribePopupEvent', true);
              }
            }
          } else {
            if (this.playerContent.tvod) {
              if (this.playerContent.isFreeContent) {
                if (this.vShaka) {
                  this.vShaka.unload().then(() => {
                    eventBus.$emit('togglePlayerSigninPopupEvent', true);
                  });
                } else {
                eventBus.$emit('togglePlayerSigninPopupEvent', true);
                }

              } else {
                if (this.vShaka) {
                  this.vShaka.unload().then(() => {
                    eventBus.$emit('toggleRentTvodItemEvent', true);
                  });
                } else {
                eventBus.$emit('toggleRentTvodItemEvent', true);
                }
              }
            } else {
              if (this.vShaka) {
                this.vShaka.unload().then(() => {
                  eventBus.$emit('togglePlayerSigninPopupEvent', true);
                });
              } else {
                eventBus.$emit('togglePlayerSigninPopupEvent', true);
              }
            }
          }
          this.vToggleLoader(false);
          // If video is in fullscreen mode, exit out of fullscreen mode
          this.vExitFullScreenMode();

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
        // end chromecast connection end

        // Make screen rotation
        this.loaderCheck = true;
        this.hidePosterPlayerScreen("block","none");

        this.screenRotationLandscape();

        this.vToggler.src = '/src/assets/player/v2/ic_Play.png';

        // NOTE  @sumit kids section ratz video height is very large , so to handle height , we are added .
        if(document.getElementById('v-player')) {
          document.getElementById('v-player').style.height = "-webkit-fill-available";
        }


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
          // checking add part 
          // console.log("this.isActiveAdd playerscreen", this.isActiveAdd)
           if(this.isActiveAdd) {

             if(!this.isContinousPlayback)
               document.getElementById('v-controls').style.display = 'none';
               

             return;
           }
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
                        this.vExitFullScreenMode();

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
                        this.vExitFullScreenMode();

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
                    this.vExitFullScreenMode();

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
          this.vToggler.src = '/src/assets/player/v2/ic_Play.png';
          return;
        }

        this.vToggler.src = this.vPlayer.paused ? '/src/assets/player/v2/ic_Play.png' : '/src/assets/player/v2/ic_Pause.png';
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
          let playerContent = undefined;

          metrics.stop_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A';

          playerContent = JSON.parse(localStorage.getItem('currentPlayerDetails'));

          this.webenageEventTrigger(event_action,progress);

          eventAttributeObj.event_action = event_action;
          eventAttributeObj.content_id = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_id) ? playerContent.eventAttributeObj.content_id : " ";

          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

          eventAttributeObj.content_streamid = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_streamid) ? playerContent.eventAttributeObj.content_streamid : "";
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_duration = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_duration) ? playerContent.eventAttributeObj.content_duration : "";

          eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';

          if(playerContent && playerContent.currentPlayerType && playerContent.currentPlayerType == 'episode') {
            eventAttributeObj.parent_content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.parent_content_title) ? playerContent.eventAttributeObj.parent_content_title.toLowerCase() : "";
          }

          window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);

          localStorage.removeItem('currentPlayerDetails');
        }
      },
      vHandleProgress() {
        this.durationInSec = this.vPlayer.currentTime;

        let _this = this;
        if (this.vPlayer) {
          this.vProgress.value = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          this.vCurrentTime.innerHTML = this.vCalcTimeLine(this.vPlayer.currentTime);
          this.showComUpNextTimeNextEpisodeCountDown = Math.ceil(this.vPlayer.duration - this.vPlayer.currentTime);
        }

        if (this.playerPlaylist && this.playerPlaylist.length && this.vPlayer && this.vPlayer.duration && this.vPlayer.currentTime && this.showComUpNextTime && ((this.vPlayer.duration - this.vPlayer.currentTime) < this.showComUpNextTime)) {

          if(this.playerContent.contentName != 'show') {
            // NOTE: CODE CHANGE @SANGEETH - Issue #883 RESOLVED
            this.showComUpNextTag = (this.playListPosition !== this.playerPlaylist.length);
            // NOTE: END CODE CHANGE @SANGEETH - Issue #883 RESOLVED
          }

        } else {
          this.showComUpNextTag = false;
        }


        // NOTE for Skip Tag
        if(this.vPlayer && this.vPlayer.currentTime && this.playerContent && this.playerContent.skipIntro) {
          let timeTag = Math.floor(this.vPlayer.currentTime);
          let startTime = parseInt(this.playerContent.skipIntro.startskipintro);
          let endTime = this.playerContent.skipIntro.endskipintro ? parseInt(this.playerContent.skipIntro.endskipintro) : undefined;

          if(timeTag >= startTime && timeTag < endTime) {
            if(this.playerContent.contentName != 'show') {
              this.ShowSkipTag = true;
            }
          } else {
            this.ShowSkipTag = false;
          }
        }

        // End

        if (this.vPlayer && this.vPlayer.currentTime) {
          let progressWebengage = undefined;
          progressWebengage = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          this.fullscreenExitProgress = {'progress': this.vPlayer.currentTime, 'duration': this.vPlayer.duration,'id': this.playerContent.id};
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
        this.isPlaybackExitEvent = false;

        this.playRelatedEpisodeClickFlag = false;
        this.flagRouteChanged = false;
        this.vToggleLoader(true);

        if(this.returnFromLoadAfterStop) {
          this.vToggleLoader(false);

          if(this.vPlayer && !this.vPlayer.paused) {
            this.vPlayer.pause();
          }
          this.hideVideoController(false, 'vLoadedData');
          return;
        }


        this.vToggler.src = '/src/assets/player/v2/ic_Play.png';

        // Reset the video ended floag. Used for replay button toggling
        this.plrVideoEnded = false;
        // If continuity data availbale, play from continue position
        if (this.continueProgress && this.plrLoadedVideoType != 'trailer') {
          this.vPlayer.currentTime = this.continueProgress == 100 ? 0 : this.continueProgress;
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
          console.log (this.toggleControlTimer);
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

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;

          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

           if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
             eventAttributeObj.content_type = 'trailer';
             }

          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
          eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';

          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let event_action = 'start'

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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

          if (this.playerContent && this.playerContent.bts) {
            eventAttributeObj.content_type = 'bts';
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
          progress = isNaN(progress) ? 0 : progress;

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
           series_title = (this.showTrailerInfo && this.showTrailerInfo.title) ? this.showTrailerInfo.title : '';
        }

        return String(series_title).toLowerCase();
      },
      getContentTypeForWebenage() {
        let contentTypeWebenage = undefined;
        contentTypeWebenage = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : '';
        if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
          contentTypeWebenage = 'trailer';
        }
        // NOTE: EVENT ATTRIBUTES FOR MEDIA ONLY
        if (this.$route.name && this.$route.name == 'media') {
          if(this.plrLoadedVideoType && this.plrLoadedVideoType == 'trailer') {
            contentTypeWebenage = 'trailer';
          }
        }

        return contentTypeWebenage;
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
         let isFreeContentInfo = (this.playerContent && this.playerContent.isFreeContent) ? 'free' : 'paid';
         if(this.playerContent && this.playerContent.contentType == 'series') {
           isFreeContentInfo = 'free';
         }
         if (this.$route.name && this.$route.name == 'media') {
           if(this.plrLoadedVideoType == 'trailer') {
            isFreeContentInfo = 'free';
           }
         }
        var webEnageData = {
          'gt_platform': (platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ',
          'gt_device_make': (platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ' ,
          'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
          'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
          'gt_device_timestamp': new Date(),
          'gt_content_source': localStorage.getItem('event_source') ? localStorage.getItem('event_source') : '',
          'gt_content_id':  (this.playerContent && this.playerContent.id) ? this.playerContent.id : '',
          'gt_content_type': this.getContentTypeForWebenage(),
          'gt_content_alt_id': (this.playerContent && this.playerContent.externalId) ? this.playerContent.externalId : '',
          'gt_playback_mode' : 'live',
          'gt_playback_media_type' : isFreeContentInfo,
          'gt_playback_state' : playback_state ? playback_state : '',
          'percentage_video_played' : progress,
          'gt_content_parent_title' : this.getTitleNameWebEnage() ? this.getTitleNameWebEnage() : '',
          'gt_episode_title' : (this.playerContent && this.playerContent.title) ? String(this.playerContent.title).toLowerCase() : '',
          'gt_content_parent_ID' : (this.showTrailerInfo && this.showTrailerInfo.id) ? this.showTrailerInfo.id : '',
        };

        if(content_type == "episode") {
            webEnageData['gt_episode_count'] = (this.playerContent && this.playerContent.episodeNumber) ? this.playerContent.episodeNumber : '';
          if(playback_state == "start") {
            webEnageData['gt_episode_thumbnail_url'] = (this.playerContent && this.playerContent.images &&  this.playerContent.images.webengage) ? this.playerContent.images.webengage : '';
            webEnageData['gt_episode_description'] = (this.playerContent && this.playerContent.shortDescription) ? this.playerContent.shortDescription : '';

          } else if(playback_state == "complete") {
            webEnageData['gt_next_episode_thumbnail_url'] = (this.gt_next_episode_thumbnail_url && this.gt_next_episode_id_webenage != this.playerContent.id  )? this.gt_next_episode_thumbnail_url : '';
            webEnageData['gt_next_episode_description'] = (this.gt_next_episode_description && this.gt_next_episode_id_webenage != this.playerContent.id ) ? this.gt_next_episode_description : '';
            webEnageData['gt_next_episode_id'] = (this.gt_next_episode_id_webenage && this.gt_next_episode_id_webenage != this.playerContent.id )? this.gt_next_episode_id_webenage : '';
          }
        }

        if(webengage) {
          // console.log('[webEnageData]', webEnageData);

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

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
          // NOTE @sumit event_source
          eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
          // end
          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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

          if (this.playerContent && this.playerContent.bts) {
            eventAttributeObj.content_type = 'bts';
          }

          let event_action = 'resume';

          eventAttributeObj.event_action = event_action

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
          progress = isNaN(progress) ? 0 : progress;

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
          'gtl_content_source': localStorage.getItem('event_source') ? localStorage.getItem('event_source') : '',
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

        this.vToggleToggler(true);
        this.vToggleMainControls(true);
          this.toggleControls(true);

        // AWSMA
        // _content.playback start event
        if (this.plrVideoLoaded == false && this.plrVideoEnded && this.playNextPlaylistItemFlag) return;

        if (window.mobileAnalyticsClient) {
          var eventAttributeObj = this.getAWSMACommonAttributes();

          eventAttributeObj.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

           if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
             eventAttributeObj.content_type = 'trailer';
             }

          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
          // @sumit added
          eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
          // end

          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          // NOTE for show streamId && content_type

          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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

          if (this.playerContent && this.playerContent.bts) {
            eventAttributeObj.content_type = 'bts';
          }

          let event_action = (this.playRelatedEpisodeClickFlag || this.flagRouteChanged) ? 'stop' : 'pause';

          if(event_action == 'stop') {
            this.returnFromLoadAfterStop = true;
            this.nextEpisodePlayLoadMainfest = true;
          }

          this.currentAWSEvent = false;

          let progress = (this.vPlayer && this.vPlayer.currentTime && this.vPlayer.duration) ? (this.vPlayer.currentTime / this.vPlayer.duration) * 100 : 0;
          progress = isNaN(progress) ? 0 : progress ;

          eventAttributeObj.event_action = event_action;

          let deviceOrientation = this.getPlayerEventMode()
          eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

          let metrics = { progress };

          /**
           * Issue #921 RESOLVED
           * In Continuous play back Scenario - After Complete event Pause -
           * event is Triggering.
           */
          if (event_action == 'pause' && progress && progress < 95) {
            metrics.start_time = this.vPlayer && this.vPlayer.currentTime ? this.vPlayer.currentTime : 'N.A';

            if (!this.isPlaybackExitEvent) {
              window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
            }
          }
          /**
           * END Issue #921 RESOLVED
           */

          // let stop_time = 'N.A';
          // matrix can not be string.
          let stop_time = 0;
          let _data = this;
        setTimeout(function(){
          if (event_action == 'stop') {
            var playerContent = undefined;
            if(localStorage.getItem('currentPlayerDetails')) {
              // when press back that time we are store info of matrix and set here.@sumit
              // when press back we are unload the shaka so ,we can not access this.vPlayer
              metrics.stop_time = _data.stopMatrixInfo && _data.stopMatrixInfo.stop_time ? _data.stopMatrixInfo.stop_time : 0;
              metrics.progress = _data.stopMatrixInfo && _data.stopMatrixInfo.progress ? _data.stopMatrixInfo.progress : 0;
              playerContent = JSON.parse(localStorage.getItem('currentPlayerDetails'));
              eventAttributeObj.content_id = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_id) ? playerContent.eventAttributeObj.content_id : " ";
               eventAttributeObj.content_type = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_type) ? playerContent.eventAttributeObj.content_type : 'N.A';
               eventAttributeObj.content_title =  (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_title)  ? playerContent.eventAttributeObj.content_title.toLowerCase()  : 'N.A';
              eventAttributeObj.content_streamid = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_streamid) ? playerContent.eventAttributeObj.content_streamid : "";
              eventAttributeObj.content_url = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_url) ? playerContent.eventAttributeObj.content_url : " ";
              eventAttributeObj.content_duration = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_duration) ? playerContent.eventAttributeObj.content_duration : "";
              eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
              // end
              // NOTE: CODE CHANGE @SANGEETH - Issue #915
              eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
              // NOTE: END CODE CHANGE @SANGEETH - Issue #915

              if(playerContent && playerContent.currentPlayerType && playerContent.currentPlayerType == 'episode') {
                eventAttributeObj.parent_content_title = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.parent_content_title) ? playerContent.eventAttributeObj.parent_content_title.toLowerCase() : "";
              }
              window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
              localStorage.removeItem('currentPlayerDetails');
            }
            //end stop event
          }
          }, 500);

          if(event_action == 'pause' && metrics && metrics.progress == 100) {
            event_action = 'complete';
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
        if (this.plrLoadedVideoType == 'trailer' || this.plrLoadedVideoType == 'poster') return;

        if (!progress || !duration) return;

        if (isNaN(progress) || isNaN(duration)) return;

        progress = (progress > duration) ? duration : progress;

        if(progress == duration) progress = 0;

        this.actPutPlayerProgress({ media_id, progress }).then((response) => {
        }, (error) => {
        });

        var progressPercent = Math.ceil((Math.round(progress) / Math.round(duration)) * 100);
          progressPercent = progressPercent == 100 ? 0 : progressPercent;
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

        // NOTE added by @sumit for update details button when press back.
        eventBus.$emit('DetailButtonChangeExitButtonChange',true);
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
          this.playNextPlaylistItemFlag = true;

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

                    /**
                     * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
                     * CODE CHANGE @SANGEETH
                     */
                    let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
                    eventAttributeObj.content_type = contentType;
                    let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
                    if (contentType === 'episode' && contentTitle) {
                      contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
                    }
                    eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
                    /**
                     * END CODE CHANGE - Issue #918
                     */

                    eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
                    eventAttributeObj.content_url = this.getContentUrl();
                    eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

                    // NOTE sumit added
                    eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';

                    // end sumit

                    // NOTE: CODE CHANGE @SANGEETH - Issue #915
                    eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
                    // NOTE: END CODE CHANGE @SANGEETH - Issue #915

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

                    /**
                     * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
                     * CODE CHANGE @SANGEETH
                     */
                    let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
                    eventAttributeObj.content_type = contentType;
                    let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
                    if (contentType === 'episode' && contentTitle) {
                      contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
                    }
                    eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
                    /**
                     * END CODE CHANGE - Issue #918
                     */

                    eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
                    eventAttributeObj.content_url = this.getContentUrl();
                    eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
                    // NOTE @sumit added
                    eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
                    // end

                    // NOTE: CODE CHANGE @SANGEETH - Issue #915
                    eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
                    // NOTE: END CODE CHANGE @SANGEETH - Issue #915

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

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;

          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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
            eventAttributeObj.event_action = 'buffer';

            let deviceOrientation = this.getPlayerEventMode()
            eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

            let start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A'

            this.bufferStartTime = start_time;

            let duration = Math.abs(((this.contentBufferStopTime - this.contentBufferStartTime) / 1000) / 15)
            if (isNaN(duration)) duration = 1.00
            let metrics = { start_time, duration }
          } else {
            if (!this.countBufferFlag) {
              this.countBufferFlag = true;
              return;
            }
            let duration = Math.abs((this.contentBufferStopTime - this.contentBufferStartTime) / 1000);
            let metrics;
            let event_action;
            let start_time;
            this.currentAWSEvent = false;

            var eventAttributeObj_buffer = this.getAWSMACommonAttributes();

            eventAttributeObj_buffer.content_id = (this.playerContent && this.playerContent.id) ? this.playerContent.id : null;

            /**
             * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
             * CODE CHANGE @SANGEETH
             */
            let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
            eventAttributeObj.content_type = contentType;
            let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
            if (contentType === 'episode' && contentTitle) {
              contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
            }
            eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
            /**
             * END CODE CHANGE - Issue #918
             */

            eventAttributeObj_buffer.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
            eventAttributeObj_buffer.content_url = this.getContentUrl();
            eventAttributeObj_buffer.content_duration = (this.vPlayer && this.vPlayer.duration) ? this.vPlayer.duration : null;
            //NOTE @sumit added
            eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
            // end

            // NOTE: CODE CHANGE @SANGEETH - Issue #915
            eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
            // NOTE: END CODE CHANGE @SANGEETH - Issue #915

            // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
            if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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

            if (this.playerContent && this.playerContent.bts) {
              eventAttributeObj.content_type = 'bts';
            }

            event_action = 'buffer';
            eventAttributeObj_buffer.event_action = event_action;
            let deviceOrientation_buffer = this.getPlayerEventMode()
            eventAttributeObj_buffer.event_mode = deviceOrientation_buffer ? deviceOrientation_buffer : 'N.A';
            start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A';

            /**
             * Issue #919 RESOLVED
             * CODE CHANGE @SANGEETH
             * If we have continueProgress value with us which we will get from
             * 'getPlayerProgress' method, we have to assign that value to the
             * start_time in metrics.
             */
            start_time = this.continueProgress ? this.continueProgress : 'N.A';
            /**
             * END Issue #919 RESOLVED
             */

            metrics = { start_time, duration}

            if (!this.isPlaybackExitEvent) {
              window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj_buffer, metrics);
            }

            event_action = 'resume';
            let method_stage = this.vPlayer.paused ? 'pause' : 'play';

            eventAttributeObj.event_action = event_action;

            let deviceOrientation = this.getPlayerEventMode()
            eventAttributeObj.event_mode = deviceOrientation ? deviceOrientation : 'N.A';

            let progress = (this.vPlayer.currentTime / this.vPlayer.duration) * 100;
            progress = isNaN(progress) ? 0 : progress

            start_time = this.vPlayer ? this.vPlayer.currentTime : 'N.A'

            metrics = { start_time, progress }

            eventAttributeObj.event_source = localStorage.getItem('even_source')

            if(method_stage == 'play') {

              if (!this.isPlaybackExitEvent) {
                window.mobileAnalyticsClient.recordEvent('_content.playback', eventAttributeObj, metrics);
              }
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
          console.log("test1 done"); this.toggleControls(false); 
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

          /**
           * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
           * CODE CHANGE @SANGEETH
           */
          let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
          eventAttributeObj.content_type = contentType;
          let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
          if (contentType === 'episode' && contentTitle) {
            contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
          }
          eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
          /**
           * END CODE CHANGE - Issue #918
           */

          eventAttributeObj.content_streamid = (this.playerContent && this.playerContent.stream && this.playerContent.stream.streamId) ? this.playerContent.stream.streamId : null;
          eventAttributeObj.content_url = this.getContentUrl();
          eventAttributeObj.content_duration = (this.vPlayer) ? this.vPlayer.duration : null;

          // NOTE sumit added
          eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';
          // end
          // NOTE: CODE CHANGE @SANGEETH - Issue #915
          eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #915

          // NOTE: EVENT ATTRIBUTES FOR SHOWS ONLY && now there is no episode page  details page , this we need to follow
          if (this.playerContent && this.playerContent.contentType && this.playerContent.contentType == 'series') {
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

          if (this.playerContent && this.playerContent.bts) {
            eventAttributeObj.content_type = 'bts';
          }

          let event_action = 'seek';

          eventAttributeObj.event_action = event_action;

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
        this.contentRestricted = false;

        this.trailerCheckCounter = true;

        // NOTE: CODE CHANGE @SANGEETH
        // Set this property to trailer which will be checked in vTogglePlay to identify the loaded video type. For managing the geoblock popup.
        this.plrLoadedVideoType = 'trailer';
        // NOTE: END CODE CHANGE @SANGEETH

        this.plrLoadedVideoTypeMovieTrailer = "trailer";

        this.nextEpisodePlayLoadMainfest = true;
        this.ShowSkipTag = false;
        this.showComUpNextTag = false;

        // NOTE this for when we will switch movie to trailer the  stop event will trigger
        this.stopTriggerForMovieTrilerSwitch();

        this.vToggleMainControls(false);

        if (this.vPlayer && !this.vPlayer.paused) {
          this.vPlayer.pause();
          this.vPauseEventCB();
        }

        // NOTE: CODE CHANGE @SANGEETH
        // If we come back after playing episodes which are numbered after 1st episode, and try to play triler, once the trailer got end, it will start playing from the current playlist item only which means the playlist number is not correct. So inorder to fix this issue, we need to assign the playlist data with the data from the episode popup which is a getter named 'relatedEpisodes'.
        // this.playerPlaylist = undefined;

        // if(this.$route && this.$route.name != 'media') {
        //   this.playerPlaylist = this.relatedEpisodes;
        // }
        // NOTE: END CODE CHANGE @SANGEETH

        // console.log("this.playerPlaylist ||  ", this.playerPlaylist);

        this.plrVideoLoaded = false;

        // Check if trailer url is present or not
        if (this.plrTrailerUrl) {
          this.plrVideoUrl = this.plrTrailerUrl;
        }
        this.plrIsDrmVideo = false;
        this.continueProgress = undefined;

        // NOTE when trailer will come hide skip intro tag,
        this.ShowSkipTag = false;

        // NOTE this for show trailer info loaded. by Sumit
        if (this.showTrailerInfo && this.showTrailerInfo.trailer) {
          eventBus.$emit("toggleSendDataToPlayerScreen", this.showTrailerInfo);
          this.contentName = 'show';
          // NOTE Trailer poster added.
          this.plrPosterImage = (this.showTrailerInfo.images && this.showTrailerInfo.images.cover) ? this.showTrailerInfo.images.cover : '/src/assets/alt-cover.jpg';

            // NOTE: CODE CHANGE @SANGEETH
            // Set this data property to true for the following purpose. When we are in show page and pressed trailer, the trailer will be player in popup player. After completing the trailer we take items to be played next from the playlist of episodes which we generate once we enter the show page. In the 'playNextPlaylistItem' method, we are checking this value to not redirect to the episode page instead.
            this.popupPlayer = true;
            // Set this data property value to true which will be checked in 'renderEpisodeScreen' method which is used to autoplay the content when the trailer finishes playing.
            this.playlistCallbackEvent = true;
            // NOTE: END CODE CHANGE @SANGEETH

            this.plrTrailerUrl = this.showTrailerInfo.trailer.trailerUrl ? this.showTrailerInfo.trailer.trailerUrl : undefined;
            this.plrTrailerId = this.showTrailerInfo.trailer.trailerId ? this.showTrailerInfo.trailer.trailerId : undefined;
            this.plrIsDrmVideo = false;
            this.contentRestricted = false;
            this.playerPageheader = this.showTrailerInfo.title;
            this.setPlayerContent(this.showTrailerInfo);
          } else {
             // @sumit this.playerContent.bts for bts we are added
            if (this.playerContent && this.playerContent.trailer && !this.playerContent.bts) {

              // NOTE Trailer poster added.
              this.plrPosterImage = (this.playerContent.images && this.playerContent.images.cover) ? this.playerContent.images.cover : '/src/assets/alt-cover.jpg';

              this.plrTrailerAvailable = true;
              this.plrTrailerUrl = this.playerContent.trailer.trailerUrl ? this.playerContent.trailer.trailerUrl : undefined;
              this.plrTrailerId = this.playerContent.trailer.trailerId ? this.playerContent.trailer.trailerId : undefined;
              this.plrIsDrmVideo = false;
              this.contentRestricted = false;
              this.playerPageheader = this.playerContent.title;
            }
          }

        this.episodeIdentifier = false;
        this.configurePlayer(() => {
          this.vTogglePlay();

          this.plrLoadedVideoType = 'trailer';

          if (this.playerContent && this.playerContent.contentType === 'poster') {
            this.plrLoadedVideoType = 'poster';
          }
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

              return;
            }

            // NOTE: Code commented
            // NOTE commented sumit 23.03.2018 bug #503
            if (visitedDomain && visitedDomain == 'IN') {
              this.contentGeoBlocked = false;

              if (callback) callback();
            } else {
              // this.contentGeoBlocked = true;

              if (callback) callback();
            }

            // NOTE: End of Code commented
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
          document.getElementById('v-toggler').addEventListener('click', () => {
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
        this.toggleLoader(true);
        if (this.contentName == 'show') {
          this.actGetMediaSeries(this.seriesId).then((response) => {
            var parsedResponse = this.parseContents(response);

            this.handleShowCtaGeo(parsedResponse);

            this.setPlayerContent(parsedResponse);

             // NOTE Breast Buffer
            
                let config = undefined;
                config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
                this.buffer_campaign = (config.buffer_campaign && config.buffer_campaign && config.buffer_campaign.is_active && config.buffer_campaign.apng  && parsedResponse.buffer_campaign) ? config.buffer_campaign : null;


            //NOTE end of Breast buffer


            if(this.$route && this.$route.name !== "home" && this.$route.name !== "shows" && !this.playerContent.bts) {
              this.setHeaderTitle(parsedResponse.title);
            }

            // GTM Webengage
            this.sendGTMpageViewData('show details', parsedResponse.title ? parsedResponse.title : '', '');
            this.webEnagePageView('show details', parsedResponse.title ? parsedResponse.title : '', '',this.playerContent.id);

            if(!this.trailerCheckCounter)
              eventBus.$emit('playerContentFetchEvent');

            if (response.seasons && response.seasons.length) {
              this.seriesSeasons = response.seasons;
            }
            this.toggleLoader(false);

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
            this.toggleLoader(true);
          this.actGetMediaVideo(this.id).then((response) => {
            var parsedResponse = this.parseContents(response);
            this.setPlayerContent(undefined);
            this.setPlayerContent(parsedResponse);

            // NOTE Breast Buffer
            
                let config = undefined;
                config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
                this.buffer_campaign = (config.buffer_campaign && config.buffer_campaign && config.buffer_campaign.is_active && config.buffer_campaign.apng  && parsedResponse.buffer_campaign) ? config.buffer_campaign : null;


            //NOTE end of Breast buffer

            // NOTE: CODE CHANGE @SANGEETH
            // Change the header title only when the content name is 'media'. 'Episodes' will play in popup player which means, no need to change the header title
            if (this.contentName == 'media' && this.$route.name !== "home" && this.$route.name !== "movies" && this.playerContent && !this.playerContent.bts) {
              this.setHeaderTitle(parsedResponse.title);
            }
            // NOTE: END CODE CHANGE @SANGEETH

            // GTM Webengage
            if (this.contentName == 'episode') {
              this.sendGTMpageViewData('episode details', parsedResponse.seriesTitle ? parsedResponse.seriesTitle : '', parsedResponse.title ? parsedResponse.title : '');
              // this.webEnagePageView('episode details', parsedResponse.seriesTitle ? parsedResponse.seriesTitle : '', parsedResponse.title ? parsedResponse.title : '');
            } else {
              this.sendGTMpageViewData('media', parsedResponse.title ? parsedResponse.title : '', '')
              eventBus.$emit('playerContentFetchEvent');
            }

            // Emit an event after getting the content to 'RelatedSeasons' component to post render the template.
           // eventBus.$emit('playerContentFetchEvent');

        this.toggleLoader(false);


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

               eventBus.$emit('toggleVideoBlockPopupEvent', true);
                this.toggleLoader(false);
                return;

            } else {
              eventBus.$emit('togglePopupNetworkError', true);
              document.getElementById('v-loader').style.display = 'none';
              document.getElementById('v-controls').style.display = 'none';
            }
          });
        } else if (this.contentType == 'episode') {
          this.actGetMediaVideo(this.contentId).then((response) => {

            this.setPlayerContent(this.parseContents(response));
            eventBus.$emit('playerContentFetchEvent');

            if (callback) callback();
          }, (error) => {
            if (!(error.body && error.code)) {

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
            this.hideVideoController(false, 'vToggleLoader');
          } else {
            this.vLoader.style.display = 'none';
            if(this.loaderCheck) {
              this.hideVideoController(true, 'vToggleLoader');
            }
          }
        }
      },
      vToggleToggler(show, from) {
        // console.log("show", show, from)
        // if (show) {
        //   this.vToggler.style.display = 'inline-block';
        // } else {
        //   this.vToggler.style.display = 'none';
        // }
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
        // NOTE: CODE CHANGE #02 @SANGEETH
        // This change is made as the event is emitting multiple (2 times) when we exit from the fullscreen player and try to play the episode using resume button. It has side effect with the 'renderEpisodeScreen' method. We removed code from that method and added it here.

        if (this.contentName && this.contentName == 'episode') {
          // NOTE two time register....

          // eventBus.$on('toggleSendDataToPlayerScreen', this.loadContentAtPlayerScreen);
        }
        // NOTE: END CODE CHANGE #02 @SANGEETH

        this.handleEventPlayer = true;

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
      toggleControls(state, data) {
        var vControls = document.getElementById('v-controls');
        // If the element is not present
      //  if (!vControls || !localStorage.getItem('currentPlayerDetails')) return;

         
        if (state) {
          vControls.style.opacity = 1;
        //   this.vControls.removeEventListener('click', this.vControlsClickEventCB);
        //     setTimeout(()=> {
        //   this.vControls.addEventListener('click', this.vControlsClickEventCB);
        // }, 5000)
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

          if (response.progress || response.progress == 0) {
            if (this.playerContent && (this.playerContent.durationInSec - response.progress) < 40) {
              this.continueProgress = undefined;

            } else {

              this.continueProgress = response.progress;
            }

            // console.log("this.continueProgress--->", this.continueProgress);
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

              this.playerPlaylist = playerPlaylist;
              this.setCurrentShowPlaylists(playerPlaylist.slice());
            } else {
              var playlist_slice_point = 0;

              // if (this.playerScreenSource === 'CAROUSEL') {
              //   if (localStorage.getItem('mediaProgressList')) {
              //     let mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
              //
              //     this.id = mediaProgressList[0].media_id;
              //   }
              // }

              for (var i in this.playlistEpisodes) {
                if (this.playlistEpisodes[i].media_id == this.id) {
                  playlist_slice_point = parseInt(i);
                  continue;
                }

                playerPlaylist.push(this.parseContents(this.playlistEpisodes[i]));
              }

              this.playerPlaylist = playerPlaylist.slice(playlist_slice_point);

              this.setEpisodeListing(this.playerPlaylist);

              if (this.playerPlaylist && this.playerPlaylist.length) {
                this.nextPlaylistPosition = 0;

                var nextPlaylistItem = this.playerPlaylist[this.nextPlaylistPosition];

                this.gt_next_episode_thumbnail_url = (nextPlaylistItem && nextPlaylistItem.images &&  nextPlaylistItem.images.webengage) ? nextPlaylistItem.images.webengage : '';
                this.gt_next_episode_description = (nextPlaylistItem && nextPlaylistItem.shortDescription ) ? nextPlaylistItem.shortDescription : '';
                this.gt_next_episode_id = (nextPlaylistItem && nextPlaylistItem.id ) ? nextPlaylistItem.id: '';

                this.gt_next_episode_id_webenage = (nextPlaylistItem && nextPlaylistItem.id ) ? nextPlaylistItem.id: '';


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
                this.gt_next_episode_id_webenage = ' ';

              }
            }

            // NOTE this function splice out whatever video is playing and make a list
            this.makeEpisodeListContent();

            if (callback) callback();
          }
        }, (error) => {
        });
      },
      makeEpisodeListContent() {
        // NOTE beacuse in home carousel has only episode part that time this will work and other case also like details page play/resume button
        let playerEpisodeInfo = [];
        if(!(this.playlistEpisodes && this.playlistEpisodes.length)) {
          return;
        }
        for (var i in this.playlistEpisodes) {
          playerEpisodeInfo.push(this.parseContents(this.playlistEpisodes[i]));
        }

        // this.setRelatedEpisodes(playerEpisodeInfo);

        if(!(playerEpisodeInfo && playerEpisodeInfo.length)) {
          return;
        }
        // NOTE &sumit episode popuplist
        let spliceEpisodeList = null;

        spliceEpisodeList = playerEpisodeInfo.slice();
        for(let i in spliceEpisodeList) {
          if(this.id == spliceEpisodeList[i].id) {
            spliceEpisodeList.splice(i,1);
            this.setPopupPlaylist(spliceEpisodeList);
            break;
          }
        }
      },
      assignComUpNextData() {
        if (this.playerPlaylist && this.playerPlaylist.length) {
          // NOTE: CODE CHANGE @SANGEETH

          // CODE COMMENTED
          // this.nextPlaylistPosition = 0;

          var nextPlaylistItem = this.playerPlaylist[this.nextPlaylistPosition];

          if (!nextPlaylistItem) return;

          if(nextPlaylistItem && nextPlaylistItem.images && nextPlaylistItem.images.episodeImageUrl) {
            this.nextEpisodeImage = nextPlaylistItem.images.episodeImageUrl;
          }

          this.nextPlaylistMediaTitle = nextPlaylistItem.title;
          this.nextPlaylistMediaSNo = nextPlaylistItem.noShow ? false : nextPlaylistItem.seasonNumber;
          this.nextPlaylistMediaENo = nextPlaylistItem.noShow ? false : nextPlaylistItem.episodeNumber;

          // NOTE @sumit for continuous play webEnage
          this.gt_next_episode_thumbnail_url = (nextPlaylistItem && nextPlaylistItem.images &&  nextPlaylistItem.images.webengage) ? nextPlaylistItem.images.webengage : '';
          this.gt_next_episode_description = (nextPlaylistItem && nextPlaylistItem.shortDescription ) ? nextPlaylistItem.shortDescription : '';
          this.gt_next_episode_id = (nextPlaylistItem && nextPlaylistItem.id ) ? nextPlaylistItem.id: '';
          this.gt_next_episode_id_webenage = (nextPlaylistItem && nextPlaylistItem.id ) ? nextPlaylistItem.id: '';
          // end

        } else {
          this.playerPlaylist = undefined;

          this.gt_next_episode_thumbnail_url = '';
          this.gt_next_episode_description = '';
          this.gt_next_episode_id = '';
          this.gt_next_episode_id_webenage = ' ';
        }
      },
      playNextPlaylistItem() {
        // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #837
        // After completing the playback of last episode, this method will trigger where we have exit the user out of fullscreen mode and reset all the required data properties

         var progress = this.fullscreenExitProgress.progress;
          var duration = this.fullscreenExitProgress.duration;
          this.id = this.fullscreenExitProgress.id;

        if (this.playListPosition === this.playerPlaylist.length) {

          if (this.vShaka) {
            this.vShaka.unload().then(() => {
              if (this.vPlayer) {
                this.vPlayer.pause();
                this.vPauseEventCB();
              }
            });
          }

          eventBus.$emit("togglePlayerScreenFlagEnable",false);

          this.toggleLoader(true);
          this.vToggleLoader(false);
          this.loaderCheck = false;

          this.playRelatedEpisodeClickFlag = true;

          this.flagVideoTag = true;
          this.vExitFullScreenMode();
          let _this = this;
          // Emitting event to kids.vue to hide the player when the user press back button or rotate the screen to portrait
          eventBus.$emit('togglePlayerScreenEvent', false);

          eventBus.$emit("toggleEpisodelistPopup",false);
          eventBus.$emit("togglePlayerVideoResolution","back");
          localStorage.setItem('awsOrientation', 'portrait');

          // NOTE: NEW CODE CHANGE @SANGEETH
          this.nextPlaylistPosition = 0;
          this.playListPosition = 0;

          // If the value of showTrailerInfo exist, it means we are playing the trailer of the series and it requires the episode playlist to be played after the trailer ends. So empty the playlist only if the playing content is not show trailer.
          if (!this.showTrailerInfo) {
            this.playerPlaylist = undefined;
          }
          // NOTE: END NEW CODE CHANGE

          // NOTE: CODE CHANGE @SANGEETH - Issue #852 RESOLVED
          // If user exit out of fullscreen mode after playing episode and tries to play the movie or other contents, the meta tags should not show on the player controls.
          this.headerEpisodeDetails = null;
          this.gt_next_episode_id = false;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #852

          this.showComUpNextTag = false;
          this.ShowSkipTag = false;

          this.hidePosterPlayerScreen("none","block");
          this.hideVideoController(false, 'pressBackChangeToPoster');
          this.toggleLoader(false);
          this.vToggleLoader(false);
          let altUser = localStorage.getItem('altUser') ? true : false;

          // NOTE added by SUMIT
          // when press back update progress
          if (!this.vPlayer || !altUser) return;
          
         
          if (isNaN(progress) || isNaN(duration)) return;
          this.updateMediaProgress(this.id, progress, duration);

          return;
        }
        // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #837

        // NOTE: CODE CHANGE @SANGEETH
        this.nextPlaylistPosition += 1;

        localStorage.setItem('prevPlayedMediaId', this.id);

        this.nextEpisodePlayLoadMainfest = true;

        if (this.vPlayer) {
            this.toggleControls(false); 
          this.vToggleToggler(false, 'playNextPlaylistItem');
          this.vToggleMainControls(false);
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

        // NOTE: CODE CHANGE @SANGEETH
        if (!this.currentPlaylistItem || this.currentPlaylistItem.contentName !== 'episode') return;
        // NOTE: END CODE CHANGE @SANGEETH

        if (this.popupPlayer) {
          // console.log("this.playerPlaylist", this.playerPlaylist);
          this.setPlayerContent(this.currentPlaylistItem);

          // NOTE Breast Buffer
            
                let config = undefined;
                config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
                this.buffer_campaign = (config.buffer_campaign && config.buffer_campaign && config.buffer_campaign.is_active && config.buffer_campaign.apng && this.currentPlaylistItem.buffer_campaign) ? config.buffer_campaign : null;


            //NOTE end of Breast buffer

          this.id = this.currentPlaylistItem.id;

          // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #746
          // Assign value to 'mediaId' which will be checked in 'getMediaAccess' method.
          this.mediaId = this.currentPlaylistItem.id;
          // NOTE: END CODE CHANGE @SANGEETH - RESOLVED Issue #746

          this.playlistCallbackEvent = true;

          this.playListPosition += 1;

          // NOTE &sumit ,for when play next button,then episode playlist should be updated.
          this.makeEpisodeListContent();
          // end by &sumit

          // NOTE: CODE CHANGE @SANGEETH - RESOLVED Issue #746
          // Need to check the access before playing the item from playlist. Inorder to check the geo block access
          // console.log("test>>>", this.playerContent);
          if (altUser) {
            this.getMediaAccess(() => {
              this.renderEpisodeScreen();
            });
          } else {
            this.renderEpisodeScreen();
          }
          // NOTE: END CODE CHANGE @SANGEETH - RESOLVED Issue #746
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


        // NOTE player event added
        localStorage.setItem('event_source','player');

        // @sumit when press back we are unload the shaka so ,we can not access this.vPlayer
        // NOTE : stop Aws matrix details.
         this.stopMatrixInfo = {};
         let progress = (this.vPlayer && this.vPlayer.currentTime && this.vPlayer.duration) ? (this.vPlayer.currentTime / this.vPlayer.duration) * 100 : 0;
         progress = isNaN(progress) ? 0 : progress ;
         this.stopMatrixInfo.progress = progress;
         this.stopMatrixInfo.stop_time = (this.vPlayer && this.vPlayer.currentTime) ? this.vPlayer.currentTime : 0;
        // end

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
        this.containInfoDetails = undefined;
        this.$router.push(routerObj);
        eventBus.$emit('toggleLanguageFilterEvent', false);
      },
      popupOpenCB(state) {
        if (state) {
          if(this.vPlayer) {
            this.vPlayer.pause();
          }
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
          // @sumit always need updated index.
        //  list[index] = currItem;
          list.splice(index,1);
          list.unshift(currItem);
          return list;
        } else {
          // @sumit added data at first
          list.unshift(currItem);
          return list;
        }
      },
      getContentUrl() {
        let content_url = "";
        switch (this.contentName) {
          case 'show':
          content_url = (this.playerContent && this.playerContent.trailer) ? this.playerContent.trailer.trailerUrl : 'N.A';
          break;
          case 'media':
          content_url = (this.playerContent && this.playerContent.stream) ? this.playerContent.stream.streamUrl : 'N.A';
          break;
          case 'episode':
          content_url = (this.playerContent && this.playerContent.stream) ? this.playerContent.stream.streamUrl : 'N.A';
          break;
          default:
          content_url = (this.playerContent && this.playerContent.stream) ? this.playerContent.stream.streamUrl : 'N.A';
        }
        return content_url;
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

            /**
             * Issue #918 - Ep1 Text is not displaying in content_title Attribute.
             * CODE CHANGE @SANGEETH
             */
            let contentType = (this.playerContent && this.playerContent.contentType) ? this.playerContent.contentType : null;
            eventAttributeObj.content_type = contentType;
            let contentTitle = (this.playerContent && this.playerContent.title) ? this.playerContent.title : null;
            if (contentType === 'episode' && contentTitle) {
              contentTitle = `Ep${this.playerContent.episodeNumber}-${contentTitle}`;
            }
            eventAttributeObj.content_title = contentTitle ? contentTitle.toLowerCase() : 'N.A';
            /**
             * END CODE CHANGE - Issue #918
             */

            eventAttributeObj.content_streamid = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_streamid) ? playerContent.eventAttributeObj.content_streamid : "";
            eventAttributeObj.content_url = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_url) ? playerContent.eventAttributeObj.content_url : " ";
            eventAttributeObj.content_duration = (playerContent && playerContent.eventAttributeObj && playerContent.eventAttributeObj.content_duration) ? playerContent.eventAttributeObj.content_duration : "";

            // NOTE @sumit added
            eventAttributeObj.event_source = localStorage.getItem('event_source') ? localStorage.getItem('event_source') : 'N.A';

            // NOTE: CODE CHANGE @SANGEETH - Issue #915
            eventAttributeObj.language_code = (this.playerContent && this.playerContent.mainLanguage) ? this.playerContent.mainLanguage : null;
            // NOTE: END CODE CHANGE @SANGEETH - Issue #915

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
        this.showOnlyPlayButton = false;
        this.vTogglePlay("play");
      },
      pressBackChangeToPoster() {
        this.setPlayerScreenSource(null);

        if (screen.orientation.angle == 0) {
          if(adsManager) {
            clearInterval(intervalTimer);

            adsManager.destroy();
          }
          if (document.getElementById("adContainer")) {
            document.getElementById("adContainer").innerHTML = "";
          }
           this.stopMatrixInfo = {};
           let progress = (this.vPlayer && this.vPlayer.currentTime && this.vPlayer.duration) ? (this.vPlayer.currentTime / this.vPlayer.duration) * 100 : 0;

           progress = isNaN(progress) ? 0 : progress ;
           this.stopMatrixInfo.progress = progress;
           this.stopMatrixInfo.stop_time = (this.vPlayer && this.vPlayer.currentTime) ? this.vPlayer.currentTime : 0;

          // NOTE: CODE CHANGE #01 @SANGEETH
          // Before exiting out of the fullscreen mode, if shaka is present, we have to unload the player first and then pause the player if want.
          if (this.vShaka) {
            // NOTE: CODE CHANGE @SANGEETH - ISSUE #908 & ISSUE #768
            // Make this data property to true, when the fullscreen exit event -
            // fires. It would be tracked during the 'pause' & 'buffer' analytics-
            // event. Event if we exit out of the fullscreen mode, buffer and -
            // pause was triggering which we don't want. Instead should trigger -
            // 'stop' event.
            this.isPlaybackExitEvent = true;
            // NOTE: CODE CHANGE @SANGEETH - ISSUE #908 & ISSUE #768

            this.playRelatedEpisodeClickFlag = true;

            this.vShaka.unload().then(() => {
              if (this.vPlayer) {
                this.vPauseEventCB();
              }
            });
          }
          // NOTE: END CODE CHANGE #01 @SANGEETH

          eventBus.$emit("togglePlayerScreenFlagEnable",false);

          this.toggleLoader(true);
          this.vToggleLoader(false);
          this.loaderCheck = false;

          this.playRelatedEpisodeClickFlag = true;

          this.flagVideoTag = true;
          this.vExitFullScreenMode();
          let _this = this;
          // Emitting event to kids.vue to hide the player when the user press back button or rotate the screen to portrait
          eventBus.$emit('togglePlayerScreenEvent', false);

          eventBus.$emit("toggleEpisodelistPopup",false);
          eventBus.$emit("togglePlayerVideoResolution","back");
          localStorage.setItem('awsOrientation', 'portrait');

          // NOTE: NEW CODE CHANGE @SANGEETH
          this.nextPlaylistPosition = 0;
          this.playListPosition = 0;

          // If the value of showTrailerInfo exist, it means we are playing the trailer of the series and it requires the episode playlist to be played after the trailer ends. So empty the playlist only if the playing content is not show trailer.
          if (!this.showTrailerInfo) {
            this.playerPlaylist = undefined;
          }
          // NOTE: END NEW CODE CHANGE

          // NOTE: CODE CHANGE @SANGEETH - Issue #852 RESOLVED
          // If user exit out of fullscreen mode after playing episode and tries to play the movie or other contents, the meta tags should not show on the player controls.
          this.headerEpisodeDetails = null;
          this.gt_next_episode_id = false;
          // NOTE: END CODE CHANGE @SANGEETH - Issue #852

          this.showComUpNextTag = false;
          this.ShowSkipTag = false;

          this.hidePosterPlayerScreen("none","block");
          this.hideVideoController(false, 'pressBackChangeToPoster');
          this.toggleLoader(false);
          this.vToggleLoader(false);
          let altUser = localStorage.getItem('altUser') ? true : false;

          // NOTE added by SUMIT
          // when press back update progress
          if (!this.vPlayer || !altUser) return;
          var progress = this.vPlayer.currentTime;
          var duration = this.vPlayer.duration;
          if (isNaN(progress) || isNaN(duration)) return;
          this.updateMediaProgress(this.id, progress, duration);
          // END
        }
      },
      fullScreenExitEvent(item) {

        if (document.webkitIsFullScreen === false || document.mozFullScreen === false || document.msFullscreenElement === false) {

            if (adsManager) {
              clearInterval(intervalTimer);
              adsManager.destroy();
             }

          this.showComUpNextTime = false;
          this.handleEventPlayer = true;
          // NOTE for playerscreen $on when press power botton.
          eventBus.$on("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);

          this.toggleLoader(true);
          this.loaderCheck = false;

          // NOTE hide home player sumit
          eventBus.$emit("togglePlayerScreenFlagEnable",false);

          this.playRelatedEpisodeClickFlag = true;

          this.flagVideoTag = true;
          let _this = this;
          // Emitting event to kids.vue to hide the player when the user press back button or rotate the screen to portrait
          eventBus.$emit('togglePlayerScreenEvent', false);
          eventBus.$emit("toggleEpisodelistPopup",false);
          eventBus.$emit("togglePlayerVideoResolution","back");
          localStorage.setItem('awsOrientation', 'portrait');
          this.showComUpNextTag = false;
          this.ShowSkipTag = false;
          this.hidePosterPlayerScreen("none","block");
          this.hideVideoController(false, 'pressBackChangeToPoster');
          this.toggleLoader(false);
          this.vToggleLoader(false);

          let altUser = localStorage.getItem('altUser') ? true : false;

          // NOTE added by SUMIT
          // when press back update progress
          // console.log("fullscreenExitProgress", this.fullscreenExitProgress, this.playerContent);
          if(this.vPlayer) {
            var progress = this.fullscreenExitProgress.progress;
            var duration = this.fullscreenExitProgress.duration;
            
            if (!isNaN(progress) && !isNaN(duration) && altUser) {
              this.updateMediaProgress(this.fullscreenExitProgress.id, progress, duration);
            }
          }
          // END
        }
      },
      hidePosterPlayerScreen(player,poster) {
        if(document.getElementById('v-player') && document.getElementById('v-poster')) {
          document.getElementById('v-player').style.display = player;
          document.getElementById('v-poster').style.display = poster;
          if(poster == "block") {
            this.showComUpNextTag = false;
            this.ShowSkipTag = false;
            // NOTE commented by sumit ***
            // this.vToggleLoader(false);
            if (this.vPlayer) {
              this.vPlayer.pause();
              this.hideVideoController(false, 'hidePosterPlayerScreen');
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
          this.playContent();
        }
      },
      windowFocusCB (_event) {
        // NOTE added by sumit for hide home player
        this.pressBackChangeToPoster();

        // eventBus.$emit("togglePlayerScreenFlagEnable",false);
        // this.hideVideoController(false, 'windowFocusCB');
        //
        // this.toggleLoader(true);
        //
        // this.hidePosterPlayerScreen("none","block");
        // eventBus.$emit("toggleEpisodelistPopup",false);
        // eventBus.$emit("togglePlayerVideoResolution","back");
        // this.showComUpNextTag = false;
        // this.ShowSkipTag = false;
        // this.toggleLoader(false);
      },
      windowBlurCB (_event) {
        this.pressBackChangeToPoster();

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
        if (document.getElementById('v-toggle')) {
            document.getElementById('v-toggle').style.display = "flex"
              }
        // console.log('[loadContentAtPlayerScreen > content]', content);
         if(content.campaign_ads && !this.getProgressForAds(content.id) && content.contentName != 'episode') {
            // console.log(1);
            this.isActiveAdd = true;
            this.ads();
          }

        if(!this.handleEventPlayer) {
          return;
        }

         // NOTE Breast Buffer
            let config = undefined;
            config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined;
            this.buffer_campaign = (config.buffer_campaign && config.buffer_campaign && config.buffer_campaign.is_active && config.buffer_campaign.apng  && content.buffer_campaign) ? config.buffer_campaign : null;

          // NOTE end of Breast buffer
    
        this.handleEventPlayer = false;

        // Set this flag to true, to let the component knows that the player should not redirect
        this.popupPlayer = true;

        this.containInfoDetails = content;
        this.nextEpisodePlayLoadMainfest = true;
        eventBus.$off("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);

        // NOTE by default this is false. @@ sumit beacuse episode switch value not updating
        this.contentRestricted = false;

        // NOTE @sumit when click on content,then by default display poster Issue #876
        // if(this.plrPosterImage && this.playerPosterImage) {
        // this.plrPosterImage = '/src/assets/alt-cover.jpg';
        // this.playerPosterImage = '/src/assets/alt-cover.jpg';
        // }

        // NOTE: CODE CHANGE @SANGEETH.
        // To reset the playlist and id which will be checked during the playlist creation.
        this.playerPlaylist = null;
        this.playlistEpisodes = [];

        // NOTE: CODE CHANGE @SANGEETH RESOLVING Issue #867. Set the value of data properties 'playlistEpisodeCount' and 'offset' to its initial state, so that the playlist would be recreated when the user plays the content from a click event.
        this.playlistEpisodeCount = 0;
        this.offset = 0;
        // NOTE: END CODE CHANGE @SANGEETH RESOLVING Issue #867

        this.id = null;
        // NOTE: END CODE CHANGE @SANGEETH

        this.makeFullscreen();
        this.initMountedPlayerScreen();
      },
      toggleEpisodelistPopupCB (state) {
        this.episodePopupState(state);
      },
      togglePlayerVideoResolutionCB (state) {
        this.toggleResolutionState(state);
      },
      episodeListCall(content) {
        this.playRelatedEpisodeClickFlag = true;
        // Dont call multiple time
        this.handleEventPlayer = true;
        // @sumit when press back we are unload the shaka so ,we can not access this.vPlayer
        // NOTE : stop Aws matrix details.
        this.stopMatrixInfo = {};
        let progress = (this.vPlayer && this.vPlayer.currentTime && this.vPlayer.duration) ? (this.vPlayer.currentTime / this.vPlayer.duration) * 100 : 0;
        progress = isNaN(progress) ? 0 : progress ;
        this.stopMatrixInfo.progress = progress;
        this.stopMatrixInfo.stop_time = (this.vPlayer && this.vPlayer.currentTime) ? this.vPlayer.currentTime : 0;
        // end

        this.vShaka.unload().then(() => {
          if (this.vPlayer) {
            this.vPauseEventCB();
          }
        });
        this.loadContentAtPlayerScreen(content);
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

      eventBus.$on("toggleChromeCastPlaying",this.handelChromecastPlayback);

      eventBus.$on("toggleFlagForPlay",(state) => {
        this.playlistCallbackEvent = true;
      });

      // NOTE: CODE CHANGE @SANGEETH
      // Separated the function logic to methods instead of inline method to 'off' the eventbus on beforeDestroy
      eventBus.$on('toggleEpisodelistPopup', this.toggleEpisodelistPopupCB);
      eventBus.$on('togglePlayerVideoResolution', this.togglePlayerVideoResolutionCB);
      // NOTE: END CODE CHANGE @SANGEETH

      eventBus.$on("togglePlayerSetResolution",(track) => {
        this.setVideoTrackToPlayer(track)
      });

      eventBus.$on("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);

      eventBus.$on("toggleSendDataToPlayerScreenForEpisodeList", this.episodeListCall);

      if(document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitEvent, false);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitEvent, false);
        document.addEventListener('fullscreenchange', this.fullScreenExitEvent, false);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitEvent, false);
      }

      let _this = this;
       window['__onGCastApiAvailable'] = function(isAvailable) {
           if (isAvailable) {
             _this.chromeCaseShow = true;
           }
       };
    },
    mounted() {
      // NOTE for testing localhost part
    
       if(location.hostname != "localhost") {
         window.removeEventListener('focus', this.windowFocusCB);
         window.removeEventListener('blur', this.windowBlurCB);

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

        // console.log("before destroy");
        this.buffer_campaign = null;

      eventBus.$off("toggleSendDataToPlayerScreen", this.loadContentAtPlayerScreen);
      eventBus.$off("toggleSendDataToPlayerScreenForEpisodeList",this.episodeListCall);
      // destroy add event listener
      if (this.vToggler) {
          // console.log("3");

        this.vToggler.removeEventListener('click', this.vTogglePlay);
      }

      if(this.vForward && this.vBackward) {
        this.vBackward.removeEventListener('click', this.vBackwardPlay);
        this.vForward.removeEventListener('click', this.vForwardPlay);
      }

      window.removeEventListener('orientationchange', this.pressBackChangeToPoster);
      window.removeEventListener('focus', this.windowFocusCB);
      window.removeEventListener('blur', this.windowBlurCB);
      document.removeEventListener('webkitfullscreenchange', this.fullScreenExitEvent,false);
      document.removeEventListener('mozfullscreenchange', this.fullScreenExitEvent, false);
      document.removeEventListener('fullscreenchange', this.fullScreenExitEvent, false);
      document.removeEventListener('MSFullscreenChange', this.fullScreenExitEvent, false);

      //  playButton.removeEventListener('click', playAds,false);


      // end of destroy
      // end
      eventBus.$off("togglePlayContent",this.playContent);
      // @sumit commented by for not emitting resolution change
      // eventBus.$off("togglePlayerSetResolution");
      eventBus.$off("toggleEpisodelistPopup", this.toggleEpisodelistPopupCB);
      eventBus.$off("togglePlayerVideoResolution", this.togglePlayerVideoResolutionCB);
      eventBus.$off("toggleChromeCastPlaying",this.handelChromecastPlayback);
      eventBus.$off('playTrailerBtnClickEvent', this.playTrailerBtnClickCB);

      this.setPlayerContent(undefined);
      this.playerPlaylist = undefined;

      if (this.vShaka) {
        this.vShaka.destroy().then(() => {
        }).catch((error) => {
        })
      }
    },
    mixins: [altMixins]
  }
</script>

<style>
  #mainContainer {
  position: relative;

}
/* video {
  width: 100%;
  display: block;
  height: auto;
} */

#adContainer {
  position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    /* JS will toggle the state */

}

</style>

