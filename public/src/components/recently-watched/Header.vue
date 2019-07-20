<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <h4 class="header-title">RECENTLY WATCHED</h4>
            <img class="header-ico" src="../../assets/close.svg" v-show="recentlyWatched && recentlyWatched.length && deleteMode" @click="toggleDeleteMode(false)" />
            <img class="header-ico" src="../../assets/bin.svg" v-show="recentlyWatched && recentlyWatched.length && !deleteMode" @click="toggleDeleteMode(true)" />
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { eventBus } from '../../main';
import { altMixins } from '../../mixins'

const HeaderMenu = () => import(/* webpackChunkName: "recently-watched-Header-HeaderMenu" */ '../shared/HeaderMenu.vue');

// import HeaderMenu from '../shared/HeaderMenu.vue';

export default {
    data() {
        return {
            deleteMode: false,
        };
    },
    computed: {
        ...mapGetters([
            'recentlyWatched',
        ]),
    },
    methods: {
        toggleDeleteMode(state) {
            eventBus.$emit('toggleRecentDeleteModeEvent', state);
        }
    },
    components: {
        'header-menu': HeaderMenu,
    },
    created() {
        eventBus.$on('toggleRecentDeleteModeEvent', (state) => {
            // console.log('[Favourites | toggleFavDeleteModeEvent | state | ]', state);
            this.deleteMode = state;
        });
    },
    mixins: [altMixins],
}
</script>
