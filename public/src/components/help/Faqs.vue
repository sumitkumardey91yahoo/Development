<template>
    <div>
        <div class="alt-help container">
            <h4 class="page-header">{{helpFaqPageTitle}}</h4>
            <div class="faq-articles" v-if="faqArticles">
                <div class="acc-container" v-for="article in faqArticles">
                    <h4 class="acc-btn" @click="openArtcle">{{article.title}}</h4>
                    <div class="acc-page">
                        <p v-html="article.description"></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="snd-qstn" v-show="showSendUsBtn">
            <router-link :to="{ name: 'sendQuestion' }" tag="button" class="btn btn-grad btn-lg">SEND US A QUESTION</router-link>
        </div>
    </div>
</template>

<script>
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            altUser: undefined,
            categoryName: undefined,
            showSendUsBtn: false,


            categoryId: undefined,
            categories: undefined,
            activeCategory: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'helpCategories',
            'helpFaqPageTitle',
            'activeHelpCategory',
            'faqArticles',
        ]),
    },
    watch: {
        appActive() {
            this.initHelpFaqs();
        },
    },
    methods: {
        ...mapMutations([
            'setHelpFaqPageTitle',
            'setFaqArticles',
            'setHelpCategories',
        ]),
        ...mapActions([
            'actGetFaqResults',
            'actGetHelpCategories',
        ]),
        initHelpFaqs() {
            // console.log('[Faqs | initHelpFaqs | ]');

            this.categoryId = this.$route.params.id;

            // console.log('[Faqs | initHelpFaqs | categoryId | ]', this.categoryId);

            if (localStorage.getItem('altHelpCategories')) {
                this.categories = JSON.parse(localStorage.getItem('altHelpCategories'));
            }

            // console.log('[Faqs | initHelpFaqs | categories | ]', this.categories);

            var activeCategories = this.categories.filter((category) => {
                return category.category && category.category.id == this.categoryId;
            });

            if (activeCategories && activeCategories.length) {
                this.activeCategory = activeCategories[0];
            }

            // console.log('[Faqs | initHelpFaqs | activeCategory | ]', this.activeCategory);

            if (!this.activeCategory) return;

            localStorage.setItem("helpFaqPageTitle",this.activeCategory.category.name);

            switch (this.activeCategory.category.name) {
                case 'Common':
                    this.setHelpFaqPageTitle('COMMON FAQS');
                    break;
                case 'Account & Settings':
                    this.setHelpFaqPageTitle('ACCOUNT & SETTINGS FAQS');
                    break;
                case 'Troubleshooting':
                    this.setHelpFaqPageTitle('TROUBLESHOOTING FAQS');
                    break;
                case 'Subscription':
                    this.setHelpFaqPageTitle('SUBSCRIPTION FAQS');
                    break;
                default:
                    this.setHelpFaqPageTitle('FAQS');
            }

            if (this.activeCategory.category && this.activeCategory.category.folders && this.activeCategory.category.folders.length) {
                var faqArticles = new Array();

                for (var i in this.activeCategory.category.folders) {
                    var folder = this.activeCategory.category.folders[i];

                    this.actGetFaqResults({ categoryId: folder.category_id, folderId: folder.id}).then((response) => {
                        // console.log('[Faqs | initHelpCommon | actGetFaqResults | response | ]', response);

                        if (response.folder && response.folder.articles && response.folder.articles.length) {
                            for (var j in response.folder.articles) {
                                faqArticles.push(response.folder.articles[j]);
                            }
                        }

                        // console.log('[Faqs | initHelpCommon | faqArticles ]', faqArticles);

                        this.setFaqArticles(faqArticles);
                        this.toggleLoader(false);
                    }, (error) => {
                        // console.log('[Faqs | initHelpCommon | actGetFaqResults | error ]', error);
                    });
                }
            }

            // console.log('[Faqs | initHelpFaqs | activeCategory name | ]', this.activeCategory.category.name);
            // console.log('[Faqs | initHelpFaqs | categoryId | ]', this.categoryId);

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.faq_id = this.categoryId ? this.categoryId : 'N.A';
                eventAttributeObj.faq_category = (this.activeCategory && this.activeCategory.category && this.activeCategory.category.name) ? this.activeCategory.category.name : 'N.A';
                window.mobileAnalyticsClient.recordEvent('_support.faq', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events
        },
        initHelpCommon() {
            this.categoryName = this.$route.query.category;

            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
                var eventAttributeObj = this.getAWSMACommonAttributes();
                eventAttributeObj.faq_id = '0';
                eventAttributeObj.faq_category = this.categoryName;
                window.mobileAnalyticsClient.recordEvent('_support.faq', eventAttributeObj, {});

                // window.mobileAnalyticsClient.recordEvent('_support.faq', this.stuffSupportFaqAttributes(0, this.categoryName), {});
            }
            // End of AWS Mobile SDK Events

            switch (this.categoryName) {
                case 'common':
                    this.setHelpFaqPageTitle('COMMON FAQS');
                    break;
                case 'account':
                    this.setHelpFaqPageTitle('ACCOUNT & SETTINGS FAQS');
                    break;
                case 'troubleshooting':
                    this.setHelpFaqPageTitle('TROUBLESHOOTING FAQS');
                    break;
                case 'subscription':
                    this.setHelpFaqPageTitle('SUBSCRIPTION FAQS');
                    break;
                default:
                    this.setHelpFaqPageTitle('FAQS');
            }

            // console.log('[Faqs | initHelpCommon | activeHelpCategory | ]', this.activeHelpCategory);

            if (this.activeHelpCategory.folders && this.activeHelpCategory.folders.length) {
                var faqArticles = new Array();

                for (var i in this.activeHelpCategory.folders) {
                    var folder = this.activeHelpCategory.folders[i];
                    this.actGetFaqResults({ categoryId: folder.category_id, folderId: folder.id}).then(
                        (response) => {
                            // console.log('[Faqs | initHelpCommon | actGetFaqResults | response | ]', response);

                            if (response.folder && response.folder.articles && response.folder.articles.length) {
                                for (var j in response.folder.articles) {
                                    faqArticles.push(response.folder.articles[j]);
                                }
                            }

                            // console.log('[Faqs | initHelpCommon | faqArticles ]', faqArticles);

                            this.setFaqArticles(faqArticles);
                            this.toggleLoader(false);
                        },
                        (error) => {
                            // console.log('[Faqs | initHelpCommon | actGetFaqResults | error ]', error);
                        }
                    );
                }
            }
        },
        getHelpCategories() {
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
                    // this.toggleLoader(false);

                    this.initHelpCommon();

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
        stuffSupportFaqAttributes(faqId, faqCategory) {
            var eventAttributeObj = {}
            eventAttributeObj = this.stuffCommonAttributes();

            eventAttributeObj.faq_id = faqId.toString();
            eventAttributeObj.faq_category = faqCategory;

            return eventAttributeObj;
        },
        openArtcle(event) {
            var accPage = document.getElementsByClassName('acc-page');

            let classOpen = event.target.nextSibling.nextSibling.classList && event.target.nextSibling.nextSibling.classList[1] ? event.target.nextSibling.nextSibling.classList[1] : undefined;
            // console.log("event",classOpen);

            for(var i = 0; i < accPage.length; i++){
                accPage[i].setAttribute("class", "acc-page");
            }
            if(classOpen && classOpen == 'open') {
                event.target.nextSibling.nextSibling.classList.remove('open');
                return;
            }
            
            event.target.nextSibling.nextSibling.classList.add('open');


            // var acc = document.getElementsByClassName("acc-page");
            // var i;
            // for (i = 0; i < acc.length; i++) {
            //         acc[i].setAttribute("class", "acc-page");
            //     }
            //         var panel = event.target.nextSibling.nextSibling;
            //         if (panel.style.display === "block") {
            //             panel.style.display = "none";
            //         } else {
            //             panel.style.display = "block";
            //         }
        },
    },
    created() {
        // console.log('[Faqs | created | ]');
        // console.log('[Faqs | created | helpCategories ]', this.helpCategories);

        this.toggleLoader(true);

        if (localStorage.getItem('altUser')) {
            this.altUser = JSON.parse(localStorage.getItem('altUser'));
            this.showSendUsBtn = true;
        }

        this.initHelpFaqs();
    },
    mixins: [altMixins]
}
</script>
