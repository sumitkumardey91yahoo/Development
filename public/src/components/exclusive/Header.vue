<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const HeaderMenu = () => import (/* webpackChunkName: "favourites-Header-HeaderMenu" */ '../shared/HeaderMenu.vue');

// import HeaderMenu from '../shared/HeaderMenu.vue';

export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters([
        ]),
    },
    methods: {

    },
    components: {
        'header-menu': HeaderMenu,
    },
    created() {
        
    },
    mixins: [altMixins],
}
</script>
