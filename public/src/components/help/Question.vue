<template>
    <div class="alt-help container faq_container" >
        <h4 class="page-header-faq" id="headerPart">Send us a Question</h4>
        <form enctype="multipart/form-data" name="formFaq" id="formFaq">
            <p @click="popupFaq" v-if="FaqData && FaqData.title" class="faq_title">{{FaqData.title}}</p>

            <textarea v-model="question" name="subject" id="questionTitle" @keyup="letterCount" @keydown="letterCount" class="form-control text-qst-faq" placeholder="Write a question" maxlength="600"> </textarea>

            <ul id="fileListData">
                <li v-for="(file,index) in fileData" v-if="fileData" style="padding: 3px 0 15px;">{{fileData[index].name}}<img src="../../assets/Red-Cross-Mark-PNG.png" style ="width: 18px;
    float: right;" @click="deleteRow(index)"/></li>
            </ul>


            <div style="margin-bottom: 71px;">
                <div style="float: left;">
                    <label for="attachmentsFaq"  class="faq-file">
                        <img src="../../assets/attach-256.png" style="width:23px"/>
                        <span style="margin-left: 7px;padding-top: 3px;position: absolute;">Attach screenshot</span>

                        <input  type="file"  multiple="" id="attachmentsFaq" accept=".doc, .docx, .pdf, .pages, .png, .jpg, .jpeg" @change="storeFileDetails"  style="display:none;">
                    </label>
                </div>

                <div style="float: right; margin-top: 20px;">
                    <span id="countNumber">0</span> / <span> 600</span>
                </div>
            </div>

            <p v-if="FaqData && FaqData.description">{{FaqData.description}}</p>
            <div class="" v-show="showButton">
                <button type="button" class="btn btn-grad btn-lg" id="submitFaq" @click="submitQuestion">SUBMIT</button>
            </div>


        </form>
        <div class="ticket-message" v-show="!showButton">
            <h3>Thank you for your question. We will get back to you soon.</h3>
            <button type="button" class="btn btn-grad btn-lg" @click="backButton" style="margin-top: 25px;">BACK</button>
        </div>
    </div>
