<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <h4 class="header-title">RESET PASSWORD</h4>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';

const HeaderMenu = () => import (/* webpackChunkName: "reset-password-Header" */ '../shared/HeaderMenu.vue');

// import HeaderMenu from '../shared/HeaderMenu.vue';

export default {
    components: {
        'header-menu': HeaderMenu,
    },
    mixins: [altMixins]
}
</script>
