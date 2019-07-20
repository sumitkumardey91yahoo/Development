<template>
  <div class="app-signup">
    <div class="container auth-container">
      <form class="form">
        <div class="form-group">
          <input type="email" name="email" class="form-control" placeholder="Email Address" v-model="email" @input="validateEmail" maxlength="25">
          <p class="form-error" v-show="emailError">{{emailError}}</p>
        </div>

        <div class="form-group">
          <div class="form-ico-control right-ico">
            <img src="../../assets/eye.svg" v-show="!(showPassword)" @click="togglePasswordState(true)">
            <img src="../../assets/eye-cross.svg" v-show="showPassword" @click="togglePasswordState(false)">

            <input type="password" id="input-password" class="form-control" placeholder="Password" v-model="password" @input="validatePassword">
          </div>
          <p class="form-error" v-show="passwordError">{{passwordError}}</p>
        </div>

        <div class="form-group">
          <div class="form-ico-control right-ico">
            <img src="../../assets/eye.svg" v-show="!(showConfPassword)" @click="togggleConfPassState(true)">
            <img src="../../assets/eye-cross.svg" v-show="showConfPassword" @click="togggleConfPassState(false)">

            <input type="password" id="input-conf-pass" class="form-control" placeholder="Confirm Password" v-model="confirmPassword" @input="validateConfirmPassword">
          </div>
          <p class="form-error" v-show="confirmPasswordError">{{confirmPasswordError}}</p>
        </div>
        <div class="form-group">
          <input type="text" name="first-name" class="form-control" placeholder="Full name (Optional)" v-model="firstName" maxlength="25" >
          <div class="clearfix"></div>
        </div>


        <div class="form-group">
          <div class="dob">Date of Birth</div>
          <select name="DOBDay" class="day" v-model="dobDate">
            <option disabled="true">DD </option>
            <option v-for="date in altRange(1, 31)" :value="date">{{date}}</option>
          </select>
          <select name="DOBMonth" class="month" v-model="dobMonth">
            <option disabled="true">MM</option>
            <option v-for="month in monthObj" :value="month.index">{{month.index}}</option>
          </select>
          <select name="DOBYear" class="year" v-model="dobYear">
            <option disabled="true">YYYY</option>
            <option v-for="year in altRange(1947, (new Date().getFullYear()) - 18)" :value="year">{{year}}</option>
          </select>
          <p class="form-error" v-show="dobError">{{dobError}}</p>
        </div>

        <div class="form-group">
          <ul class="gender-setting">
            Gender
            <li class="active-gender">
              <input class="radio-btn" type="radio" value="Male" name="radio" id="radio1" v-model="gender">
              <label for="radio1" class="altf-gender-label">MALE</label>
            </li>
            <li class="active-gender">
              <input class="radio-btn" type="radio" value="Female" name="radio" id="radio2" v-model="gender">
              <label for="radio2" class="altf-gender-label">FEMALE</label>
            </li>
          </ul>
        </div>

        <div class="form-group">
          <div class="input-group">
            <select name="countryPhone" class="country_phone_code" id="countryId" v-model="countryCode" @change="changeCountryCodeCB" @focus="codeToName">
              <option name="One" value="+972" style="display:none">+972</option>
              <option v-for="country in countryCodeArr" :value="country.dial_code" :data-text="country.name">{{country.dial_code}}</option>
            </select>

            <input type="tel" maxlength="15" class="input-tel form-control" placeholder="Contact Number (Optional)" v-model="phoneNumber" id="signup-phone" onkeypress="return (event.charCode < 48 || event.charCode > 57) ? false : true;" @input="validatePhone" @keyup="readInput">
          </div>
          <p v-show="phoneNumberError">{{phoneNumberError}}</p>
        </div>

        <div class="form-group" v-show="visitedDomain == 'IN' && selectedState">
          <select class="slct-control" v-model="selectedState">
            <option v-for="state in statesObj" :value="state">{{state}}</option>
          </select>
        </div>

        <div class="form-group">
          <div class="check">
            <input type="checkbox" name="terms" value="checked" class="checkbox" v-model="toc"> <span class="terms-cond">I understand and agree to the <router-link :to="{ name: 'toc' }" class="link-under">Terms of Use</router-link> and <router-link :to="{ name: 'privacyPolicy' }" class="link-under">Privacy Policy</router-link>.</span>
          </div>
          <p class="form-error" v-show="tocError">{{tocError}}</p>
        </div>

        <input type="submit" value="Submit" class="submit-btn grad-btn btn" @click.prevent="signupUser">
      </form>
    </div>

    <popup-alr-reg v-show="showAlrRegPopup"></popup-alr-reg>
    <alt-modals></alt-modals>
  </div>
</template>

