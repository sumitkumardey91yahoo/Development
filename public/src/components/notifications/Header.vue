<template>
    <div class="recent-header">
        <header-menu></header-menu>
        <div class="app-bar">
            <button type="button" id="showMenu" class="menu-bread" @click="toggleNavMenu(true)">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <h4 class="header-title">NOTIFICATIONS</h4>
            <img class="header-ico" src="../../assets/bin.svg" alt='header-ico' v-if="hideBin" @click="toggleDeleteMode(false)" />
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const HeaderMenu = () => import(/* webpackChunkName: "login-Login-HeaderMenu" */ '../shared/HeaderMenu.vue');

// import HeaderMenu from '../shared/HeaderMenu.vue';

export default {
     data() {
        return {
            hideBinButton :true,
        }
     },
    computed: {
        ...mapGetters([
            'hideBin'
        ]),
    },
    methods: {
        ...mapMutations([
        ]),
        toggleDeleteMode(state) {
        eventBus.$emit('togglePopupConfirmNotificationEvent', true);
        // console.log("notification|toggleDeleteMode|delete");
        }
    },
    components: {
        'header-menu': HeaderMenu,
    },
    created() {

    this.hideBinButton=this.hideBin;
    // console.log("data|",this.hideBin);

        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;
            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });

    },
    mixins: [altMixins],
}
</script>
