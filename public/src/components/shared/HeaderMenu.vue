<template>
  <div class="nav-container" id="nav-container">
    <nav class="menu" id="nav-menu">
      <div class="alt-nav-top" id="alt-nav-top">
        <!-- Code change for kids mode switch -->
          <div class="switch-kids">
            <div class="humburger-user-name">{{(humburgerUserDetails)}}</div>
            <div class="humberger-profile-switch" @click="switchToKidsMode" style="display:none">
              <b>Switch To</b>
              <!-- <img src="../../assets/kids.png" alt="kids-icon-humburger"  class="kids-icon-humburger"> -->
              <img class="switch-profile" src="../../assets/kids-arrow.png" alt="kids-go" />
            </div>
          </div>

        <div class="adv-space" id="adv-space">
          <div class="button-space space-abs space-right">
            <button type="button" class="btn grad-btn btn-sm" v-show="!(userLoggedIn)" @click="signinUser">Sign in</button>
            <button type="button" class="btn grad-btn btn-sm" v-show="userLoggedIn && showSubscribeButton" @click="routeToSubscribe">Subscribe Now</button>
            <button type="button" class="btn grad-btn btn-sm" v-show="userLoggedIn && showWatchNow" @click="playHotspotMedia">Watch Now</button>
          </div>

          <img class="adv" alt="adv-img"  v-show="hotspotImg" :src="hotspotImg" @click="playHotspotMedia" />
        </div>
      </div>

      <ul class="navigation" id="alt-navigation">
        <li v-for="menu in sectionMenus" @click="eventSectionMenu(menu, $event)">
          <router-link :to="getRouterName(menu)" class="navigation-link"     v-show="isMenuVisible(menu)" exact>
            {{getMenuTitle(menu)}} <span class="nav-badge" v-show="isShowNavBadge(menu) && notificationCountData && hideCountNotification">{{notificationCountData}}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="nav-overlay" id="nav-overlay" @click="toggleNavMenu(false)"></div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      altKidsUser: undefined,
      showSubscribeButton: undefined,
      userState: undefined,
      hotspotImg: undefined,
      hotspotsUrl: undefined,
      trackUserStatues:true,
      kidsProfile: undefined,
      sectionMenus: undefined,
      hideCountNotification :true,
      notificationCountData : undefined,
      humburgerUserDetails:undefined,
      showWatchNow:undefined
    };
  },
  computed: {
    ...mapGetters([
    'appActive',
    'otherMenus',
    'routerToParam',
    'userLoggedIn',
    ]),
  },
  watch: {
    appActive() {
      this.getHotspotImg();
      this.renderNavMenus();
    },
    '$route'(to, from) {
           this.navigationMenuUpdate();
    }
  },
  methods: {
    ...mapMutations([
    'setUserLoggedIn',
    'setAltKidsUser',
    'setRouterToParam',
    'setRouterFromParam',
    'setAccessToKidsMode',
    ]),
    ...mapActions([
    'actCheckWithAccount',
    'actGetProfileSwitch',
    'actGetHotspotContents',
    'actGetMediaHotspot'
    ]),
    navigationMenuUpdate() {
              // menu color
           let routeName = undefined;
        
             routeName = this.$route.name;
          
         if ( routeName == 'subscription') {
              routeName= "subscribe";
         }
       
          for ( let i in this.sectionMenus) {
              let data = this.sectionMenus[i];
              let selectData = ''
              if(data.type == 'section') {
                selectData = (data.title).toLowerCase();
              } else {
                selectData = data.type ;

              }
               setTimeout(() => {
                 
            if (selectData == routeName) {

                let color_campaign = document.querySelectorAll('.navigation-link.router-link-active')[0];
              
                 let color_campaign_test = document.querySelectorAll('.navigation-link');
                    for (let i of color_campaign_test) {
                      i.style.color = "white"
                    }
               

                 if (data.color) {
                    
                   color_campaign.style.color = data.color;
                 } else {
                   color_campaign.style.color = '#fe0032';
                  
                 }

            } 

          });
          }

    },
    shortString(titleInfo) {
      let title = titleInfo.trim();
      if(!title) {
        return 'Welcome!';
      }
      if(title.length > 12) {
        return title.substring(0,12) + "...";
      } else {
        return title;
      }
    },
    signinUser() {
      // this.setRouterFromParam({ name: 'home', path: '/', fullPath: '/', query: {}, params: {} });

      this.setRouterFromParam(undefined);
      this.setRouterToParam(undefined);
      this.toggleNavMenu();
      this.$router.push({ name: 'login' });
    },
    getRouterName(menu, self) {
      var name = undefined;
      var altUser = undefined;
      var altOrder = undefined;

      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));

        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }
      }

      // If the menu is home menu set the router-link to root link
      if (menu.title == 'Home') {
        name = 'home'
      } else if (menu.type == 'subscribe') {
        if (altUser && altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          name = 'subscription';
        } else {
          name = 'subscribe';
        }
      } else {
        name = menu.title.replace(/ /g,'-').toLowerCase();
      }

      return { name };
    },
    isMenuVisible(menu) {
      if (menu.requireLogin) {
        return this.userLoggedIn;
      }
      return true;
    },
    getMenuTitle(menu) {
      // Get the user data and order data
      var altUser = undefined;
      var altOrder = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));

        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }
      }

      if (menu.type == 'subscribe') {
        if (altUser && altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          return 'Subscription';
        } else {
          return 'Subscribe';
        }
      }

      return menu.title;
    },
    isShowNavBadge(menu) {
      //NOTE added by sumit for added badge for notifications count 01/01/2018

      if (menu.type == 'notifications') {
        var notificationCount = undefined;
        if(localStorage.getItem('deleteNotificationNotify') == 'on') {
          return false
        }
        return true;
      }
      return false;
    },
    getOtherMenuLink(menu) {
      return { name: menu.type }
    },
    switchToKidsMode() {
      // Code change for kids mode switch
      this.toggleLoader(true);
      // Hide the nav menu
      this.toggleNavMenu(false);

      // Check for user status
      var altUser = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));

        // Check for order details
        var altOrder = undefined;

        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }
      }

      if (altUser) {
        // Check for subscription
        if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          // Check the user account for profile and pin
          this.checkUserAccount();
        } else {
          // If user has no subscription
          // Show the subscribe popup
          eventBus.$emit('togglePopupKidsSubscribe', true);

          if(document.getElementById('alt-app')) {
            document.getElementById('alt-app').style.position = "fixed";
          }

          // Hide the loader
          this.toggleLoader(false);
        }
      } else {
        // If user is not logged in
        // Show the kids login popup
        eventBus.$emit('togglePopupKidsSignin', true);

        if(document.getElementById('alt-app')) {
          document.getElementById('alt-app').style.position = "fixed";
        }

        // Hide the loader
        this.toggleLoader(false);
      }
    },
    checkUserAccount(callback) {
      this.actCheckWithAccount().then((response) => {
        if (response.count && response.count > 1) {
          // Get the kids profile from the response
          var kidsProfile = response.profiles[1];

          // Check for pin
          if (response.account && response.account.pin) {
            kidsProfile.pin = response.account.pin;
            this.switchToKidsProfile(kidsProfile);
          } else {
            // If PIN is not availble
            // Redirect user to PIN create page
            this.$router.push({ name: 'createKidsPin' });
          }
        } else {
          eventBus.$emit('togglePopupKidsCreatePin', true);
          this.toggleLoader(false);
        }
      }, (error) => {
        if (error.code && error.code == 404) {
          eventBus.$emit('togglePopupDeviceRemoved', false);
        }
      });
    },
    switchToKidsProfile(kidsProfile) {
      this.actGetProfileSwitch(kidsProfile).then((response) => {
        var altUser = undefined;
        if (localStorage.getItem('altUser')) {
          altUser = JSON.parse(localStorage.getItem('altUser'));
        }

        if (altUser) {
          altUser.sessionToken = response.session_token;
          altUser.uuid = response.uuid;
          altUser.username = response.username;

          localStorage.setItem('altUser', JSON.stringify(altUser));
        }

        eventBus.$emit('toggleAppModeChangeEvent', 'kids');
        this.$router.push({ name: 'home' });
        // Hide the loader
        this.toggleLoader(false);
      }).catch((error) => {
        // console.log('[HeaderMenu | switchToKidsProfile | error | ]', error);
      });
    },
    routeToSubscribe() {
      this.toggleNavMenu(false);
      this.$router.push({ name: 'subscribe' });
    },
    switchProfile() {
      this.actGetProfileSwitch(this.altKidsUser).then((response) => {
        if (response) {
          this.altKidsUser.sessionToken = response.session_token;
          this.altKidsUser.uuid = response.uuid;
          this.altKidsUser.parentalControl = response.parental_control;
          localStorage.setItem('altProfileMode', 'kids');
          localStorage.setItem('altKidsUser', JSON.stringify(this.altKidsUser));
          /**
          * route to kids page
          */
          this.$router.push({ name: 'kidsMode' });
        }
      }, (error) => {
      });
    },
    eventSectionMenu(menu, self) {
      // menu color
      let color_campaign_test = document.querySelectorAll('.navigation-link');
      for (let i of color_campaign_test) {
        i.style.color = "white"
      }
      if (menu.color) {
        let color_campaign = document.querySelectorAll('.navigation-link.router-link-active')[0];
        self.target.style.color = menu.color;
      } else {
        let color_campaign = document.querySelectorAll('.navigation-link.router-link-active')[0];
        self.target.style.color = '#fe0032';
      }
     //color

      this.webEnagePageView((menu && menu.title) ? menu.title : '');

      this.toggleNavMenu(false);

      // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        var menuSelectAttributes = this.getAWSMACommonAttributes();
        menuSelectAttributes.page_title = menu.title ? menu.title : 'N.A';
        menuSelectAttributes.section_id = menu.sectionID ? menu.sectionID : 'N.A';
        window.mobileAnalyticsClient.recordEvent('_menu.select', menuSelectAttributes, {});

        // window.mobileAnalyticsClient.recordEvent('_menu.select', this.stuffMenuSelectAttributes(menu.title, menu.sectionID), {});

        // var pageSelectAttributes = this.getAWSMACommonAttributes();
        // pageSelectAttributes.page_title = menu.title ? menu.title : 'N.A';
        // pageSelectAttributes.page_url = window.location.href;
        //
        // window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});
      }
      // End of AWS Mobile SDK Events
    },
    showOtherMenu(menu) {
      if (this.userLoggedIn) {
        return true;
      } else {
        if (menu.requireLogin) {
          return false;
        }
        return true;
      }
    },
    routeToKidsMode() {
      // this.toggleLoader(true);

      this.setAccessToKidsMode(true);
      this.toggleNavMenu(false);
    },
    toggleUserModeChangeCB(state) {
      // NOTE login time this will get image and get correct api call Issue #895
      // beacuse after login as subscrbe user ,i was taking anonymous user details
      this.getHotspotImg();

      // Get the user data and order data
      var altUser = undefined;
      var altOrder = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));

        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }
      }

      if (altUser) {
        this.setUserLoggedIn(true);

        if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          this.showSubscribeButton = false;
          this.showWatchNow = true;
        } else {
          this.showSubscribeButton = true;
          this.showWatchNow = false;
        }
      } else {
        this.setUserLoggedIn(false);
      }

      this.renderNavMenus();
    },
    renderNavMenus() {
      // Get the user data and order data
      var altUser = undefined;
      var altOrder = undefined;
      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));

        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }
      }

      // Section Menus
      var altConfig = undefined;
      if (localStorage.getItem('altConfig')) {
        altConfig = JSON.parse(localStorage.getItem('altConfig'));
      }

      if (altConfig && altConfig.menus) {
        var menus = altConfig.menus;

        var subscribeMenuIndex = menus.findIndex((menu) => {
          return menu.type && menu.type == 'subscribe';
        });

        if (altUser && altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          menus[subscribeMenuIndex].title = 'Subscription';
        }

        var notificationMenuIndex = menus.findIndex((menu) => {
          return menu.type && menu.type == 'notifications';
        });

        if (menus[notificationMenuIndex].type == 'notifications') {

          if (localStorage.getItem('notificationsCount')) {
            this.notificationCountData = parseInt(localStorage.getItem('notificationsCount'));
          }
        }

        this.sectionMenus = menus;

        for (var i in this.sectionMenus) {
          if (this.sectionMenus[i].type && this.sectionMenus[i].type == 'downloads') {
            this.sectionMenus.splice(i, 1);
            break;
          }
        }
        // console.log("this.sectionMenus", this.sectionMenus)

        // menu color
           let routeName = undefined;
          routeName = this.$route.name;
         // console.log(routeName, "test")
         if ( routeName == 'subscription') {
              routeName= "subscribe";
         }
          for ( let i in this.sectionMenus) {
              let data = this.sectionMenus[i];
              let selectData = ''
              if(data.type == 'section') {
                selectData = (data.title).toLowerCase();
              } else {
                selectData = data.type ;
              }

            
            if (selectData == routeName ) {
               setTimeout(() => {
                    let color_campaign_test = document.querySelectorAll('.navigation-link');
                    for (let i of color_campaign_test) {
                      i.style.color = "white"
                    }
                 let color_campaign = document.querySelectorAll('.navigation-link.router-link-active')[0];
                 if (data.color) {
                   color_campaign.style.color = data.color;
                 } else {
                   color_campaign.style.color = '#fe0032';

                 }
               
               });

            }
          }
  

      }
    },
    getHotspotImg() {
      var altUser = undefined;
      var altOrder = undefined;
      var userState = undefined;

      if (localStorage.getItem('altUser')) {
        if (localStorage.getItem('altOrder')) {
          altOrder = JSON.parse(localStorage.getItem('altOrder'));
        }

        if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
          userState = 'subscribers';
        } else {
          userState = 'registered';
        }
      } else {
        userState = 'anonymous';
      }

      this.actGetHotspotContents(userState).then((response) => {

        if (response.count) {
          var hotspotImages = response.hotspots[0].images;
          this.hotspotsUrl = response.hotspots[0].link.uri;

          if (hotspotImages && hotspotImages.length) {
            let config = undefined;
            let isCloudinaryEnabled = false;
            config = localStorage.getItem("altConfig") ? JSON.parse(localStorage.getItem("altConfig")) : undefined
            if(config && config.environment && config.environment.isCloudinaryEnabled) {
               isCloudinaryEnabled = true;
            }
            if(isCloudinaryEnabled) {
              this.hotspotImg = 'https://res.cloudinary.com/alt-demo/image/fetch/q_auto,w_' + Math.ceil((window.screen.width * 1.0)) + '/' + hotspotImages[0].source;
            } else {
              this.hotspotImg = hotspotImages[0].source;
            }

          }
        }
        // this.toggleLoader(false);
      }, (error) => {
      });
    },
    playHotspotMedia () {
      this.toggleNavMenu(false);
      // Get the user data and user order data
      var altUser = undefined;
      var altOrder = undefined;

      if (localStorage.getItem('altUser')) {
        altUser = JSON.parse(localStorage.getItem('altUser'));
      }
      if (altUser && localStorage.getItem('altOrder')) {
        altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      // If the user don't have the subscription, exit out of the method
      if (!(altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false)) {
        return;
      }

      // Show the loader when the user clicks on the hotspot image.
      // Loader will be hidden when the user lands on the player page
      // this.toggleLoader(true);

      this.actGetMediaHotspot(this.hotspotsUrl).then((response) => {
        var parsedResponse = this.parseContents(response);
        this.searchResults = parsedResponse;

        var routerObj = {
          name: parsedResponse.contentName,
          params: {
            id: parsedResponse.id
          }
        };

        if (this.$route.name == routerObj.name && response.id == this.$route.params.id) {

          this.toggleLoader(false);
          return;
        }

        // @sumit for navigated to show page ,show take id from URL query.
       // eventBus.$emit("toggleSendDataToPlayerScreen",parsedResponse);

       // @sumit for event source playback
       localStorage.setItem('event_source', 'hotspot');

        

         if (this.searchResults.contentName == 'episode') {
         
            eventBus.$emit("togglePlayerScreenFlagEnable",true);
            this.checkScreenRotationType();
          } else {
            this.$router.push(routerObj);
          }

      }, (error) => {
      });
    },
        checkScreenRotationType() {
        if(('orientation' in screen)) {
          if (matchMedia('(orientation: portrait)').matches) {
            this.makeFullscreen(this.landscapeRotation);
          } else {
            this.makeFullscreen(this.landscapeRotation);
          }
        }
      },
      makeFullscreen(callback) {
        this.vContain = document.getElementById('v-contain');
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
        if(callback) {
          callback();
        }
      },
      landscapeRotation() {
        screen.orientation.lock('landscape').then((response) => {
          eventBus.$emit("toggleSendDataToPlayerScreen",  this.searchResults);
        },(error) => {
          // console.log("landscapeRotation",error);
          eventBus.$emit("toggleSendDataToPlayerScreen",  this.searchResults);

        });
      },
    stuffCommonAttributes() {
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
    stuffMenuSelectAttributes(sectionTitle, sectionId) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();
      eventAttributeObj.page_title = sectionTitle ? sectionTitle : '';
      eventAttributeObj.section_id = sectionId ? sectionId.toString() : '';

      return eventAttributeObj;
    },
    stuffPageViewAttributes( pageTitle, pageUrl) {
      var eventAttributeObj = {}
      eventAttributeObj = this.stuffCommonAttributes();

      eventAttributeObj.page_title = pageTitle;
      eventAttributeObj.page_url = pageUrl;

      return eventAttributeObj;
    },
  },
  created() {
    eventBus.$on('toggleUserModeChange', this.toggleUserModeChangeCB);

    // this.showSubscribeButton = false;

    // Get the user data and order data
    var altUser = undefined;
    var altOrder = undefined;

    if (localStorage.getItem('altUser')) {
      altUser = JSON.parse(localStorage.getItem('altUser'));
      if(localStorage.getItem('user_name')) {
        this.humburgerUserDetails  = localStorage.getItem('user_name').trim() ? localStorage.getItem('user_name') : 'Welcome!';
         if(localStorage.getItem('user_name').search('null') >= 0) {
             this.humburgerUserDetails = 'Welcome!';
         }
      }

      if (localStorage.getItem('altOrder')) {
        altOrder = JSON.parse(localStorage.getItem('altOrder'));
      }

      if (altOrder && altOrder.subscription && altOrder.subscription.hasOrder && altOrder.subscription.expired == false) {
        this.showSubscribeButton = false;
        this.showWatchNow = true;
      } else {
        this.showSubscribeButton = true;
      }
    } else {
      this.humburgerUserDetails  = 'Welcome!';
    }

    eventBus.$on('changeHeaderSubcribeButton',(state) => {
      this.showSubscribeButton = state;
    });
    eventBus.$on('changeHumburgerName',(state) => {
      if(state && state.trim()) {
        this.humburgerUserDetails = state.trim();
      } else {
        this.humburgerUserDetails  = 'Welcome!';
      }
    });

    // Set the user logged in flag
    this.setUserLoggedIn(altUser ? true : false);
    this.renderNavMenus();
  },
  beforeDestroy() {
    eventBus.$off('toggleUserModeChange', this.toggleUserModeChangeCB);
  },
  mixins: [altMixins]
}
</script>