</template>
<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins'
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            question: '',
            showButton: true,
            helpFaqPageTitleText:'',
            faq_category_query:'',
            selectedQueryText:'',
            description:'',
            fileData:[],
        };
    },
    computed: {
        ...mapGetters([
            'helpFaqPageTitle',
            'FaqData',
            'appVersionName',
            'appVersionCode',
            'altMessages',
        ]),
    },
    created() {



        eventBus.$on('makeDisableform', (state) => {
            if(state) {
                document.getElementById("attachmentsFaq").disabled = false;
                document.getElementById("questionTitle").disabled = false;
                document.getElementById("submitFaq").disabled = false;
            }
        });
    },
    mounted() {
        this.helpFaqPageTitleText = localStorage.getItem("helpFaqPageTitle") ? localStorage.getItem("helpFaqPageTitle") : '';
        // console.log(localStorage.getItem("helpFaqPageTitle"));

        var fileChooser = document.getElementById('attachmentsFaq');
        if(fileChooser) {
            fileChooser.onclick = function () {
                // console.log("test");
                this.value = '';
            };
        }

        if(!localStorage.getItem("altUser")) {
            this.$router.push({ name: 'home' });
        }

        this.getQuestionTitle();
        this.setFaqData({"title":"Tap to select a query type","subject":""});
        document.getElementById("attachmentsFaq").disabled = true;
        document.getElementById("questionTitle").disabled = true;
    },
    methods: {
        ...mapActions([
            'actSendTicket',
            'actGetQuestionTitle',
            'actSendTicketNew'
        ]),
        ...mapMutations([
            'setFaqData',
            'setFaqMessage',
            'setFaqSelectedSection'
        ]),
        letterCount() {
            if( document.getElementById("questionTitle")) {
                let countletter = document.getElementById("questionTitle").value.length;

                if (countletter > 600) {
                    document.getElementById("questionTitle").value = document.getElementById("questionTitle").value.substring(0, 600);
                } else {
                    document.getElementById("countNumber").innerHTML = countletter;
                }
            }
        },
        backButton() {
         this.$router.push({ name: 'help' });
        },
        deleteRow(index) {
        this.fileData.splice(index,1);
        index = undefined;
        },
        storeFileDetails() {
            var list = document.getElementById('attachmentsFaq');
            for (var x = 0; x < list.files.length; x++) {
                //// console.log(" Question.vue | storeFileDetails",list.files);
                if(this.fileFormat(list.files[x].type)) {
                    if(this.fileSizeRestriction(list.files[x].size)) {
                        if(this.checkDuplicate(list.files[x].name)) {
                            this.fileData.push(list.files[x]);
                        }
                    }
                }
            }
        },
        checkDuplicate(name) {
            for(let i in this.fileData) {
                 if(this.fileData[i].name == name) {
                     this.setFaqMessage("errorDuplicateFileAttachment");
                     eventBus.$emit("toggleMessageValidation",true);
                     return false;
                 }
            }
            return true;
        },
        fileSizeRestriction(contentSize) {
            let totalContentSize = 0;
            //  // console.log("contentSize.size",contentSize);
            if(contentSize > 4000000) {
                this.setFaqMessage(this.altMessages.errorIndividualFileSizeOver);
                eventBus.$emit("toggleMessageValidation",true);
                return false;
            }

            if(this.fileData) {
                for(let i in this.fileData) {
                    totalContentSize += this.fileData[i].size;
                }
            }
            totalContentSize += contentSize;

            if(totalContentSize > 4000000) {
                this.setFaqMessage(this.altMessages.errorTotalAttachmentSizeOver);
                eventBus.$emit("toggleMessageValidation",true);
                return false;
            } else {
                return true;
            }

        },
        fileFormat(type) {
            let format = type.split("/");
            if(format.length == 2) {
                // .doc, .docx, .pdf, .pages, .png, .jpg, .jpeg
                if(format[1] == "msword" || format[1] =="vnd.openxmlformats-officedocument.wordprocessingml.document" || format[1]== "pdf" || format[1]== "pages"|| format[1]== "png" || format[1]== "jpg" || format[1] == "jpeg" || format[1] == "plain") {
                    return true;
                } else {
                    this.setFaqMessage("Unknown File Format! Please select document or images");
                    eventBus.$emit("toggleMessageValidation",true);
                    return false;
                }
            } else {
                return false;
            }
        },
        popupFaq() {
            eventBus.$emit('toggleFaqQuestion', true);
        },
        list(data) {
            let descriptionData = this.faq_category_query.filter(function(list) {
                if(list.title == data) {
                    return list.description;
                }
            });
            this.description = descriptionData[0].description;
        },
        getQuestionTitle() {
            this.actGetQuestionTitle().then((response) => {
                if(response) {
                    let faq_category = response.faq_category_query;
                    let query;
                    for(query in faq_category) {
                        if(this.helpFaqPageTitleText == faq_category[query].category_name) {
                            this.faq_category_query = faq_category[query].query_list;
                            this.setFaqSelectedSection(this.faq_category_query);
                            // console.log("question.vue | getQuestionTitle,",localStorage.getItem("helpFaqPageTitle"),this.faq_category_query);
                            break;
                        }
                    }
                }

            }, (error) => {
                // console.log(error);
            });
        },
        validation() {
            if(this.FaqData.title == 'Tap to select a query type') {

                this.setFaqMessage("Please select your query type");
                eventBus.$emit("toggleMessageValidation",true);

                return false;
            } else {
                 if(document.getElementById("questionTitle").value.length == 0) {
                     this.setFaqMessage('Write a question');
                     eventBus.$emit("toggleMessageValidation",true);
                     return false;
                 }
            }
            return true;
        },
        submitQuestion() {

            this.toggleLoader(true);

            if(!this.validation()) {
                this.toggleLoader(false);
                return;
            }

            var altUser = JSON.parse(localStorage.getItem('altUser'));
            var form = document.forms.namedItem("formFaq");
            var oData = new FormData(form);

            for(let i in this.fileData) {
                oData.append("attachments["+i+"]", this.fileData[i]);
            }

            oData.append("subject", this.FaqData && this.FaqData.title ? this.FaqData.title : null );
            oData.append("description", this.FaqData && this.FaqData.description ? this.FaqData.description : null);
            oData.append("email", altUser.email);
            oData.append("priority", 1);
            oData.append("status", 2);
            oData.append("custom_fields[app_name]", "ALTBalaji");

            oData.append("custom_fields[app_version]",this.appVersionName + " " + this.appVersionCode );
            oData.append("custom_fields[account_type]","Subscribed");
            oData.append("custom_fields[user_platform]","Web");
            oData.append("custom_fields[user_timezone]","India Standard Time");
            oData.append("custom_fields[web_browser_name]","Chrome");
            oData.append("custom_fields[web_browser_version]","66.0.3359.181");
            oData.append("custom_fields[web_browser_render_engine]","Gecko");
            oData.append("custom_fields[web_browser_feature_silverlight]",false);
            oData.append("custom_fields[web_browser_language]","en-US");
            oData.append("custom_fields[web_browser_cookies]",true);
            oData.append("custom_fields[input]",null);
            oData.append("custom_fields[query_sub_type]",null);
            oData.append("custom_fields[query_type]",null);

            this.actSendTicketNew(oData).then((response) => {
                this.toggleLoader(false);
                this.showButton = false;
                document.getElementById("formFaq").style.display = "none";
                document.getElementById("headerPart").style.display = "none";

                // AWS Mobile SDK Events
                let _this = this;
                setTimeout(function(){
                    if (window.mobileAnalyticsClient) {
                        var eventAttributeObj = _this.getAWSMACommonAttributes();
                        eventAttributeObj.ticket_id = (response.helpdesk_ticket && response.helpdesk_ticket.id) ? response.helpdesk_ticket.id : 'N.A';
                        eventAttributeObj.ticket_content = (response.helpdesk_ticket && response.helpdesk_ticket.description) ? response.helpdesk_ticket.description : 'N.A';
                        window.mobileAnalyticsClient.recordEvent('_support.ticket', eventAttributeObj, {});
                    }
                },2000);


            },(error) => {
                this.toggleLoader(false);
                // AWS Mobile SDK Events
              let _this = this;
            setTimeout(function(){
                if (window.mobileAnalyticsClient) {
                    var eventAttributeObj = _this.getAWSMACommonAttributes();
                    eventAttributeObj.event_action = 'error';
                    eventAttributeObj.event_message = error.message ? error.message : 'N.A';
                    eventAttributeObj.event_code =  error.code ? error.code.toString() : '';
                    window.mobileAnalyticsClient.recordEvent('_support.ticket', eventAttributeObj, {});
                }
            },2000);
                // End of AWS Mobile SDK Events

                this.setFaqMessage('Oops! Something error occured');
                eventBus.$emit("toggleMessageValidation",true);


            });

        },
        stuffCommonAttributes() {
            var localAttributeObj = {};
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
        stuffTicketSuccAttr(attrObj) {
            var eventAttributeObj = this.stuffCommonAttributes();
            eventAttributeObj.ticket_id = attrObj.ticketId;
            eventAttributeObj.ticket_content = attrObj.ticketContent;
            return eventAttributeObj;
        },
        stuffTicketFailAttr(attrObj) {
            var eventAttributeObj = this.stuffCommonAttributes();
            eventAttributeObj.event_action = attrObj.eventAction;
            eventAttributeObj.event_message = attrObj.eventMessage;
            eventAttributeObj.event_code = attrObj.eventCode;
            return eventAttributeObj;
        },
    },
    mixins: [altMixins]
}
</script>
