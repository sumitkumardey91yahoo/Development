<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-clear-dvc popup-container">
            <div class="popup-box">
                <div class="popup-bg">
                    <div class="form-group">
                        <h3>Hey! You've already registered with us.</h3>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn grad-btn btn-lg" @click="closePopup">OK</button>
                    </div>
                </div>
            </div>
            <div class="alt-overlay" @click="closePopup"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';

export default {
    methods: {
        closePopup() {
            eventBus.$emit('closeAlrRegPopupEvent');
        }
    },
}
</script>
