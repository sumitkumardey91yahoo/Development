<template>
    <player-screen ref="playerScreen"></player-screen>
</template>

<script>
import PlayerScreen from './PlayerScreen.vue';

import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';

export default {
    components: {
        'player-screen': PlayerScreen,
    },
    methods: {
        setKidsDefaultHeader() {
            this.setHeaderTitle(false);
            this.toggleDefaultLogo(false);
            this.toggleKidsLogo(true);
        },
    },
    mounted() {
        this.setKidsDefaultHeader();
    },
    mixins: [altMixins]
}

</script>
