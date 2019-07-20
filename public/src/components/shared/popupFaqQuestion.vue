<template>
    <div class="kids-create-pin-screen alt-popup-bg dark-bg popup_question_help" id="kids-create-pin-screen">
        <div class="pin-screen-header">
            <img src="../../assets/close.svg" class="kids-pin-close" alt="close" @click="closeScreen">
            <div class="clearfix"></div>
        </div>
        <div class="container">
            <p style="font-size:17px">Please select your query type</p>
            <ul>
                <li v-for="query in faqSelectedSection" class="listQuestion" @click=list(query)>{{query.title}} <span v-if="FaqData && FaqData.title && query.title == FaqData.title"><img src="../../assets/Green_check.svg" style=" width: 17px;float: right;"/></span></li>
            </ul>
        </div>
    </div>
</template>
<script>
// import CryptoJS from 'crypto-js';
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            regionLanguage:undefined,
            altConfig:undefined,
            helpFaqPageTitleText:undefined,
            faq_category_query:'',
        };
    },
    computed: {
        ...mapGetters([
            'FaqData',
            'faqSelectedSection'
        ])
    },
    methods: {
        ...mapMutations([
            'setFaqData',
            'setFaqSelectedSection'
        ]),
        ...mapActions([
            'actGetQuestionTitle',
        ]),
        list(data) {

            // console.log(" descriptionData[0].description", data);

            eventBus.$emit("makeDisableform",true);
            this.setFaqData(data);
            eventBus.$emit('toggleFaqQuestion', false);

            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        goForDone() {
          // console.log(this.regionLanguage);
         eventBus.$emit('toggleFaqQuestion', false);
         if(document.getElementById('alt-app')) {
             document.getElementById('alt-app').style.position = "relative";
         }
        },
        closeScreen() {
            eventBus.$emit('toggleFaqQuestion', false);
            if(document.getElementById('alt-app')) {
                document.getElementById('alt-app').style.position = "relative";
            }
        },
        getQuestionTitle() {
          // console.log(localStorage.getItem("helpFaqPageTitle"),this.faq_category_query);
            this.actGetQuestionTitle().then((response) => {
                if(response) {
                    let faq_category = response.faq_category_query;

                    let query;
                    for(query in faq_category) {
                        if(this.helpFaqPageTitleText == faq_category[query].category_name) {
                            this.faq_category_query = faq_category[query].query_list;
                            this.setFaqSelectedSection(this.faq_category_query);
                            break;
                        }
                    }
                    // console.log("this.faq_category_query",this.faq_category_query);

                }

            }, (error) => {
                // console.log(error);
            });
        },
    },
    created() {
        if(localStorage.getItem('altConfig')) {
            this.altConfig = JSON.parse(localStorage.getItem('altConfig'));
        }

    },
    mounted() {
        this.helpFaqPageTitleText = localStorage.getItem("helpFaqPageTitle") ? localStorage.getItem("helpFaqPageTitle") : '';
        document.getElementById("listOfQuery").style.height = window.innerHeight - 160 +"px";
        window.addEventListener("orientationchange", function() {
            if(window.screen.orientation.type == "portrait-primary") {
                if(window.innerHeight < window.innerWidth)
                document.getElementById("listOfQuery").style.height = window.innerWidth - 160 +"px";
            } else {
                if(window.innerHeight > window.innerWidth)
                document.getElementById("listOfQuery").style.height = window.innerWidth - 160 +"px";
            }
        // console.log("listOfQuery",window.innerHeight );
        }, false);
        this.getQuestionTitle();
    },
    mixins: [altMixins]
}
</script>
