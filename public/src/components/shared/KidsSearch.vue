<template>

    <div class="kids-search alt-popup-bg white-bg" id="kids-search" style="display:none;">
    <!-- <div class="app-search alt-popup-bg white-bg">
        <div class="search-input">
            <img src="../../assets/lens-dark.svg" class="header-ico search-input-elem search-ico" @click="showFilterTemplate">
            <input type="search" id="alt-search-input" placeholder="Search movies, series and videos" class="alt-form-control alt-wform-control search-input-elem" @keyup="getSearchResults">
            <img src="../../assets/close-dark.svg" class="header-ico search-input-elem" @click="closeSearch">
            <div class="clearfix"></div>
                <div class="search-recent search-recent-kid" v-if="recentSearches && valueResult!=true">
            <h4>Recent searches <img src="../../assets/bin_dark.svg" class="header-ico" @click="clearDefRecntSearch"></h4>
            <ul>
                <li v-for="query in recentSearches" v-if="query!=''" @click="searchRecentQuery(query)">{{query}}</li>
            </ul>
        </div>
        </div>

        <div class="v-center-box" v-if="emptyResult">
            <h3>No results found</h3>
        </div>
        <component v-else :is="searchComponent"></component>
        </div> -->
    </div>
</template>

<script>
const KidsSearchList = () => import (/* webpackChunkName: "shared-KidsSearch-KidsSearchList" */ './KidsSearchList.vue');
const KidsSearchTemp = () => import (/* webpackChunkName: "shared-KidsSearch-./KidsSearchTemp" */ './KidsSearchTemp.vue');

// import KidsSearchList from './KidsSearchList.vue';
// import KidsSearchTemp from './KidsSearchTemp.vue';

