<template>
    <div class="alt-help">
        <div class="subs-container margin-data">
            <p  style="font-size: 17px;text-align: left;"> Select/Change preferred regional language </p>

            <label class="regionLanguageHeader">None
                <input type="radio" name="radio"  @click="passlanguage({page_title:'NONE'})" id="NONE">
                <span class="checkmark"></span>
            </label>
            <label class="regionLanguageHeader" v-for="(lang,key) in altConfig.regional">{{lang.name}}
                <input type="radio" name="radio" @click="passlanguage(lang)" :id="lang.page_title">
                <span class="checkmark"></span>
            </label>
        </div>
        <alt-modals></alt-modals>
    </div>
</template>

<script>
const Modals = () => import (/* webpackChunkName: "subscribe-Credit-Modals" */ '../shared/Modals.vue');

// import Header from './Header.vue'
// import Modals from '../shared/Modals.vue';

import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
        altConfig : undefined,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'domain',
        ]),
    },
    watch: {
        appActive() {

        }
    },
    methods: {
        ...mapMutations([
        ]),
        ...mapActions([
        ]),
        setSubscribePageHeader() {
            this.setHeaderTitle('Regional language');
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        },
        passlanguage(language) {
            // console.log("language",language);
            localStorage.setItem("Regional-language",JSON.stringify(language));
        }

    },
    components: {
        'alt-modals': Modals,
    },
    created() {
        if(localStorage.getItem('altConfig')) {
            this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    mounted() {
        if (localStorage.getItem("Regional-language")) {
            var language = JSON.parse(localStorage.getItem("Regional-language")).page_title;
            if(document.getElementById(language)) {
                document.getElementById(language).checked = true;
            }
        }
        this.setSubscribePageHeader();
    },
    mixins: [altMixins]
}
</script>
