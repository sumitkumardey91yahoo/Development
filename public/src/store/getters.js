export const baseUrl = (state) => {
    var baseUrl = state.baseUrl;
    /**
     * if value of baseUrl exists
     */
    if (baseUrl) {
        return (baseUrl).replace(/\/$/, "");
    }
    return undefined;
}

export const freshdeskUrl = (state) => {
    var freshdeskUrl = state.freshdeskUrl;
    /**
     * if value of baseUrl exists
     */
    if (freshdeskUrl) {
        return (freshdeskUrl).replace(/\/$/, "");
    }
    return undefined;
}

export const domain = (state) => {
    return state.domain;
}

export const appVersionName = (state) => {
    return state.appVersionName;
}
export const appVersionCode = (state) => {
    return state.appVersionCode;
}

export const deviceId = (state) => {
    return localStorage.getItem('altDeviceId');
}

export const appActive = (state) => {
    return state.appActive;
}

export const user = (state) => {
    return state.user;
}

export const account = (state) => {
    return state.account;
}

export const navMenus = (state) => {
    return state.navMenus;
}

export const userLoggedIn = (state) => {
    return state.userLoggedIn;
}

export const sectionMenus = (state) => {
    return state.sectionMenus;
}

export const otherMenus = (state) => {
    return state.otherMenus;
}

export const homeSectionId = (state) => {
    return state.homeSectionId;
}

export const kidsSectionId = (state) => {
    return state.kidsSectionId;
}

export const altMessage = (state) => {
    return state.altMessage;
}

export const routerToParam = (state) => {
    return state.routerToParam;
}

export const routerFromParam = (state) => {
    return state.routerFromParam;
}


export const discountData = (state) => {
    return state.discountData;
}

export const paymentPayuUrl = (state) => {
    return state.paymentPayuUrl;
}

export const signupRedirectData = (state) => {
    return state.signupRedirectData;
}

export const syndicationUrl = (state) => {
    return state.syndicationUrl;
}

export const paymentProxyUrl = (state) => {
    return state.paymentProxyUrl;
}
export const FaqData = (state) => {
    return state.FaqData;
}

export const faqMessage = (state) => {
    return state.faqMessage;
}

export const faqSelectedSection = (state) => {
    return state.faqSelectedSection;
}

export const episodeListing = (state) => {
    return state.episodeListing;
}
export const playerVideoResolution = (state) => {
    return state.playerVideoResolution;
}

export const chromecastState = (state) => {
    return state.chromecastState;
}
export const subSections = (state) => {
    return state.subSections;
}

export const defaultModeCurrentSubcategory = (state) => {
    return state.defaultModeCurrentSubcategory;
}

export const showTrailerInfo = (state) => {
    return state.showTrailerInfo;
}

export const currentEpisodeInfo = (state) => {
    return state.currentEpisodeInfo;
}

export const currentShowPlaylists = (state) => {
    return state.currentShowPlaylists;
}

export const hasBts = (state) => {
    return state.hasBts;
}

export const selectAutoQuality = (state) => {
  return state.selectAutoQuality;
}

export const episodeList = (state) => {
    return state.episodeList;
}

export const totalEpisodeCount = (state) => {
    return state.totalEpisodeCount;
}

export const userEmailCampaign =(state) => {
    return state.userEmailCampaign
}
