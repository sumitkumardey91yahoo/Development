<template>
    <div class="app-search alt-popup-bg search-bg">
        <div class="color-line lg" id="brand_color_class"></div>
        <div class="search-input">
            <div class="search-inp-sec ico-left">
                <img src="../../assets/lens.svg" alt='lens' class="header-ico search-input-elem search-ico" @click="showSearchTemp" v-show="!(isKidsMode)">
                <img src="../../assets/lens-dark.svg" alt='lens-dark' class="header-ico search-input-elem search-ico" @click="showSearchTemp" v-show="isKidsMode">
            </div>
            <div class="search-inp-sec input">
                <input type="search" id="alt-search-input" placeholder="Search movies, series and videos" class="alt-form-control search-input-elem"  @keyup="getSearchResults">
            </div>
            <div class="search-inp-sec ico-right">
                <img src="../../assets/close.svg"  alt='search-close' class="header-ico search-input-elem" @click="closeSearch" v-show="!(isKidsMode)">
                <img src="../../assets/close-dark.svg" alt='close-dark' class="header-ico search-input-elem" @click="closeSearch" v-show="isKidsMode">
            </div>

            <div class="clearfix"></div>
        </div>
        <!-- <div class="search-recent" v-if="recentSearches && valueResult!=true"> -->
        <div class="search-recent" v-if="recentSearches && recentSearches.length && valueResult!=true">
            <h4 v-show="!(isKidsMode)">Recent searches <img src="../../assets/bin.svg" alt='bin-search' class="header-ico search-right" @click="clearDefRecntSearch"></h4>
            <h4 v-show="isKidsMode">Recent searches <img src="../../assets/bin-dark.svg" alt='bin-dark' class="header-ico search-right" @click="clearDefRecntSearch"></h4>

            <ul>
                <li v-for="query in recentSearches" v-if="query!=''" @click="searchRecentQuery(query)">{{query}}</li>
            </ul>
            </ul>
        </div>
        <div class="v-center-box" v-if="emptyResult">
            <h3>No results found</h3>
        </div>
        <component v-else :is="searchComponent"></component>
    </div>
</template>
<script>
const SearchList = () => import (/* webpackChunkName: "shared-Search-SearchList" */ './SearchList.vue');
const SearchTemp = () => import (/* webpackChunkName: "shared-Search-SearchTemp" */ './SearchTemp.vue');

// import SearchList from './SearchList.vue';
// import SearchTemp from './SearchTemp.vue';

