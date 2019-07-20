<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <h4 class="header-title">SIGN IN</h4>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins'

const HeaderMenu = () => import (/* webpackChunkName: "login-Header-HeaderMenu" */ '../shared/HeaderMenu.vue');

// import HeaderMenu from '../shared/HeaderMenu.vue';

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
        goToSearch() {
            this.$router.push({ name: 'search' });
        }
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
