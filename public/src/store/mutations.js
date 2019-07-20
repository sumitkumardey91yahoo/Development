export const setNavMenus = (state, menu) => {
    state.navMenus = menu;
}

export const setBaseUrl = (state, url) => {
    state.baseUrl = url;
}

export const setFreshdeskUrl = (state, url) => {
    state.freshdeskUrl = url;
}

export const setDomain = (state, domain) => {
    state.domain = domain;
}

export const setSectionMenus = (state, menus) => {
    state.sectionMenus = menus;
}

export const setOtherMenus = (state, menus) => {
    state.otherMenus = menus;
}

export const setHomeSectionId = (state, id) => {
    state.homeSectionId = id;
}

export const setKidsSectionId = (state, id) => {
    state.kidsSectionId = id;
}

export const setAppActive = (state, value) => {
    state.appActive = value;
}

export const setUser = (state, user) => {
    state.user = user;
}

export const setUserLoggedIn = (state, status) => {
    state.userLoggedIn = status;
}

export const setAccount = (state, account) => {
    state.account = account;
}

export const setDevice = (state, device) => {
    state.device = device;
}

export const setOrder = (state, order) => {
    state.order = order;
}

export const setAltMessage = (state, message) => {
    state.altMessage = message;
}

export const setRouterToParam = (state, param) => {
    state.routerToParam = param;
}

export const setRouterFromParam = (state, param) => {
    state.routerFromParam = param;
}


export const setDiscountData = (state, data) => {
    state.discountData = data;
}

export const setPaymentPayuUrl = (state, payuUrl) => {
    state.paymentPayuUrl = payuUrl;
}
export const setSignupRedirectData = (state, signupRedirectDataParameter) => {
    state.signupRedirectData = signupRedirectDataParameter;
}

export const setSyndicationUrl = (state, surl) => {
    state.syndicationUrl = surl;
}

export const setPaymentProxyUrl = (state, purl) => {
    state.paymentProxyUrl = purl;
}

export const setFaqData = (state, data) => {
    state.FaqData = data;
}

export const setFaqMessage = (state, data) => {
    state.faqMessage = data;
}

export const setFaqSelectedSection = (state, data) => {
    state.faqSelectedSection = data;
}
export const setEpisodeListing = (state,episodes) => {
    state.episodeListing = episodes;
}
export const setPlayerVideoResolution = (state,resolution) => {
    state.playerVideoResolution = resolution;
}

export const setChromecastState = (state,chromecast) => {
    state.chromecastState = chromecast;
}

export const setSubsectionListing = (state,info) => {
    state.subSections = info;
}
export const setDefaultModeCurrentSubcategory = (state,subcategory) => {
    state.defaultModeCurrentSubcategory = subcategory;
}
export const setShowtrailerInfo = (state,data) => {
    state.showTrailerInfo = data;
}
export const setCurrentEpisodeInfo = (state,episode) => {
    state.currentEpisodeInfo = episode;
}

export const setCurrentShowPlaylists = (state,playlist) => {
    state.currentShowPlaylists = playlist;
}

export const setHasBts = (state,bts) => {
    state.hasBts = bts;
}

export const setVideoqualityAuto = (state,quality) => {
    state.selectAutoQuality = quality;
}

export const setEpisodeList = (state,episode) => {
    state.episodeList = episode;
}

export const setTotalEpisodeCount = (state,count) => {
    state.totalEpisodeCount = count;
}

export const setUserEmailCampaign = ( state, name) => {
    state.userEmailCampaign = name;
}