<script>
  const Header = () => import (/* webpackChunkName: "signup-Signup-Header" */ './Header.vue');
  const PopupAlrReg = () => import (/* webpackChunkName: "signup-Signup-PopupAlrReg" */ './PopupAlrReg.vue');
  const Modals = () => import (/* webpackChunkName: "signup-Signup-Modals" */ '../shared/Modals.vue');

  import { eventBus } from '../../main';
  import { altMixins } from '../../mixins';
  import { mapGetters, mapMutations, mapActions } from 'vuex';

  export default {
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        dobDate: 'DD',
        dobMonth: 'MM',
        dobYear: 'YYYY',
        gender: 'Male',
        phoneNumber: '',
        altGeoData: undefined,
        selectedState: undefined,
        toc: false,
        monthObj: [{ index: '01', name: 'January' }, { index: '02', name: 'February' }, { index: '03', name: 'March' }, { index: '04', name: 'April' }, { index: '05', name: 'May' }, { index: '06', name: 'June' }, { index: '07', name: 'July' }, { index: '08', name: 'August' }, { index: '09', name: 'September' }, { index: '10', name: 'October' }, { index: '11', name: 'November' }, { index: '12', name: 'December' }, ],
        emailError: undefined,
        passwordError: undefined,
        confirmPasswordError: undefined,
        firstNameError: undefined,
        lastNameError: undefined,
        dobError: undefined,
        tocError: undefined,
        phoneNumberError: undefined,
        login: undefined,
        //  post signup
        altUser: undefined,
        altAccount: undefined,
        showPassword: false,
        showConfPassword: false,
        currentDomain: undefined,
        visitedDomain: undefined,
        statesObj: {
          "AP":"Andhra Pradesh", "AR":"Arunachal Pradesh", "AS":"Assam", "BR":"Bihar", "CG":"Chhattisgarh", "Chandigarh":"Chandigarh", "DN":"Dadra and Nagar Haveli", "DD":"Daman and Diu", "DL":"Delhi", "GA":"Goa", "GJ":"Gujarat", "HR":"Haryana", "HP":"Himachal Pradesh", "JK":"Jammu and Kashmir", "JH":"Jharkhand", "KA":"Karnataka", "KL":"Kerala", "MP":"Madhya Pradesh", "MH":"Maharashtra", "MN":"Manipur", "ML":"Meghalaya", "MZ":"Mizoram", "NL":"Nagaland", "OR":"Orissa", "PB":"Punjab", "PY":"Pondicherry", "RJ":"Rajasthan", "SK":"Sikkim", "TN":"Tamil Nadu", "TS":"Telangana", "TR":"Tripura", "UP":"Uttar Pradesh", "UK":"Uttarakhand", "WB":"West Bengal"
        },
        showPopupWelcomePage: false,
        showAlrRegPopup: false,
        showCreateKidsPin: false,
        countryCode: '+91',
        countryCodeArr: [{"name":"Israel","dial_code":"+972","code":"IL"},{"name":"Afghanistan","dial_code":"+93","code":"AF"},{"name":"Albania","dial_code":"+355","code":"AL"},{"name":"Algeria","dial_code":"+213","code":"DZ"},{"name":"AmericanSamoa","dial_code":"+1 684","code":"AS"},{"name":"United States","dial_code":"+1","code":"US"},{"name":"Andorra","dial_code":"+376","code":"AD"},{"name":"Angola","dial_code":"+244","code":"AO"},{"name":"Anguilla","dial_code":"+1 264","code":"AI"},{"name":"Antigua and Barbuda","dial_code":"+1268","code":"AG"},{"name":"Argentina","dial_code":"+54","code":"AR"},{"name":"Armenia","dial_code":"+374","code":"AM"},{"name":"Aruba","dial_code":"+297","code":"AW"},{"name":"Australia","dial_code":"+61","code":"AU"},{"name":"Austria","dial_code":"+43","code":"AT"},{"name":"Azerbaijan","dial_code":"+994","code":"AZ"},{"name":"Bahamas","dial_code":"+1 242","code":"BS"},{"name":"Bahrain","dial_code":"+973","code":"BH"},{"name":"Bangladesh","dial_code":"+880","code":"BD"},{"name":"Barbados","dial_code":"+1 246","code":"BB"},{"name":"Belarus","dial_code":"+375","code":"BY"},{"name":"Belgium","dial_code":"+32","code":"BE"},{"name":"Belize","dial_code":"+501","code":"BZ"},{"name":"Benin","dial_code":"+229","code":"BJ"},{"name":"Bermuda","dial_code":"+1 441","code":"BM"},{"name":"Bhutan","dial_code":"+975","code":"BT"},{"name":"Bosnia and Herzegovina","dial_code":"+387","code":"BA"},{"name":"Botswana","dial_code":"+267","code":"BW"},{"name":"Brazil","dial_code":"+55","code":"BR"},{"name":"British Indian Ocean Territory","dial_code":"+246","code":"IO"},{"name":"Bulgaria","dial_code":"+359","code":"BG"},{"name":"Burkina Faso","dial_code":"+226","code":"BF"},{"name":"Burundi","dial_code":"+257","code":"BI"},{"name":"Cambodia","dial_code":"+855","code":"KH"},{"name":"Cameroon","dial_code":"+237","code":"CM"},{"name":"Canada","dial_code":"+1","code":"CA"},{"name":"Cape Verde","dial_code":"+238","code":"CV"},{"name":"Cayman Islands","dial_code":"+ 345","code":"KY"},{"name":"Central African Republic","dial_code":"+236","code":"CF"},{"name":"Chad","dial_code":"+235","code":"TD"},{"name":"Chile","dial_code":"+56","code":"CL"},{"name":"China","dial_code":"+86","code":"CN"},{"name":"Christmas Island","dial_code":"+61","code":"CX"},{"name":"Colombia","dial_code":"+57","code":"CO"},{"name":"Comoros","dial_code":"+269","code":"KM"},{"name":"Congo","dial_code":"+242","code":"CG"},{"name":"Cook Islands","dial_code":"+682","code":"CK"},{"name":"Costa Rica","dial_code":"+506","code":"CR"},{"name":"Croatia","dial_code":"+385","code":"HR"},{"name":"Cuba","dial_code":"+53","code":"CU"},{"name":"Cyprus","dial_code":"+537","code":"CY"},{"name":"Czech Republic","dial_code":"+420","code":"CZ"},{"name":"Denmark","dial_code":"+45","code":"DK"},{"name":"Djibouti","dial_code":"+253","code":"DJ"},{"name":"Dominica","dial_code":"+1 767","code":"DM"},{"name":"Dominican Republic","dial_code":"+1 849","code":"DO"},{"name":"Ecuador","dial_code":"+593","code":"EC"},{"name":"Egypt","dial_code":"+20","code":"EG"},{"name":"El Salvador","dial_code":"+503","code":"SV"},{"name":"Equatorial Guinea","dial_code":"+240","code":"GQ"},{"name":"Eritrea","dial_code":"+291","code":"ER"},{"name":"Estonia","dial_code":"+372","code":"EE"},{"name":"Ethiopia","dial_code":"+251","code":"ET"},{"name":"Faroe Islands","dial_code":"+298","code":"FO"},{"name":"Fiji","dial_code":"+679","code":"FJ"},{"name":"Finland","dial_code":"+358","code":"FI"},{"name":"France","dial_code":"+33","code":"FR"},{"name":"French Guiana","dial_code":"+594","code":"GF"},{"name":"French Polynesia","dial_code":"+689","code":"PF"},{"name":"Gabon","dial_code":"+241","code":"GA"},{"name":"Gambia","dial_code":"+220","code":"GM"},{"name":"Georgia","dial_code":"+995","code":"GE"},{"name":"Germany","dial_code":"+49","code":"DE"},{"name":"Ghana","dial_code":"+233","code":"GH"},{"name":"Gibraltar","dial_code":"+350","code":"GI"},{"name":"Greece","dial_code":"+30","code":"GR"},{"name":"Greenland","dial_code":"+299","code":"GL"},{"name":"Grenada","dial_code":"+1 473","code":"GD"},{"name":"Guadeloupe","dial_code":"+590","code":"GP"},{"name":"Guam","dial_code":"+1 671","code":"GU"},{"name":"Guatemala","dial_code":"+502","code":"GT"},{"name":"Guinea","dial_code":"+224","code":"GN"},{"name":"Guinea-Bissau","dial_code":"+245","code":"GW"},{"name":"Guyana","dial_code":"+595","code":"GY"},{"name":"Haiti","dial_code":"+509","code":"HT"},{"name":"Honduras","dial_code":"+504","code":"HN"},{"name":"Hungary","dial_code":"+36","code":"HU"},{"name":"Iceland","dial_code":"+354","code":"IS"},{"name":"India","dial_code":"+91","code":"IN"},{"name":"Indonesia","dial_code":"+62","code":"ID"},{"name":"Iraq","dial_code":"+964","code":"IQ"},{"name":"Ireland","dial_code":"+353","code":"IE"},{"name":"Israel","dial_code":"+972","code":"IL"},{"name":"Italy","dial_code":"+39","code":"IT"},{"name":"Jamaica","dial_code":"+1 876","code":"JM"},{"name":"Japan","dial_code":"+81","code":"JP"},{"name":"Jordan","dial_code":"+962","code":"JO"},{"name":"Kazakhstan","dial_code":"+7 7","code":"KZ"},{"name":"Kenya","dial_code":"+254","code":"KE"},{"name":"Kiribati","dial_code":"+686","code":"KI"},{"name":"Kuwait","dial_code":"+965","code":"KW"},{"name":"Kyrgyzstan","dial_code":"+996","code":"KG"},{"name":"Latvia","dial_code":"+371","code":"LV"},{"name":"Lebanon","dial_code":"+961","code":"LB"},{"name":"Lesotho","dial_code":"+266","code":"LS"},{"name":"Liberia","dial_code":"+231","code":"LR"},{"name":"Liechtenstein","dial_code":"+423","code":"LI"},{"name":"Lithuania","dial_code":"+370","code":"LT"},{"name":"Luxembourg","dial_code":"+352","code":"LU"},{"name":"Madagascar","dial_code":"+261","code":"MG"},{"name":"Malawi","dial_code":"+265","code":"MW"},{"name":"Malaysia","dial_code":"+60","code":"MY"},{"name":"Maldives","dial_code":"+960","code":"MV"},{"name":"Mali","dial_code":"+223","code":"ML"},{"name":"Malta","dial_code":"+356","code":"MT"},{"name":"Marshall Islands","dial_code":"+692","code":"MH"},{"name":"Martinique","dial_code":"+596","code":"MQ"},{"name":"Mauritania","dial_code":"+222","code":"MR"},{"name":"Mauritius","dial_code":"+230","code":"MU"},{"name":"Mayotte","dial_code":"+262","code":"YT"},{"name":"Mexico","dial_code":"+52","code":"MX"},{"name":"Monaco","dial_code":"+377","code":"MC"},{"name":"Mongolia","dial_code":"+976","code":"MN"},{"name":"Montenegro","dial_code":"+382","code":"ME"},{"name":"Montserrat","dial_code":"+1664","code":"MS"},{"name":"Morocco","dial_code":"+212","code":"MA"},{"name":"Myanmar","dial_code":"+95","code":"MM"},{"name":"Namibia","dial_code":"+264","code":"NA"},{"name":"Nauru","dial_code":"+674","code":"NR"},{"name":"Nepal","dial_code":"+977","code":"NP"},{"name":"Netherlands","dial_code":"+31","code":"NL"},{"name":"Netherlands Antilles","dial_code":"+599","code":"AN"},{"name":"New Caledonia","dial_code":"+687","code":"NC"},{"name":"New Zealand","dial_code":"+64","code":"NZ"},{"name":"Nicaragua","dial_code":"+505","code":"NI"},{"name":"Niger","dial_code":"+227","code":"NE"},{"name":"Nigeria","dial_code":"+234","code":"NG"},{"name":"Niue","dial_code":"+683","code":"NU"},{"name":"Norfolk Island","dial_code":"+672","code":"NF"},{"name":"Northern Mariana Islands","dial_code":"+1 670","code":"MP"},{"name":"Norway","dial_code":"+47","code":"NO"},{"name":"Oman","dial_code":"+968","code":"OM"},{"name":"Pakistan","dial_code":"+92","code":"PK"},{"name":"Palau","dial_code":"+680","code":"PW"},{"name":"Panama","dial_code":"+507","code":"PA"},{"name":"Papua New Guinea","dial_code":"+675","code":"PG"},{"name":"Paraguay","dial_code":"+595","code":"PY"},{"name":"Peru","dial_code":"+51","code":"PE"},{"name":"Philippines","dial_code":"+63","code":"PH"},{"name":"Poland","dial_code":"+48","code":"PL"},{"name":"Portugal","dial_code":"+351","code":"PT"},{"name":"Puerto Rico","dial_code":"+1 939","code":"PR"},{"name":"Qatar","dial_code":"+974","code":"QA"},{"name":"Romania","dial_code":"+40","code":"RO"},{"name":"Rwanda","dial_code":"+250","code":"RW"},{"name":"Samoa","dial_code":"+685","code":"WS"},{"name":"San Marino","dial_code":"+378","code":"SM"},{"name":"Saudi Arabia","dial_code":"+966","code":"SA"},{"name":"Senegal","dial_code":"+221","code":"SN"},{"name":"Serbia","dial_code":"+381","code":"RS"},{"name":"Seychelles","dial_code":"+248","code":"SC"},{"name":"Sierra Leone","dial_code":"+232","code":"SL"},{"name":"Singapore","dial_code":"+65","code":"SG"},{"name":"Slovakia","dial_code":"+421","code":"SK"},{"name":"Slovenia","dial_code":"+386","code":"SI"},{"name":"Solomon Islands","dial_code":"+677","code":"SB"},{"name":"South Africa","dial_code":"+27","code":"ZA"},{"name":"South Georgia and the South Sandwich Islands","dial_code":"+500","code":"GS"},{"name":"Spain","dial_code":"+34","code":"ES"},{"name":"Sri Lanka","dial_code":"+94","code":"LK"},{"name":"Sudan","dial_code":"+249","code":"SD"},{"name":"Suriname","dial_code":"+597","code":"SR"},{"name":"Swaziland","dial_code":"+268","code":"SZ"},{"name":"Sweden","dial_code":"+46","code":"SE"},{"name":"Switzerland","dial_code":"+41","code":"CH"},{"name":"Tajikistan","dial_code":"+992","code":"TJ"},{"name":"Thailand","dial_code":"+66","code":"TH"},{"name":"Togo","dial_code":"+228","code":"TG"},{"name":"Tokelau","dial_code":"+690","code":"TK"},{"name":"Tonga","dial_code":"+676","code":"TO"},{"name":"Trinidad and Tobago","dial_code":"+1 868","code":"TT"},{"name":"Tunisia","dial_code":"+216","code":"TN"},{"name":"Turkey","dial_code":"+90","code":"TR"},{"name":"Turkmenistan","dial_code":"+993","code":"TM"},{"name":"Turks and Caicos Islands","dial_code":"+1 649","code":"TC"},{"name":"Tuvalu","dial_code":"+688","code":"TV"},{"name":"Uganda","dial_code":"+256","code":"UG"},{"name":"Ukraine","dial_code":"+380","code":"UA"},{"name":"United Arab Emirates","dial_code":"+971","code":"AE"},{"name":"United Kingdom","dial_code":"+44","code":"GB"},{"name":"Uruguay","dial_code":"+598","code":"UY"},{"name":"Uzbekistan","dial_code":"+998","code":"UZ"},{"name":"Vanuatu","dial_code":"+678","code":"VU"},{"name":"Wallis and Futuna","dial_code":"+681","code":"WF"},{"name":"Yemen","dial_code":"+967","code":"YE"},{"name":"Zambia","dial_code":"+260","code":"ZM"},{"name":"Zimbabwe","dial_code":"+263","code":"ZW"},{"name":"land Islands","dial_code":"+358","code":"AX"},{"name":"Antarctica","dial_code":"+672","code":"AQ"},{"name":"Bolivia, Plurinational State of","dial_code":"+591","code":"BO"},{"name":"Brunei Darussalam","dial_code":"+673","code":"BN"},{"name":"Cocos (Keeling) Islands","dial_code":"+61","code":"CC"},{"name":"Congo, The Democratic Republic of the","dial_code":"+243","code":"CD"},{"name":"Cote d'Ivoire","dial_code":"+225","code":"CI"},{"name":"Falkland Islands (Malvinas)","dial_code":"+500","code":"FK"},{"name":"Guernsey","dial_code":"+44","code":"GG"},{"name":"Holy See (Vatican City State)","dial_code":"+379","code":"VA"},{"name":"Hong Kong","dial_code":"+852","code":"HK"},{"name":"Iran, Islamic Republic of","dial_code":"+98","code":"IR"},{"name":"Isle of Man","dial_code":"+44","code":"IM"},{"name":"Jersey","dial_code":"+44","code":"JE"},{"name":"Korea, Democratic People's Republic of","dial_code":"+850","code":"KP"},{"name":"Korea, Republic of","dial_code":"+82","code":"KR"},{"name":"Lao People's Democratic Republic","dial_code":"+856","code":"LA"},{"name":"Libyan Arab Jamahiriya","dial_code":"+218","code":"LY"},{"name":"Macao","dial_code":"+853","code":"MO"},{"name":"Macedonia, The Former Yugoslav Republic of","dial_code":"+389","code":"MK"},{"name":"Micronesia, Federated States of","dial_code":"+691","code":"FM"},{"name":"Moldova, Republic of","dial_code":"+373","code":"MD"},{"name":"Mozambique","dial_code":"+258","code":"MZ"},{"name":"Palestinian Territory, Occupied","dial_code":"+970","code":"PS"},{"name":"Pitcairn","dial_code":"+872","code":"PN"},{"name":"Réunion","dial_code":"+262","code":"RE"},{"name":"Russia","dial_code":"+7","code":"RU"},{"name":"Saint Barthélemy","dial_code":"+590","code":"BL"},{"name":"Saint Helena, Ascension and Tristan Da Cunha","dial_code":"+290","code":"SH"},{"name":"Saint Kitts and Nevis","dial_code":"+1 869","code":"KN"},{"name":"Saint Lucia","dial_code":"+1 758","code":"LC"},{"name":"Saint Martin","dial_code":"+590","code":"MF"},{"name":"Saint Pierre and Miquelon","dial_code":"+508","code":"PM"},{"name":"Saint Vincent and the Grenadines","dial_code":"+1 784","code":"VC"},{"name":"Sao Tome and Principe","dial_code":"+239","code":"ST"},{"name":"Somalia","dial_code":"+252","code":"SO"},{"name":"Svalbard and Jan Mayen","dial_code":"+47","code":"SJ"},{"name":"Syrian Arab Republic","dial_code":"+963","code":"SY"},{"name":"Taiwan, Province of China","dial_code":"+886","code":"TW"},{"name":"Tanzania, United Republic of","dial_code":"+255","code":"TZ"},{"name":"Timor-Leste","dial_code":"+670","code":"TL"},{"name":"Venezuela, Bolivarian Republic of","dial_code":"+58","code":"VE"},{"name":"Viet Nam","dial_code":"+84","code":"VN"},{"name":"Virgin Islands, British","dial_code":"+1 284","code":"VG"},{"name":"Virgin Islands, U.S.","dial_code":"+1 340","code":"VI"}],
        sessionToken: undefined,
      };
    },
    computed: {
      ...mapGetters([
      'domain',
      'signupRedirectData',
      ])
    },
    components: {
      'popup-alr-reg': PopupAlrReg,
      'signup-header': Header,
      'alt-modals': Modals,
    },
    created() {
      this.setSignupHeader();

      document.body.scrollTop = document.documentElement.scrollTop = 0;

      this.currentDomain=localStorage.getItem('homeDomain');

      // NOTE added by SUMIT for row user state if take 04/01/2018
      this.visitedDomain = localStorage.getItem('visitedDomain') ? localStorage.getItem('visitedDomain') : "row";

      if(this.signupRedirectData){
        this.email = this.signupRedirectData.username;
        this.password = this.signupRedirectData.password;
      }

      eventBus.$on('closeAlrRegPopupEvent', () => {
        this.showAlrRegPopup = false;
      });

      eventBus.$on('toggleCreateKidsPinEvent', (state) => {
        this.showCreateKidsPin = state;

        if (!state) {
          this.$router.push({ name: 'home' });
        }
      });

      var countryName = undefined;
      if (localStorage.getItem('altGeoData')) {
        this.altGeoData = JSON.parse(localStorage.getItem('altGeoData'));

        countryName = this.altGeoData.country.names.en;
      }
      if(this.altGeoData && countryName == "India") {
        var geoRegion = undefined;
        if (this.altGeoData.subdivisions &&  this.altGeoData.subdivisions.length) {
          geoRegion = this.altGeoData.subdivisions[0].names.en;
        }

        if (this.altGeoData) {
          this.selectedState = geoRegion;
        } else {
          this.selectedState = 'Maharashtra';
        }
      }

      if (!this.selectedState) {
        this.selectedState = 'Maharashtra';
      }

      for(var i in this.countryCodeArr) {
        if(this.countryCodeArr[i].name == this.altGeoData.country.names.en) {
          this.countryCode = this.countryCodeArr[i].dial_code;
        }
      }
      this.toggleLoader(false);
    },
    mounted() {
      // GTM Webengage
      this.sendGTMpageViewData('signup');
      this.webEnagePageView('sign up');
    },
    beforeDestroy() {
      this.setSignupRedirectData(undefined);
      this.resetForm();
    },
    beforeRouteEnter: (to, from, next) => {
      var altProfileMode = localStorage.getItem('altProfileMode');
      if (altProfileMode == 'kids') {
        next({ name: 'kidsMode' })
      } else {
        if (localStorage.getItem('altUser')) {
          next({ name: 'home' });
        } else {
          next();
        }
      }
    },
    methods: {
      ...mapMutations([
        'setAltMessage',
        'setSignupRedirectData',
      ]),
      ...mapActions([
        'actGetUserSignup',
        'actGetUserLogin',
        'actGetDeviceList',
        'actRegisterDevice',
        'actGetAccountDetails',
        'actGetOrders',
        'actPostWelcomeEmail',
        'actGetVerifyEmail',
      ]),
      setSignupHeader() {
        this.setHeaderTitle('Sign Up');
        this.toggleSearchIco(false);
        this.toggleDeleteIco(false);
        this.toggleCloseIco(false);
      },
      signupUser() {
        if (this.isFormValid()) {
          this.toggleLoader(true);

          var altGeoData = undefined;
          if (localStorage.getItem('altGeoData')) {
            altGeoData = JSON.parse(localStorage.getItem('altGeoData'));
          }

          let country = altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en ? altGeoData.country.names.en : null;

          var signupObj = {
            login: this.email,
            password: this.password,
            name: this.firstName,
            surname: this.lastName,
            phone_number: this.phoneNumber ? this.countryCode + '-' + this.phoneNumber : '',
            details: {
              birthday: this.dobYear + '-' + this.dobMonth + '-' + this.dobDate,
              gender: this.gender,
              country
            }
          };

          let visitedDomain = undefined;
          if (localStorage.getItem('visitedDomain')) {
            visitedDomain = localStorage.getItem('visitedDomain');
          }

          if (visitedDomain == 'IN') {
            signupObj.details.state = this.selectedState;
          }

          this.actGetUserSignup(signupObj).then((response) => {
            this.login = response.login;

            // NOTE update hotspot signup name Issue #955 
            if(signupObj.name) {
                eventBus.$emit('changeHumburgerName',signupObj.name);
            } else {
                eventBus.$emit('changeHumburgerName','Welcome!');
            }
            // NOTE End Issue #955

            this.processPostSignup();

            var platformDetails = this.altDetectPlatform();

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'event': 'gt_complete_registration',
              'eventAction':'registration',
              'eventCategory':'gt_complete_registration',
              'eventLabel':'registration',
              'eventValue':1,
              'gtl_platform':(platformDetails &&  platformDetails.os && platformDetails.osVersion) ? platformDetails.os + " " + platformDetails.osVersion : ' ',
              'gtl_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
              'gtl_country': altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en ? altGeoData.country.names.en : '',
              'gtl_city': altGeoData.city && altGeoData.city.names && altGeoData.city.names.en ? altGeoData.city.names.en : '',
              'gtl_device_timestamp': new Date().getTime(),
            });
            // End of GTM Code
          }, (error) => {
            // AWS Mobile SDK Events
            if (window.mobileAnalyticsClient) {
              var eventAttributeObj = this.getAWSMACommonAttributes();

              eventAttributeObj.event_action = 'failure';
              eventAttributeObj.event_message = error.message;
              eventAttributeObj.event_code = error.code.toString();
              window.mobileAnalyticsClient.recordEvent('_user.signup', eventAttributeObj, {});
            }
            // End of AWS Mobile SDK Events

            if (error && error.code == 409) {
              this.showAlrRegPopup = true;
              this.toggleLoader(false);
            }
          });
        }
      },
      codeToName() {
        var li=document.getElementById("countryId");
        var wel = li.getElementsByTagName("option");
        for(var i=0;i<wel.length;i++) {
          wel[i].innerHTML=wel[i].getAttribute("data-text");
        }

        li.blur();
        document.getElementById('countryId').getElementsByTagName('option')[0].value = document.getElementById("countryId").value;
        document.getElementById('countryId').getElementsByTagName('option')[0].innerHTML = document.getElementById("countryId").value;
        document.getElementById("countryId").selectedIndex = "0";
      },
      nameToCode() {
        var li = document.getElementById("countryId");
        var wel = li.getElementsByTagName("option");
        for(var i = 0; i < wel.length; i++) {
          wel[i].innerHTML = wel[i].getAttribute("value");
        }
        li.blur();
      },
      mouseLeave() {
      },
      processPostSignup() {
        this.actGetUserLogin({
          username: this.email,
          password: this.password
        }).then((response) => {
          this.sessionToken = response.session_token;

          var account = response.account;
          var profile = response.account.profile;
          var altUser = {
            sessionToken: (response.session_token) ? response.session_token : '',
            dateCreated: (account.date_created) ? account.date_created : '',
            email: (account.email) ? account.email : '',
            accountId: (account.id) ? account.id : '',
            isAdmin: (account.is_admin) ? account.is_admin : '',
            login: (account.login) ? account.login : '',
            username: (profile.username) ? profile.username : '',
            profileId: (profile.id) ? profile.id : '',
          }

          localStorage.setItem('token', response.session_token);
          localStorage.setItem('user_email', response.account.email);
          localStorage.setItem('account_id', response.account.id);

          this.altUser = altUser;
          this.getAccountLookup();
        }, (error) => {
          if (error.code == 404 && error.message == 'Account does not exist') {
            var homeDomain = localStorage.getItem('homeDomain');
            homeDomain = (homeDomain == 'IN') ? 'row' : 'IN';
            localStorage.setItem('homeDomain', homeDomain);

            this.processPostSignup();
            return false;
          } else if (error.message) {
            this.toggleAltPopup(true, error.message);
          } else {
            this.toggleAltPopup(true, 'Your internet is acting up. Please check your connection.')
          }
          this.toggleLoader(false);

          // AWS Mobile SDK Events
          if (window.mobileAnalyticsClient) {
            var eventAttributeObj = this.getAWSMACommonAttributes();

            eventAttributeObj.event_action = 'error';
            eventAttributeObj.event_message = error.message;
            eventAttributeObj.event_code = error.code.toString();
            window.mobileAnalyticsClient.recordEvent( '_user.login', eventAttributeObj, {});
          }
          // End of AWS Mobile SDK Events
        });
      },
      getAccountLookup() {
        this.actGetAccountDetails(this.altUser).then((response) => {
          this.altAccount = response;

          localStorage.setItem('user_mobile',response.phone_number ? response.phone_number : "N.A");
          localStorage.setItem('user_state',(response.details && response.details.state) ? response.details.state : "N.A");

          localStorage.setItem('user_name', response.name + " " + response.surname);
          localStorage.setItem('user_birthday', (response.details.birthday) ? response.details.birthday : '');
          localStorage.setItem('user_gender', (response.details.gender) ? response.details.gender : '');

          this.getDevice();
        }, (error) => {
          // console.log('[Signup | getAccountLookup | error | ]', error);
        });
      },
      getDevice() {
        var altDeviceId = localStorage.getItem('altDeviceId');
        if (altDeviceId) {
          altDeviceId = this.generateRandomId(32);
          localStorage.setItem('altDeviceId', altDeviceId);
        }

        this.actGetDeviceList(this.altUser).then((response) => {
          if (response.count) {
            var devices = response.devices;

            var matchedDevice = devices.filter((device) => {
              return device.uuid == altDeviceId;
            });

            if (matchedDevice && matchedDevice.length) {
              var deviceObj = matchedDevice[0];
              this.saveDevice(deviceObj);
            } else {
              this.registerDevice({ user: this.altUser, deviceId: altDeviceId });
            }
          } else {
            this.registerDevice({ user: this.altUser, deviceId: altDeviceId });
          }
        }, (error) => {
          // console.log(error);
        });
      },
      registerDevice(registerObj) {
        this.actRegisterDevice(registerObj).then((response) => {
          if (response) {
            this.saveDevice(response);
          }
        }, (error) => {
          if (error) {
            localStorage.removeItem('altDeviceId');
            localStorage.setItem('altDeviceId', this.generateRandomId(32));
            this.setUser(this.altUser);
            this.setAccount(this.altAccount);
            this.toggleLoader(false);

            this.toggleClearDevicealert(true);
          }
        });
      },
      saveDevice(deviceObj) {
        var altDevice = {
          uuid: deviceObj.uuid,
          appVersion: deviceObj.app_version,
          deviceId: deviceObj.id,
          ipAddress: deviceObj.ip_address,
          name: deviceObj.name,
          type: deviceObj.type,
          userAgent: deviceObj.user_agent,
        }

        // inally setting everything to localStorage
        localStorage.setItem('altUser', JSON.stringify(this.altUser));
        localStorage.setItem('altAccount', JSON.stringify(this.altAccount));
        localStorage.setItem('altDevice', JSON.stringify(altDevice));
        localStorage.setItem('altOrder', JSON.stringify({ tvod: { hasOrder: false, expired: true }, subscription: { hasOrder: false, expired: true } }));

        var accountIdWebenage = localStorage.getItem("altUser") ? JSON.parse(localStorage.getItem("altUser")).accountId : undefined;

        if(accountIdWebenage) {
          if (webengage && webengage.user) {
            webengage.user.login(accountIdWebenage);
            this.webengageLoginAttribute(accountIdWebenage);
          }
        }

        var altGeoData = JSON.parse(localStorage.getItem('altGeoData'));

        var platformDetails = this.altDetectPlatform();

        // NOTE webenage code track  added by sumit
        if(webengage) {
          webengage.track('gt_complete_registration' , {
            'gt_platform':platformDetails.os + " " + platformDetails.osVersion ,
            'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
            'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
            'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
            'gt_device_timestamp': new Date()
          });
        }
        //end webengage

        this.verifyEmail();

        // eventBus.$emit('toggleUserModeChange', true);
        // eventBus.$emit('togglePopupSignupWelcomePageEvent', true);

        this.toggleLoader(false);

        // AWS Mobile SDK Events
        if (window.mobileAnalyticsClient) {
          // Signup Event
          var signupEventAttributeObj = this.getAWSMACommonAttributes();
          signupEventAttributeObj.event_mode = 'email';
          window.mobileAnalyticsClient.recordEvent('_user.signup', signupEventAttributeObj, {});

          // Login Event post Signup
          var loginEventAttributeObj = this.getAWSMACommonAttributes();
          loginEventAttributeObj.event_mode = 'email';
          loginEventAttributeObj.user_state = localStorage.getItem("user_state") ? localStorage.getItem("user_state") : null;
          loginEventAttributeObj.user_mobile = localStorage.getItem("user_mobile") ? localStorage.getItem("user_mobile") : null;
          window.mobileAnalyticsClient.recordEvent('_user.login', loginEventAttributeObj, {});
        }
        // End of AWS Mobile SDK Events

        //NOTE sign in
        if (webengage) {
          webengage.track('gt_login' , {
            'gt_platform':platformDetails.os + " " + platformDetails.osVersion ,
            'gt_device_make':(platformDetails && platformDetails.device_model) ?  platformDetails.device_model : ' ',
            'gt_country': (altGeoData && altGeoData.country && altGeoData.country.names && altGeoData.country.names.en) ? altGeoData.country.names.en : '',
            'gt_city':(altGeoData && altGeoData.city && altGeoData.city.names && altGeoData.city.names.en) ? String(altGeoData.city.names.en) : '',
            'gt_device_timestamp': new Date()
          });
        }
        //NOTE end sign in

        // NOTE made down
        eventBus.$emit('toggleUserModeChange', true);



        var paytmRedirectDecision = undefined;
        paytmRedirectDecision = localStorage.getItem("campaign-redirect") ? localStorage.getItem("campaign-redirect") : undefined;
        var promotionalFlag = localStorage.getItem("promotional-redirect") ? localStorage.getItem("promotional-redirect") : undefined;

        if (paytmRedirectDecision || promotionalFlag) {
            this.toggleLoader(true);
            // console.log("paytm decision");
            if (paytmRedirectDecision) {
              localStorage.removeItem("campaign-redirect");
              this.$router.push({ name: 'paymentPage' });
            } else if (promotionalFlag){
              localStorage.removeItem("promotional-redirect");
              window.location.replace(location.protocol + '//' + location.host + '/promotion/paymentStatus');
              return;       
            }
        } else {
            eventBus.$emit('togglePopupSignupWelcomePageEvent', true);
        }


      },
      sendWelcomeEmail() {
        this.actPostWelcomeEmail().then((response) => {
          // console.log('[Signup | sendWelcomeEmail | response | ]', response);
        }, (error) => {
          // console.log('[Signup | sendWelcomeEmail | error | ]', error);
        });
      },
      webengageLoginAttribute(accountIdWebenage) {
        var altAccountWebenage = JSON.parse(localStorage.getItem("altAccount"));
        var altUserWebenage = JSON.parse(localStorage.getItem("altUser"));
        var jsonWebengage = {
          "we_first_name" : altAccountWebenage.name ? altAccountWebenage.name : "N.A",
          "we_hashed_email" : accountIdWebenage ? accountIdWebenage : "N.A",
          "we_gender" : altAccountWebenage.details.gender ? (altAccountWebenage.details.gender).toLowerCase() : "N.A",
          'we_hashed_phone' : accountIdWebenage ? accountIdWebenage : "N.A",
          'we_birth_date' : altAccountWebenage.details.birthday ? altAccountWebenage.details.birthday : "N.A",
          'we_email_opt_in' : true,
          'we_sms_opt_in' : true
        };
        webengage.user.setAttribute(jsonWebengage);
      },
      verifyEmail() {
        this.actGetVerifyEmail().then((response) => {
          if (response.status && response.status == 'ok') {
            // this.toggleAltPopup(true, 'You\'ve got mail!');
          } else {
            // this.toggleAltPopup(true, 'Oops! Something error happened.');
          }
        }, (error) => {
          // this.toggleAltPopup(true, 'Oops! Something error happened.');
        });
      },
      changeCountryCodeCB() {
        var selectedCountry = this.countryCodeArr.filter((item) => {
          return item.dial_code == this.countryCode;
        });
        if (selectedCountry && selectedCountry.length) {
          this.countryCode = selectedCountry[0].dial_code;
        }

        document.getElementById('countryId').value == selectedCountry[0].dial_code;
        document.getElementById('countryId').getElementsByTagName('option')[0].value = document.getElementById("countryId").value;
        document.getElementById('countryId').getElementsByTagName('option')[0].innerHTML = document.getElementById("countryId").value;
        document.getElementById("countryId").selectedIndex = "0";
      },
      isFormValid() {
        if (this.validateEmail() && this.validatePassword() && this.validateConfirmPassword() && this.validateDob() && this.validateToc() && this.validatePhone()) {
          return true;
        }
        return false;
      },
      validateEmail() {
        if (!(this.email)) {
          this.emailError = 'Enter your email here';
          return false;
        } else if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.email)) {
          this.emailError = 'Email not valid';
          return false;
        } else {
          this.emailError = undefined;
          return true;
        }
      },
      validatePassword() {
        if (!(this.password)) {
          this.passwordError = 'Password required';
          return false;
        } else if (this.password.length < 8) {
          this.passwordError = 'Password must contain altleast 8 characters';
          return false;
        } else {
          this.passwordError = undefined;
          return true;
        }
      },
      validateConfirmPassword() {
        if (this.password != this.confirmPassword) {
          this.confirmPasswordError = 'Passwords not matching';
          return false;
        } else {
          this.confirmPasswordError = undefined;
          return true;
        }
      },
      validateDob() {
        if (this.dobDate == 'DD' || this.dobMonth == 'MM' || this.dobYear == 'YYYY') {
          this.dobError = 'Select your date of birth';
          return false;
        } else {
          this.dobError = undefined;
          return true;
        }
      },
      validateToc() {
        if (!(this.toc)) {
          this.tocError = 'Please accept terms of use and privacy policy';
          return false;
        } else {
          this.tocError = undefined;
          return true;
        }
      },
      isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode < 48 || charCode > 57) {
          return true;
        }
        return true;
      },
      readInput(event) {
        if (event.keyCode == 13) {
          document.getElementById("signup-phone").blur();
        }
      },
      validatePhone() {
        // Get the value from the input field
        var phoneNumber = document.getElementById('signup-phone').value;

        // The format to validate
        var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?a-zA-Z]/;

        if(this.countryCode == "+91") {
          if (phoneNumber.length != 0 && phoneNumber.length != 10) {
            this.phoneNumberError = 'Not a valid phone number';
            return false;
          } else if (format.test(phoneNumber)) {
            this.phoneNumberError = 'Not a valid phone number';
            return false;
          } else {
            this.phoneNumberError = false;
            return true;
          }

        } else {
          if (phoneNumber.length != 0 && phoneNumber.length < 4 || phoneNumber.length >= 14) {
            this.phoneNumberError = 'Not a valid phone number';
            return false;
          } else if (format.test(phoneNumber)) {
            this.phoneNumberError = 'Not a valid phone number';
            return false;
          } else {
            this.phoneNumberError = false;
            return true;
          }
        }

      },
      togglePasswordState(state) {
        this.showPassword = state;
        if (this.showPassword) {
          document.getElementById('input-password').type = 'text';
        } else {
          document.getElementById('input-password').type = 'password';
        }
      },
      togggleConfPassState(state) {
        this.showConfPassword = state;

        if (this.showConfPassword) {
          document.getElementById('input-conf-pass').type = 'text';
        } else {
          document.getElementById('input-conf-pass').type = 'password';
        }
      },
      resetForm() {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.firstName = '';
        this.lastName = '';
        this.dobDate = 'DD';
        this.dobMonth = 'MM';
        this.dobYear = 'YYYY';
        this.gender = 'Male';
        this.phoneNumber = '';
        this.altGeoData = undefined;
        this.selectedState = undefined;
        this.toc = false;
      },
    },
    mixins: [altMixins]
  }
</script>
