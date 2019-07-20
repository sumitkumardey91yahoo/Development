<template>
    <div class="alt-snackbar" id="alt-snackbar">{{snackbarText}}</div>
</template>

<script>
import { eventBus } from '../../main'

export default {
    data() {
        return {
            snackbarText: '',
        }
    },
    methods: {
        toggleSnackbarEventCB(text) {
            // console.log('[Snackbar | toggleSnackbarEventCB | ]', stateObj);

            var x = document.getElementById("alt-snackbar");
            x.className = "show";
            this.snackbarText = text ? text : '';
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        }
    },
    created() {
        eventBus.$on('toggleSnackbarEvent', this.toggleSnackbarEventCB);
    },
    beforeDestroy() {
        eventBus.$off('toggleSnackbarEvent');
    },
}
</script>
