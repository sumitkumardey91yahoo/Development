<template>
    <div class="app-search alt-popup-bg dark-bg">
        <div class="search-input">
            <img src="../../assets/lens.svg" class="header-ico search-input-elem search-ico" alt='lens'>
            <input type="text" id="alt-search-input" placeholder="Search movies, series and videos" class="alt-form-control search-input-elem" v-model="searchQuery"  @keyup="getSearchResults">
            <img src="../../assets/close.svg" class="header-ico search-input-elem" @click="closeSearch" alt='close'>
            <div class="clearfix"></div>
        </div>
        <ul v-show="searchResults" class="search-results">
            <li v-for="(result, index) in searchResults" @click="playSearchItem(index)">{{result.title}}</li>
        </ul>
    </div>
</template>

<script>
import { eventBus } from '../../main'
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            searchQuery: '',
        };
    },
    computed: {
        ...mapGetters([
            'searchResults'
        ]),
    },
    methods: {
        ...mapMutations([
            'setSearchResults',
            'setPlayerContent',
        ]),
        ...mapActions([
            'actSearchQuery',
        ]),
        getSearchResults(event) {
            if (document.getElementById("alt-search-input").value.length > 2) {

                this.actSearchQuery(document.getElementById("alt-search-input").value).then(
                    (response) => {
                        // console.log('[Search | getSearchResults | response | ]', response);
                        // alert("a");
                        if (response && response.count) {
                            var searchResultArr = new Array()
                            for (var i in response.media) {
                                searchResultArr.push(this.parseContents(response.media[i]));
                            }
                            this.setSearchResults(searchResultArr);

                            // console.log('[Search | getSearchResults | searchResults | ]', this.searchResults);
                        }
                    },
                    (error) => {
                        // console.log('[Search | getSearchResults | response | ]', response);
                    }
                )
            } else {
                this.setSearchResults(undefined);
            }
        },
        playSearchItem(index) {
            // console.log('[Search | playSearchItem | item | ]', this.searchResults[index]);

            this.setPlayerContent(this.searchResults[index]);

            var routerObj = {
                name: 'player',
                query: {
                    type: this.searchResults[index].contentType
                }
            };
            if (this.searchResults[index].contentType == 'trailer') {
                routerObj.query.seriesid = this.searchResults[index].contentId;
            } else if (this.searchResults[index].contentType == 'series' || this.searchResults[index].contentType == 'standup') {
                routerObj.query.seriesid = this.searchResults[index].seriesId;
            } else if (this.searchResults[index].contentType == 'movie') {
                routerObj.query.contentid = this.searchResults[index].contentId;
            }

            this.$router.push(routerObj);
        },
        closeSearch() {
            // console.log('[Search | closeSearch | searchQuery | ]', this.searchQuery);

            if (this.searchQuery.length) {
                this.searchQuery = '';
            } else {
                eventBus.$emit('togglePopupSearch', false);
            }
        },
    },
    created() {
        this.setSearchResults(undefined);
    },
    mixins: [altMixins]
}
</script>
