<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="openNavMenu">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <img class="header-logo" src="../../assets/logo.svg" />
            <img class="header-ico" src="../../assets/lens.svg" @click="openSearch"/>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins'

const HeaderMenu = () => import(/** webpackChunkName: "Player-HeaderMenu" **/ '../shared/HeaderMenu.vue');

export default {
    computed: {
        ...mapGetters([
            'recentDeleteMode',
        ]),
    },
    methods: {
        ...mapMutations([
            'setRecentDeleteMode'
        ]),
        openNavMenu() {
            this.toggleNavMenu(true);
            eventBus.$emit('toggleNavOpenEvent');
        },
        openSearch() {
            // console.log('[Header | openSearch | ]');

            eventBus.$emit('togglePopupSearch', true);
        },
    },
    components: {
        'header-menu': HeaderMenu,
    },
    created() {
        this.setRecentDeleteMode(false);
    },
    mixins: [altMixins],
}
</script>