import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            searchQuery: '',
            searchComponent: 'SearchList',
            emptyResult: false,
            recentSearches: undefined,
            valueResult: undefined,
            isKidsMode: false,
        };
    },
    computed: {
        ...mapGetters([
            'searchResults',
        ]),
    },
    created() {
        // console.log('[Search | created | ]');

        this.checkAppMode();

        eventBus.$on('togglePopupSearch', this.searchTogglePopupSearchCB);
        eventBus.$on('toggleAppModeChangeEvent', this.toggleAppModeChangeCB);

        this.fetchRecentSearches();

        this.toggleLoader(false);
        this.setSearchResults(undefined);
    },
    components: {
        SearchList,
        SearchTemp,
    },
    methods: {
        ...mapMutations([
            'setSearchResults',
            'setSearchFilterResults',
        ]),
        ...mapActions([
            'actSearchQuery',
        ]),
        checkAppMode() {
            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            this.isKidsMode = (altProfileMode == 'kids') ? true : false;
        },
        toggleAppModeChangeCB() {
            this.checkAppMode();
        },
        getSearchResults(event) {
            this.searchComponent = 'SearchList';

            if (document.getElementById("alt-search-input").value.length > 0) {
                this.valueResult=true;
            }
            else{
                this.valueResult=false;
                this.emptyResult = false;
            }
            if (document.getElementById("alt-search-input").value.length > 2) {
                // NOTE: Code change for search redefinition
                // Coded by sangeeth
                this.setSearchResults(undefined);
                var searchQuery = document.getElementById("alt-search-input").value;
                this.searchTheQuery(searchQuery);

                if (event.keyCode == 13) {
                    document.getElementById("alt-search-input").blur();
                    this.searchRecentQuery(searchQuery);
                    this.saveLocalstorage(searchQuery);
                }

                // NOTE: Code added by sumit Commented
                // (05-01-18)
                // this.setSearchResults(undefined);
                // this.searchTheQuery(document.getElementById("alt-search-input").value);
                //
                // //added by sumit for enter the key search
                // if (event.keyCode == 13) { // 13 is enter key
                //     document.getElementById("alt-search-input").blur();
                //     this.searchRecentQuery(document.getElementById("alt-search-input").value);
                //     this.saveLocalstorage();
                // }
                // NOTE: End of Code change for search redefinition
            } else {
                this.setSearchResults(undefined);
            }
        },
        searchTheQuery(query, callback) {
            this.actSearchQuery(query).then((response) => {
                // AWS Mobile SDK Events
                if (window.mobileAnalyticsClient) {
                    var eventAttributeObj = this.getAWSMACommonAttributes();
                    eventAttributeObj.search_text = query;
                    window.mobileAnalyticsClient.recordEvent('_search.results', eventAttributeObj, {});

                    // window.mobileAnalyticsClient.recordEvent('_search.results', this.stuffSearchAttributes(document.getElementById("alt-search-input").value), { results: response.count});
                }
                // End of AWS Mobile SDK Events

                if (response && response.count) {
                    this.emptyResult = false;

                    var searchResultArr = new Array();
                    var mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
                    for (var i in response.media) {
                        var searchParsed = this.parseContents(response.media[i]);

                        if(searchParsed && searchParsed.geoBlock) {
                            let checkContent = undefined;
                            checkContent = this.geoBlockCountryWise(searchParsed.geoBlock);
                            if(checkContent) {
                                continue;
                            }
                        }
                        if (mediaProgressList) {
                            for (var j in mediaProgressList) {
                                if (searchParsed.contentId == mediaProgressList[j].media_id) {
                                    searchParsed.progress = mediaProgressList[j].progress;
                                    break;
                                }
                            }
                        }

                        searchResultArr.push(searchParsed);
                    }

                    // console.log('[Search | searchResultArr |test ]', searchResultArr);

                    this.setSearchResults(searchResultArr);
                    if (callback) callback();
                } else {
                    this.emptyResult = true;
                }
            }, (error) => {
                // AWS Mobile SDK Events
                if (window.mobileAnalyticsClient) {
                    var eventAttributeObj = this.getAWSMACommonAttributes();
                    eventAttributeObj.event_action = 'error';
                    eventAttributeObj.event_message = error.message ? error.message : 'N.A';
                    eventAttributeObj.event_code =  error.code ? error.code.toString() : '';
                    window.mobileAnalyticsClient.recordEvent('_search.results', eventAttributeObj, {});

                    // var eventAttributeObj = {};
                    // eventAttributeObj = this.stuffErrorAttributes(error.code, error.message);
                    // window.mobileAnalyticsClient.recordEvent('_search.results', eventAttributeObj, {});
                }
                // End of AWS Mobile SDK Events
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
        stuffErrorAttributes(code, message) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            eventAttributeObj.error_code = code.toString();
            eventAttributeObj.error_message = message;
            eventAttributeObj.event_action = 'error';

            return eventAttributeObj;
        },
        stuffSearchAttributes(searchQuery) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();
            eventAttributeObj.search_text = searchQuery;

            return eventAttributeObj;
        },
        closeSearch() {
            // console.log('[Search | closeSearch | searchQuery | ]', this.searchQuery);
            this.valueResult=false;
            this.setSearchResults(undefined);
            this.setSearchFilterResults(undefined);
            this.emptyResult = false;
            this.searchComponent = 'SearchList';
            // console.log('[Search | closeSearch | searchComponent | ]', this.searchComponent);

            if (this.searchQuery.length) {
                this.searchQuery = '';
                if (localStorage.getItem('altDefSearches')) {
                    this.recentSearches = JSON.parse(localStorage.getItem('altDefSearches'));
                }
            } else {
                if (document.getElementById("alt-search-input").value.length == 0) {
                    eventBus.$emit('togglePopupSearch', false);
                } else {
                    document.getElementById("alt-search-input").value="";
                }
            }
        },
        saveLocalstorage(searchQuery) {
            // console.log('[Debug | saveLocalstorage | searchQuery | ]', searchQuery);

            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            if (altProfileMode == 'kids') {
                var altKidsSearch = new Array();
                if (localStorage.getItem('altKidsSearch')) {
                    altKidsSearch = JSON.parse(localStorage.getItem('altKidsSearch'));
                }

                altKidsSearch.unshift(searchQuery);

                altKidsSearch = this.getUniqueArray(altKidsSearch);

                // console.log('[Search | saveLocalstorage | altKidsSearch | ]', altKidsSearch);

                this.recentSearches = altKidsSearch;
                localStorage.setItem('altKidsSearch', JSON.stringify(altKidsSearch));
            } else {
                var altDefSearches = new Array();
                if (localStorage.getItem('altDefSearches')) {
                    altDefSearches = JSON.parse(localStorage.getItem('altDefSearches'));
                }

                altDefSearches.unshift(searchQuery);

                altDefSearches = this.getUniqueArray(altDefSearches);

                // console.log('[Search | saveLocalstorage | altDefSearches | ]', altDefSearches);

                this.recentSearches = altDefSearches;
                localStorage.setItem('altDefSearches', JSON.stringify(altDefSearches));
            }
        },
        showSearchTemp() {
            // Get the search query
            let searchQuery = undefined;
            // From the text box element
            if (document.getElementById('alt-search-input')) {
                searchQuery = document.getElementById('alt-search-input').value;
            }

            // If no query in the search box
            // Don't do anything
            if (!searchQuery) return;

            this.saveLocalstorage(searchQuery);

            this.searchComponent = 'SearchTemp';
            this.valueResult = true;
        },
        searchRecentQuery(query) {
            // console.log('[Search | searchRecentQuery | query | ]', query);

            this.setQueryToInput(query);
            this.searchTheQuery(query, () => {
                this.searchComponent = 'SearchTemp';
            });
            this.valueResult=true;
        },
        setQueryToInput(query) {
            // console.log('[Search | setQueryToInput | query | ]', query);

            document.getElementById('alt-search-input').value = query;
        },
        clearDefRecntSearch() {
            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            if (altProfileMode == 'kids') {
                localStorage.removeItem('altKidsSearch');
            } else {
                localStorage.removeItem('altDefSearches');
            }
            this.recentSearches = undefined;
        },
        searchTogglePopupSearchCB(state) {
            // console.log('[Search | searchTogglePopupSearchCB | state | ]', state);
            // console.log('[Search | searchTogglePopupSearchCB | recentSearches | ]', this.recentSearches);
            // console.log('[Search | searchTogglePopupSearchCB | valueResult | ]', this.valueResult);

            this.fetchRecentSearches();

            if (!state) return;
            this.valueResult = false;
            var searchInput = document.getElementById("alt-search-input");
            if (searchInput) {
                searchInput.value = '';
            }
            this.searchComponent = 'SearchList';
            this.setSearchResults(false);
        },
        fetchRecentSearches() {
            var altProfileMode = undefined;
            if (localStorage.getItem('altProfileMode')) {
                altProfileMode = localStorage.getItem('altProfileMode');
            } else {
                altProfileMode = 'default';
                localStorage.setItem('altProfileMode', altProfileMode);
            }

            if (altProfileMode == 'kids') {
                var altKidsSearch = new Array();
                if (localStorage.getItem('altKidsSearch')) {
                    altKidsSearch = JSON.parse(localStorage.getItem('altKidsSearch'));
                }
                altKidsSearch = this.getUniqueArray(altKidsSearch);

                // console.log('[Search | saveLocalstorage | altKidsSearch | ]', altKidsSearch);

                this.recentSearches = altKidsSearch;
            } else {
                var altDefSearches = new Array();
                if (localStorage.getItem('altDefSearches')) {
                    altDefSearches = JSON.parse(localStorage.getItem('altDefSearches'));
                }
                altDefSearches = this.getUniqueArray(altDefSearches);

                // console.log('[Search | saveLocalstorage | altDefSearches | ]', altDefSearches);

                this.recentSearches = altDefSearches;
            }
        },
    },
    mixins: [altMixins]
}
</script>
