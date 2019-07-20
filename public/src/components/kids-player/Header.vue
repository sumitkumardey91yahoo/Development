<template>
    <div class="app-bar">
        <div class="menu-icon kids-menu-icon" @click="exitKidsMode"></div>
        <!-- <img class="kids-logo-name" src="../../assets/kids_logo.svg"> -->
        <!-- <img class="search kids-search" src="../../assets/lens_dark.svg"> -->
    </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { eventBus } from '../../main';

export default {
    data() {
        return {
            kidsProfile: undefined,
        };
    },
    methods: {
        ...mapMutations([
            'setAltKidsProfile',
        ]),
        ...mapActions([
            'actCheckWithAccount',
        ]),
        exitKidsMode() {
            var altUser = JSON.parse(localStorage.getItem('altKidsUser'));

            this.toggleLoader(true);
            this.actCheckWithAccount(altUser).then(
                (response) => {
                    // console.log('[exitKidsMode | actCheckWithAccount | response | ]', response);

                    this.toggleLoader(false);
                    if (response.count > 1) {
                        this.setAltKidsProfile(response.profiles[0]);
                        // console.log('[exitKidsMode | this | ]', this);
                        // console.log('[exitKidsMode | altKidsProfile | ]', this.altKidsProfile);

                        this.toggleExitPinScreen(true);
                        eventBus.$emit('exitKidsModeEvent', true);
                    }
                },
                (error) => {
                    // console.log('[exitKidsMode | actCheckWithAccount | error | ]', error);
                }
            );
        },
    },
    mixins: [altMixins]
}
</script>
