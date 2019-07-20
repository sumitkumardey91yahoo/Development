<template>
    <div class="container">
        <player-screen ref="playerScreen"></player-screen>
        <div class="trailer-details">
            <detail-buttons></detail-buttons>
            <!-- <player-details></player-details> -->
            <related-seasons></related-seasons>
        </div>
    </div>
</template>

<script>
import PlayerScreen from './PlayerScreen.vue';

const DetailButtons = () => import(/* webpackChunkName: "player-Player-DetailButtons" */ './DetailButtons.vue');
const PlayerDetails = () => import(/* webpackChunkName: "player-Player-PlayerDetails" */ './PlayerDetails.vue');
const RelatedSeasons = () => import(/* webpackChunkName: "player-Player-RelatedSeasons" */ './RelatedSeasons.vue');

import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { altMixins } from '../../mixins';

export default {
    data() {
        return {
        };
    },
    components: {
        'player-screen': PlayerScreen,
        'detail-buttons': DetailButtons,
        'player-details': PlayerDetails,
        'related-seasons': RelatedSeasons,
    },
}

</script>
