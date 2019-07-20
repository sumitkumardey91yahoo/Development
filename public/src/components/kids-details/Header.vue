
<template>
    <div class="app-bar">
        <div class="menu-icon kids-menu-icon" @click="exitKidsMode"></div>
        <div class="display_flex">
            <h4 class="kids-page-title" v-if="pageTitle">{{pageTitle}}</h4>
            <!-- <img class="kids-logo-name" src="../../assets/kids_logo.svg" v-else>
            <img class="search kids-search" src="../../assets/lens-dark.svg" @click="showKidsSearch"> -->
        </div>
    </div>
</template>
<script>
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            kidsProfile: undefined,
            pageTitle: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'altKidsProfile',
            'kidsPlayerContent',
        ]),
    },
    watch: {
        kidsPlayerContent(content) {
            // console.log('[Header | kidsPlayerContent | ]', content);

            if (content) {
                this.pageTitle = content.title;
            }
        }
    },
    methods: {
        ...mapMutations([
            'setAltKidsProfile',
            'setSearchResults',
        ]),
        ...mapActions([
            'actCheckWithAccount',
        ]),
        showKidsSearch() {
            this.setSearchResults(undefined);
            this.toggleKidsSearch(true);
        },
        exitKidsMode() {
            var altUser = JSON.parse(localStorage.getItem('altKidsUser'));

            this.toggleLoader(true);
            this.actCheckWithAccount(altUser).then(
                (response) => {
                    // console.log('[exitKidsMode | actCheckWithAccount | response | ]', response);

                    this.toggleLoader(false);
                    if (response.count > 1) {
                        this.setAltKidsProfile(response.profiles[0]);
                        // console.log('[exitKidsMode | this | ]', this);
                        // console.log('[exitKidsMode | altKidsProfile | ]', this.altKidsProfile);

                        this.toggleExitPinScreen(true);
                    }
                },
                (error) => {
                    // console.log('[Header | exitKidsMode | actCheckWithAccount | error | ]', error);
                }
            );
        },
    },
    created() {
        // console.log('[Header | created ]');
        // console.log('[Header | created | kidsPlayerContent ]', this.kidsPlayerContent);

        if (this.appActive && this.kidsPlayerContent) {
            this.pageTitle = this.kidsPlayerContent.title;
        }
    },
    mixins: [altMixins]
}
</script>
