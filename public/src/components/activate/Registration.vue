<template>
    <div class="activate-registration">
        <div class="reg-verify">
            <h3>{{verifyMessage}}</h3>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            verifyMessage: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'altMessages',
        ]),
    },
    methods: {
        ...mapActions([
            'actVerifyEmail',
        ]),
        verifyEmail() {
            // console.log('[Password | changePassword | ]');

            this.token = this.$route.params.token;

            this.actVerifyEmail({
                token: this.token
            }).then((response) => {
                // console.log('[Password | changePassword | response ]', response);

                if (response.status && response.status == 'ok') {
                    this.verifyMessage = this.altMessages.emailVerifiedSuccessfully;
                    this.toggleLoader(false);
                }
            }).catch((error) => {
                // console.log('[Password | changePassword | error ]', error);

                if (error.code == 409) {
                    this.verifyMessage = error.message;
                    this.toggleLoader(false);
                }
            });
        },
    },
    created() {
        this.verifyEmail();
    },
    mixins: [altMixins]
}
</script>
