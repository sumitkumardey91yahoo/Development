<template>
    <div class="alt-main">
        <h4 class="topic">Please Choose a help topic</h4>
        <div v-if="helpCategories">
            <div v-for="category in helpCategories" :key="category.category.id" @click="getFaqResults(category.category)">
                <img class="common-img" :src="helpCategoryImages[category.category.name]">
                <div class="comm-text">{{category.category.name}}</div>
            </div>
        </div>
        <div class="topic copy-right" v-if="altMessages">
            {{altMessages.helpScreenMessage}}
        </div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

const Header = () => import (/* webpackChunkName: "help-Main-Header" */ './Header.vue');
const Modals = () => import (/* webpackChunkName: "help-Main-Modals" */ '../shared/Modals.vue');

// import Header from './Header.vue';
// import Modals from '../shared/Modals.vue';

export default {
    data() {
        return {
            helpCategoryImages: {
                'Common': '/src/assets/common.svg',
                'Account & Settings': '/src/assets/account.svg',
                'Troubleshooting': '/src/assets/trouble.svg',
                'Subscription': '/src/assets/subs.svg',
            }
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'helpCategories',
            'altMessages',
        ]),
    },
    watch: {
        appActive() {
            this.initHelp();
        }
    },
    methods: {
        ...mapMutations([
            'setHelpCategories',
            'setActiveHelpCategory',
        ]),
        ...mapActions([
            'actGetHelpCategories',
        ]),
        initHelp() {
            this.actGetHelpCategories().then((response) => {
                // console.log('[Help | initHelp | response | ]', response);

                if (response && response.length) {
                    var categories = response.filter((category) => {
                        return category.category.is_default == false;
                    });

                    // console.log('[Help | initHelp | categories | ]', categories);

                    if (categories && categories.length) {
                        localStorage.setItem('altHelpCategories', JSON.stringify(categories));
                    }

                    this.setHelpCategories(categories);
                    this.toggleLoader(false);

                    // console.log('[Help | initHelp | helpCategories | ]', this.helpCategories);
                }
            }, (error) => {
                // console.log('[Help | initHelp | error | ]', error);
                if (error.statusText) {
                    this.toggleAltPopup(true, error.statusText)
                    this.toggleLoader(false);
                } else {
                    this.toggleAltPopup(true, 'Oops! Something wrong happened.');
                    this.toggleLoader(false);
                }
            });
        },
        categoyQueryName(categoryName) {
            switch (categoryName) {
                case 'Common':
                    return 'common';
                    break;
                case 'Account & Settings':
                    return 'account';
                    break;
                case 'Troubleshooting':
                    return 'troubleshooting';
                    break;
                case 'Subscription':
                    return 'subscription';
                    break;
                default:
                    return 'help';
            }
        },
        getFaqResults(category) {
            // console.log('[Help | Main | getFaqResults | category | ]', category);

            this.$router.push({ name: 'helpFaqs', params: { id: category.id } });

            // NOTE: Code commented by sangeeth (27-oct-17)
            // this.setActiveHelpCategory(category);
            // this.$router.push({
            //     name: 'helpFaqs',
            //     query: {
            //         category: this.categoyQueryName(category.name)
            //     }
            // });
            // NOTE: Code commented by sangeeth (27-oct-17) ends
        },
        stuffCommonAttributes() {
            var localAttributeObj = {}
            var geo_location = localStorage.getItem('geo_location');
            var altConfig = JSON.parse(localStorage.getItem('altConfig'));

            if (geo_location) {
                geo_location = JSON.parse(geo_location);
                localAttributeObj = geo_location;
            }
            localAttributeObj.user_email = localStorage.getItem('user_email');
            localAttributeObj.user_id = localStorage.getItem('account_id');
            localAttributeObj.user_session = localStorage.getItem('token');
            localAttributeObj.user_name = localStorage.getItem('user_name');
            localAttributeObj.user_dob = localStorage.getItem('user_birthday');
            localAttributeObj.user_gender = localStorage.getItem('user_gender');
            localAttributeObj.app_env = altConfig.environment.title;

            return localAttributeObj;
        },
        stuffMenuSelectAttributes( sectionTitle, sectionId) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            eventAttributeObj.page_title = sectionTitle;
            eventAttributeObj.section_id = sectionId.toString();

            return eventAttributeObj;
        },
        stuffPageViewAttributes( pageTitle, pageUrl) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            eventAttributeObj.page_title = pageTitle;
            eventAttributeObj.page_url = pageUrl;

            return eventAttributeObj;
        },
    },
    created() {
        var pageTitle = "Help";

        // AWS Mobile SDK Events
      if (window.mobileAnalyticsClient) {
        //     var menuSelectAttributes = this.getAWSMACommonAttributes();
        //     menuSelectAttributes.page_title = pageTitle;
        //     menuSelectAttributes.section_id = 'N.A';
        //     window.mobileAnalyticsClient.recordEvent('_menu.select', menuSelectAttributes, {});
        //
        //     // NOTE: Code commented for AWSMA redefinition
        //     // window.mobileAnalyticsClient.recordEvent('_menu.select', this.stuffMenuSelectAttributes(pageTitle, "N.A."), {});
        //
        //     var pageSelectAttributes = this.getAWSMACommonAttributes();
        //     pageSelectAttributes.page_title = pageTitle;
        //     pageSelectAttributes.page_url = window.location.href;
        //     window.mobileAnalyticsClient.recordEvent('_page.view', pageSelectAttributes, {});

            // NOTE: Code commented for AWSMA redefinition
            // window.mobileAnalyticsClient.recordEvent('_page.view', this.stuffPageViewAttributes(pageTitle, window.location.href), {});
        }
        // End of AWS Mobile SDK Events


        if (this.appActive) {
            this.toggleLoader(true);
            this.initHelp();
        }
    },
    components: {
        'help-header': Header,
        'alt-modals': Modals,
    },
    mixins: [altMixins]
}
</script>
