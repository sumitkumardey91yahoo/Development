<template>
    <div class="alt-exclusive">
        <router-view></router-view>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';

export default {
    methods: {
        setExclusiveHeader() {
            this.setHeaderTitle(false);
            this.toggleSearchIco(false);
            this.toggleDeleteIco(false);
            this.toggleCloseIco(false);
        }
    },
    mounted() {
        this.setExclusiveHeader();
    },
    mixins: [altMixins]
}
</script>
