<template>
    <div>
        <div v-if="tocData" v-html="tocData"></div>
    </div>
</template>

<script>

// import Header from './Header.vue';
// import KidsCreatePin from '../shared/KidsCreatePin.vue';

import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            showCreateKidsPin: false,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'tocData',
        ])
    },
    watch: {
        appActive() {
            this.initToc();
        }
    },
    methods: {
        ...mapMutations([
            'setTocData',
        ]),
        ...mapActions([
            'actGetTocData',
        ]),
        setTocHeader() {
            this.setHeaderTitle('TERMS OF USE');
            this.toggleSearchIco(false);
            this.toggleCloseIco(false);
            this.toggleDeleteIco(false);
            this.toggleMenuIco(true);
        },
        initToc() {

            var altConfig = undefined;
            var pwaTermsOfUseURL = undefined;
            if (localStorage.getItem('altConfig')) {
                altConfig = JSON.parse(localStorage.getItem('altConfig'));
                pwaTermsOfUseURL = altConfig.environment && altConfig.environment.androidTermsOfUseURL ? altConfig.environment.androidTermsOfUseURL : undefined;
            }
            if (!pwaTermsOfUseURL) return;

            this.actGetTocData(pwaTermsOfUseURL).then(
                (response) => {
                    // console.log('[Toc | initToc | response | ]', response);

                    if (response) {
                        this.setTocData(response);
                        this.toggleLoader(false);
                    }
                },
                (error) => {
                    // console.log('[Toc | initToc | error | ]', error);
                }
            )
        }
    },
    created() {
        this.toggleLoader(true);
        this.initToc();

        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;

            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });
    },
    mounted() {
        this.setTocHeader();
    },
    beforeRouteEnter: (to, from, next) => {
        var altProfileMode = localStorage.getItem('altProfileMode');
        if (altProfileMode == 'kids') {
            next({ name: 'kidsMode' })
        } else {
            next();
        }
    },
    mixins: [altMixins]
}
</script>
