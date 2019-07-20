<template>
    <div class="activate-password">
        <div class="alt-form-header">
            <h2>NEW PASSWORD</h2>
        </div>

        <form autocomplete="off">
            <div class="form-group">
                <input type="password" placeholder="New Password" class="form-control" v-model="password" @input="validatePassword">
                <p v-show="passwordError">{{passwordError}}</p>
            </div>
            <div class="form-group">
                <input type="password" placeholder="Confirm New Password" class="form-control" v-model="confirmPassword" @input="validateConfirmPassword">
                <p v-show="confirmPasswordError">{{confirmPasswordError}}</p>
            </div>
            <input type="submit" v-if="altMessages" :value="altMessages.buttonSetNewPassword" class="grad-btn submit-btn btn" @click.prevent="changePassword">
        </form>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            token: undefined,
            password: undefined,
            confirmPassword: undefined,
            passwordError: false,
            confirmPasswordError: false,
        };
    },
    computed: {
        ...mapGetters([
            'altMessages',
        ]),
    },
    methods: {
        ...mapActions([
            'actUpdatePassword',
        ]),
        changePassword() {
            // console.log('[Password | changePassword | ]');

            if (!this.isFormValid()) return;

            this.token = this.$route.params.token;

            this.actUpdatePassword({
                new_password: this.password,
                token: this.token
            }).then((response) => {
                // console.log('[Password | changePassword | response ]', response);

                if (response.status && response.status == 'ok') {
                    eventBus.$emit('toggleActivatePwdRstSucsPopup', true);
                }
            }).catch((error) => {
                // console.log('[Password | changePassword | error ]', error);

            });
        },
        isFormValid() {
            if (this.validatePassword() && this.validateConfirmPassword()) {
                return true;
            }
            return false;
        },
        validatePassword() {
            if (!(this.password)) {
                this.passwordError = 'Password required';
                return false;
            } else if (this.password.length < 8) {
                this.passwordError = 'Password must contain altleast 8 characters';
                return false;
            } else {
                this.passwordError = false;
                return true;
            }
        },
        validateConfirmPassword() {
            if (this.password != this.confirmPassword) {
                this.confirmPasswordError = 'Passwords not matching';
                return false;
            } else {
                this.confirmPasswordError = false;
                return true;
            }
        },

    },
    created() {
        // Once the component is created, hide the loader
        this.toggleLoader(false);
    },
    mixins: [altMixins]
}
</script>
