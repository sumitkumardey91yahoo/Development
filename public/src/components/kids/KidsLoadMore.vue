<template>
    <div class="button-space text-center">
        <button type="button" class="btn grad-btn btn-sm" @click.stop="loadMoreKidsContents" v-show="showLoadMoreButtton">SEE MORE</button>
    </div>
</template>

<script>
import { eventBus } from '../../main'
import { altMixins } from '../../mixins'

export default {
    data() {
        return {
            showLoadMoreButtton: false,
        };
    },
    methods: {
        loadMoreKidsContents() {
            this.toggleLoader(true);
            eventBus.$emit('loadMoreKidsContentsEvent');
        },
        toggleLoadMoreBtnCB(state) {
            // console.log('[KidsLoadMore | toggleLoadMoreBtnCB | state | ]', state);
            this.showLoadMoreButtton = state;
        },
    },
    created() {
        eventBus.$on('toggleLoadMoreBtn', this.toggleLoadMoreBtnCB);
    },
    mixins: [altMixins]
}
</script>
