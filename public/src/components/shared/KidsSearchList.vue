<template>
    <div class="flow-box">
        <ul v-show="searchResults" class="search-wresults">
            <li v-for="(result, index) in searchResults" @click="playSearchItem(index)">{{result.title}}</li>
        </ul>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'searchResults'
        ]),
    },
    methods: {
        ...mapMutations([
            'setKidsPlayerContent',
        ]),
        playSearchItem(index) {
            this.setKidsPlayerContent(this.searchResults[index]);

            var routerObj = {
                name: 'kidsPlayer',
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
            //http://localhost:8080/#/kids-player/episode/1654

            var kidsModeUrl='kids-player/episode/'+this.searchResults[index].contentId;
           // console.log(JSON.stringify(kidsModeUrl));
            //this.$router.push(routerObj);
            this.$router.push(kidsModeUrl);
        },
    },
    mixins: [altMixins]
}
</script>
