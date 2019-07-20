<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <!-- <h4 class="header-title">FAVOURITES</h4> -->
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
            deleteMode: false,
        };
    },
    computed: {
        ...mapGetters([
            'favourites',
            'favouriteDeleteMode',
        ]),
    },
    methods: {
        toggleDeleteMode(state) {
            eventBus.$emit('toggleFavDeleteModeEvent', state);
        },
    },
    components: {
        'header-menu': HeaderMenu,
    },
    created() {
        eventBus.$on('toggleFavDeleteModeEvent', (state) => {
            // console.log('[Favourites | toggleFavDeleteModeEvent | state | ]', state);
            this.deleteMode = state;
        });
    },
    mixins: [altMixins],
}
</script>
