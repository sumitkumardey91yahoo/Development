<template>
    <div class="alt-popup-bg trans-bg">
        <div class="alt-sharing popup-container">
            <div class="popup-header">
                <img src="../../assets/close.svg" class="kids-pin-close ico-cross" alt="close" @click="closePromptPopup">
            </div>
            <div class="popup-box prompt-box">
                <div class="prompt-box-sec">
                    <h3 style="margin-bottom: 20px;">Looks like you've blocked AltBalaji PWA from playing protected content.</h3>
                    <h4>Goto browser Settings > Site settings > Media > Protected content and enable it.</h4>
                </div>
            </div>
            <div class="popup-btns btns-right">
                <button type="button" class="btn-prompt" @click="closePromptPopup">Ok.Got it!</button>
            </div>
            <div class="alt-overlay"></div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';

export default {
    methods: {
        closePromptPopup() {
            // Set the value to true, for not displaying the popup next time
            localStorage.setItem('promptPcPlayback', JSON.stringify({ value: false }));

            // Close the popup
            eventBus.$emit('toggleEnablePcPrompt', false);
        },
    },
}
</script>
