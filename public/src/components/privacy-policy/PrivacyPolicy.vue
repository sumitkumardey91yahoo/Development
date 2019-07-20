<template>
    <div>
        <div v-if="privacyData" v-html="privacyData"></div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            showCreateKidsPin: false,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'privacyData',
        ])
    },
    watch: {
        appActive() {
            this.initPrivacyPlicy();
        }
    },
    methods: {
        ...mapMutations([
            'setPrivacyData',
        ]),
        ...mapActions([
            'actGetPrivacyData',
        ]),
        setPrivacyHeader() {
            this.setHeaderTitle('PRIVACY POLICY');
            this.toggleSearchIco(false);
            this.toggleCloseIco(false);
            this.toggleDeleteIco(false);
            this.toggleMenuIco(true);
        },
        initPrivacyPlicy() {
            var altConfig = undefined;
            var pwaPrivacyPolicyURL = undefined;
            if (localStorage.getItem('altConfig')) {
                altConfig = JSON.parse(localStorage.getItem('altConfig'));
                pwaPrivacyPolicyURL = altConfig.environment && altConfig.environment.androidPrivacyPolicyURL ? altConfig.environment.androidPrivacyPolicyURL : undefined;
            }
            if (!pwaPrivacyPolicyURL) return;

            this.actGetPrivacyData(pwaPrivacyPolicyURL).then(
                (response) => {
                    // console.log('[Privacy | initPrivacyPlicy | response | ]', response);

                    if (response) {
                        this.setPrivacyData(response);
                        this.toggleLoader(false);
                    }
                },
                (error) => {
                    // console.log('[Privacy | initPrivacyPlicy | error | ]', error);
                }
            )
        }
    },
    created() {
        this.toggleLoader(true);
        this.initPrivacyPlicy();

        eventBus.$on('toggleCreateKidsPinEvent', (state) => {
            this.showCreateKidsPin = state;

            if (!state) {
                this.$router.push({ name: 'home' });
            }
        });
    },
    mounted() {
        this.setPrivacyHeader();
    },
    mixins: [altMixins]
}
</script>
