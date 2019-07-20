<template>
    <div v-if="playerContent">
        <h3 class="pldt-sr-title" v-show="playerContent.seriesTitle">{{playerContent.seriesTitle}}</h3>
        <h3 class="trailer-name" v-if="playerContent.title">{{playerContent.title}}</h3>
        <ul class="info-tags">
            <li v-show="playerContent.seasonNumber && !playerContent.noShow">S{{playerContent.seasonNumber}}</li>
            <li v-show="playerContent.episodeNumber && !playerContent.noShow">E{{playerContent.episodeNumber}}</li>
            <!-- If the content type is show, then hide the element -->
            <li v-if="playerContent.contentTitle && playerContent.contentTitle != 'Show'">{{playerContent.contentTitle}}</li>
            <!-- <li v-if="playerContent.duration && !playerContent.noShow">{{playerContent.duration}}</li> -->
               <!-- added by sumit comedy section duration not coming-->
            <li v-if="playerContent.duration">{{playerContent.duration}}</li>
            <li v-if="playerContent.contentTitle == 'Poster'">0s</li>
            <li v-if="playerContent.categories && playerContent.categories.length">{{playerContent.categories.join(', ')}}</li>
            <li v-if="playerContent.mainLanguage">{{playerContent.mainLanguage}}</li>
        </ul><br/>
         <!-- NOTE added by sumit for poster image 0s && hide year -->
        <h6 class="series-episode" v-if="playerContent.releaseYear && playerContent.contentTitle != 'Poster'">Year of release : <span class="description-media">{{playerContent.releaseYear}}</span></h6>
           <!-- NOTE sumit change the location of also available the app wise 18.01.2018 -->
        <h6 class="series-episode" v-if="playerContent.langListArr && playerContent.langListArr.length">
            Also available in :
            <span class="description-media">{{playerContent.langListArr | fltr_JoinArrToCapital}}</span>
        </h6>
        <h6 class="series-episode" v-if="playerContent.categoryNames">{{(playerContent.categoryNames).join(', ')}} | {{playerContent.mainLanguage}}</h6>
        <h6 class="series-episode" v-if="playerContent.cast">Actors : <span class="description-media">{{playerContent.cast.join(', ')}}</span></h6>
        <h6 class="series-episode" v-if="playerContent.director && playerContent.director.length">Director : <span class="description-media">{{playerContent.director.join(', ')}}</span></h6><br/>

         <!-- NOTE added by sumit for extra blank line remove && commented old code 16.01 Issue #121(ALT team) -->
        <!-- <p v-if="playerContent.longDescription" v-for="(longDesc, index) in playerContent.longDescription">{{longDesc}}</p> -->

        <div v-if="playerContent.longDescription" v-for="(longDesc, index) in playerContent.longDescription">
            <h6 v-if="longDesc.length > 1" class="description-media">{{longDesc}}</h6>
            <h6 v-else><br/></h6>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters([
            'playerContent'
        ]),
    },
}
</script>
