import Vue from 'vue'
import Vuex from 'vuex'

import home from './modules/home'
 import player from './modules/player'
import settings from './modules/settings'
import profile from './modules/profile'
import search from './modules/search'
import help from './modules/help'
import subscribe from './modules/subscribe'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'
import paytm from './modules/paytm'



Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    configUrl: 'https://static.cloud.altbalaji.com/config/pwa/prod-config.json',
    appVersionName: '2.0',
    appVersionCode: '30',
    baseUrl: undefined,
    freshdeskUrl: undefined,
    domain: undefined,
    appActive: undefined,
    navMenus: undefined,
    sectionMenus: undefined,
    otherMenus: undefined,
    homeSectionId: undefined,
    kidsSectionId: undefined,
    user: undefined,
    userLoggedIn: false,
    userActive: false,
    account: undefined,
    device: undefined,
    order: undefined,
    deviceId: undefined,
    altMessage: undefined,
    routerToParam: undefined,
    routerFromParam: undefined,
    discountData: undefined,
    signupRedirectData: undefined,
    syndicationUrl : undefined,
    FaqData:undefined,
    faqMessage:undefined,
    faqSelectedSection:undefined,
    paymentProxyUrl:undefined,
    episodeListing:undefined,
    playerVideoResolution:undefined,
    chromecastState:undefined,
    subSections:undefined,
    defaultModeCurrentSubcategory:undefined,
    showTrailerInfo:undefined,
    currentEpisodeInfo:undefined,
    currentShowPlaylists:undefined,
    hasBts: null,
    episodeList: null,
    totalEpisodeCount:null,
    userEmailCampaign: null
  },
  getters,
  mutations,
  actions,
  modules: {
    home, subscribe,player,settings, profile, search, help,paytm
  }
})



