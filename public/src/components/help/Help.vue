<template>
    <div class="alt-help">
        <router-view></router-view>
        <popup-help-write-question v-show="showPopupHelpWriteQuestion"></popup-help-write-question>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';

const PopupHelpWriteQuestion = () => import (/* webpackChunkName: "PopupHelpWriteQuestion" */ '../shared/PopupHelpWriteQuestion.vue');

export default {
    data() {
        return {
            showPopupHelpWriteQuestion: false,
        }
    },
    methods: {
        setHelpPageHeader() {
            this.setHeaderTitle('Help');

            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        },
        togglePopupHelpWriteQuestionCB(state) {
            this.showPopupHelpWriteQuestion = state;
        },
    },
    components: {
        'popup-help-write-question': PopupHelpWriteQuestion,
    },
    created() {
        eventBus.$on('togglePopupHelpWriteQuestion', this.togglePopupHelpWriteQuestionCB);
    },
    mounted() {
        this.setHelpPageHeader();
    },
    mixins: [altMixins]
}
</script>
