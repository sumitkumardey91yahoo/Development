<template>
    <div v-if="kidsContents" class="container">
        <div class="feat-card" v-for="(item, index) in kidsContents" @click="getDetails(index)">
            <div class="detail">
                <p v-if="item.progress" class="alt-tag">
                    <span v-if="item.progress != 100">watching</span>
                    <span v-else>watched</span>
                </p>
                <h2 v-if="item.title">{{item.title}}</h2>
                <h6 v-if="item.shortDescription">{{item.shortDescription}}</h6>
                <ul>
                    <li v-if="item.seasonNumber">S{{item.seasonNumber}}</li>
                    <li v-if="item.episodeNumber">E{{item.episodeNumber}}</li>
                    <!-- NOTE display show at kids mode -->
                    <li v-if="item.contentName && !item.episodeNumber">{{item.contentName}}</li>
                     <!-- end shows-->
                    <li v-if="item.duration">{{item.duration}}</li>
                    <!-- <li v-if="item.mainCategoryName">{{item.mainCategoryName}}</li> -->
                    <!-- NOTE added by Sumit -->
                    <li v-if="item.mainCategoryName">{{item.mainCategoryName}}</li>
                    <!-- ended by SUMIT -->
                    <li v-if="item.mainLanguage">{{item.mainLanguage}}</li>
                </ul>
            </div>
            <img v-if="item.images.cover" :src="item.images.cover">
            <img v-else src="../../assets/alt-poster.jpg">
            <div v-if="item.progress && item.progress != 100" class="line-progress">
                <div class="progress" :style="{ width: item.progress + '%' }"></div>
            </div>
            <div v-else class="color-line"></div>
        </div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            content: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'kidsContents',
        ]),
    },
    methods: {
        ...mapMutations([
            'setKidsPlayerContent',
        ]),
        ...mapActions([

        ]),
        getDetails(index) {
            // console.log('[Contents | playContents | kidsContents | ]', this.kidsContents);
            // console.log('[Contents | playContents | index | ]', index);

            this.content = this.kidsContents[index];

            // console.log('[Contents | playContents | content | ]', this.content);

            this.setKidsPlayerContent(this.content);

            if (this.content.contentType == 'series') {
                this.$router.push({
                    name: 'kidsDetails',
                    query: {
                        type: this.content.contentType,
                        seriesid: this.content.seriesId
                    }
                });
            } else if (this.content.contentType == 'episode') {
                // NOTE: OLD CODE
                // this.$router.push({
                //     name: 'kidsPlayer',
                //     query: {
                //         type: this.content.contentType,
                //         contentid: this.content.contentId,
                //         seriesid: this.content.seriesId,
                //         seasonid: this.content.seasonId,
                //     }
                // });
                // NOTE: NEW CODE
                // console.log('[Contents | getDetails | contentType | ]', this.content);
                // console.log('[Contents | getDetails | contentType | ]', this.content.contentType);
                // console.log('[Contents | getDetails | mediaId | ]', this.content.mediaId);

                this.$router.push({ name: 'kidsPlayer', params: { type: this.content.contentType, id: this.content.contentId } });
            }
        }
    }
}

</script>