import { eventBus } from '../../main'
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            searchQuery: '',
            searchComponent: 'KidsSearchList',
            emptyResult: false,
            recentSearches: undefined,
            valueResult:undefined,
        };
    },
    computed: {
        ...mapGetters([
            'searchResults',
        ]),
    },
    methods: {
        ...mapMutations([
            'setSearchResults',
        ]),
        ...mapActions([
            'actSearchQueryKids',
        ]),
        getSearchResults(event) {
            this.searchComponent = 'KidsSearchList';

              if (document.getElementById("alt-search-input").value.length > 0) {
              this.valueResult=true;
             }
             else{
                 this.valueResult=false;
                 this.emptyResult = false;
             }

            if (document.getElementById("alt-search-input").value.length > 2) {
                this.setSearchResults(undefined);
                this.searchTheQuery(document.getElementById("alt-search-input").value);
                //added by sumit for enter the key search
                if (event.keyCode == 13) { // 13 is enter key
                    document.getElementById("alt-search-input").blur();
                    this.searchRecentQuery(document.getElementById("alt-search-input").value);
                    //// console.log("kidsSearch|event 13 code");

                    //sumit start kidsSearch keyboard
                    this.saveLocalstorage();
                   //end keyboard
               }
              //added by sumit

            } else {
                this.setSearchResults(undefined);
            }
        },
        saveLocalstorage() {
            if (localStorage.getItem('altDefSearches_kid')) {
              var altDefSearches_kid = JSON.parse(localStorage.getItem('altDefSearches_kid'));
          } else {
              var altDefSearches_kid = new Array();
          }
              if(document.getElementById("alt-search-input").value.length >  2) {

          var index=this.isInArray(document.getElementById("alt-search-input").value,altDefSearches_kid);
                    // console.log("index value kids,",index);
                      if(index > -1)
                      {
                          altDefSearches_kid.splice(index, 1);
                      }
              altDefSearches_kid.push(document.getElementById("alt-search-input").value);
           }
           if (altDefSearches_kid.length > 0) {
          localStorage.setItem('altDefSearches_kid', JSON.stringify(altDefSearches_kid));
            }

          this.recentSearches = this.revObject(JSON.parse(localStorage.getItem('altDefSearches_kid')));

        },
        searchTheQuery(query,callback) {
            this.searchComponent = 'KidsSearchList';
                this.searchQuery=document.getElementById("alt-search-input").value;
                this.setSearchResults(undefined);
                this.actSearchQueryKids(query).then(
                    (response) => {
                        // console.log('[Search | getSearchResults | response | ]', response);

                        if (response && response.count) {
                            this.emptyResult = false;

                            var searchResultArr = new Array()
                            for (var i in response.media) {
                                searchResultArr.push(this.parseContents(response.media[i]));
                            }

                        //start add media process
                        var searchResultArr = new Array();
                        var mediaProgressList = JSON.parse(localStorage.getItem('mediaProgressList'));
                        for (var i in response.media) {
                            var searchParsed = this.parseContents(response.media[i]);
                            if (mediaProgressList) {
                                for (var j in mediaProgressList) {
                                    if (searchParsed.contentId == mediaProgressList[j].mediaId) {
                                        searchParsed.progress = mediaProgressList[j].progress;
                                        break;
                                    }
                                }
                            }
                            searchResultArr.push(searchParsed);
                        }
                        //end media progress


                            var kidsContents = searchResultArr.filter((content) => {
                                return content.kidsContent == true;
                            });

                             // console.log('[Search | getSearchResults | kidsContents |kids ]', kidsContents);

                            this.setSearchResults(kidsContents);
                           if (callback) callback();
                        } else {
                            this.emptyResult = true;
                        }
                    },
                    (error) => {
                        // console.log('[Search | getSearchResults | response | ]', response);
                    }
                )
            },
        closeSearch() {
             // console.log('[Search | closeSearch | searchQuery | ]', this.searchQuery);
              this.valueResult=false;
               this.setSearchResults(undefined);
               this.emptyResult = false;
              this.searchComponent = 'KidsSearchList';
            if (this.searchQuery.length) {
                this.searchQuery = '';
            } else {
                if (document.getElementById("alt-search-input").value.length == 0) {
                 eventBus.$emit('toggleKidsSearchEvent', false);
                this.toggleKidsSearch(false);
                 }
            }
            document.getElementById("alt-search-input").value="";
        },
        showFilterTemplate() {
            // console.log('[Search | showFilterTemplate called | ]');

            //   if (localStorage.getItem('altDefSearches_kid')) {
            //     var altDefSearches_kid = JSON.parse(localStorage.getItem('altDefSearches_kid'));
            // } else {
            //     var altDefSearches_kid = new Array();
            // }
            //     if(document.getElementById("alt-search-input").value.length >  2) {
            //     altDefSearches_kid.push(document.getElementById("alt-search-input").value);
            //  }
            //
            //
            //  if (altDefSearches_kid.length > 0) {
            // localStorage.setItem('altDefSearches_kid', JSON.stringify(this.getUniqueArray(altDefSearches_kid).reverse()));
            //   }
            // this.recentSearches = JSON.parse(localStorage.getItem('altDefSearches_kid'));

               this.saveLocalstorage();

            this.valueResult=true;
            if (this.searchResults && this.searchResults.length) {
                this.searchComponent = 'KidsSearchTemp';
            }
        },
          clearDefRecntSearch() {
            if (localStorage.getItem('altDefSearches_kid')) {
                localStorage.removeItem('altDefSearches_kid');
                this.recentSearches = undefined;
            }
        },
          searchRecentQuery(query) {
             // console.log('[Search | searchRecentQuery | query | ]', query);

            this.setQueryToInput(query);
            this.searchTheQuery(query, () => {
                this.searchComponent = 'KidsSearchTemp';
            });
            this.valueResult=true;
        },
         setQueryToInput(query) {
            // console.log('[Search | setQueryToInput | query | ]', query);

            document.getElementById('alt-search-input').value = query;
        },
    },
    created() {
        this.toggleLoader(false);
          if (!localStorage.getItem('altDefSearches_kid')) {
               this.valueResult=true;
              }
        this.setSearchResults(undefined);
        if (localStorage.getItem('altDefSearches_kid')) {
            this.recentSearches =  this.revObject(JSON.parse(localStorage.getItem('altDefSearches_kid')));
        }
    },
    components: {
        KidsSearchList,
        KidsSearchTemp,
    },
    mixins: [altMixins]
}
</script>
