webpackJsonp([78],{1031:function(e,a,o){e.exports={render:function(){var e=this,a=e.$createElement,d=e._self._c||a;return d("div",{staticClass:"account-edit"},[d("form",{staticClass:"account-edit-form"},[d("div",{staticClass:"form-inline"},[d("div",{staticClass:"form-group"},[d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.name,expression:"user.name"}],staticClass:"alt-form-control",attrs:{type:"text",placeholder:"Full name (Optional)",maxlength:"25"},domProps:{value:e.user.name},on:{input:function(a){a.target.composing||e.$set(e.user,"name",a.target.value)}}})]),e._v(" "),d("div",{staticClass:"clearfix"})]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{staticClass:"form-ico-control right-ico"},[d("img",{directives:[{name:"show",rawName:"v-show",value:!e.showPassword,expression:"!(showPassword)"}],attrs:{src:o(119),alt:"eye"},on:{click:function(a){e.togglePasswordState(!0)}}}),e._v(" "),d("img",{directives:[{name:"show",rawName:"v-show",value:e.showPassword,expression:"showPassword"}],attrs:{src:o(118),alt:"eye-cross"},on:{click:function(a){e.togglePasswordState(!1)}}}),e._v(" "),d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.password,expression:"user.password"}],staticClass:"alt-form-control",attrs:{type:"password",placeholder:"Password",id:"accedit-pass"},domProps:{value:e.user.password},on:{input:function(a){a.target.composing||e.$set(e.user,"password",a.target.value)}}})]),e._v(" "),d("p",{directives:[{name:"show",rawName:"v-show",value:e.passwordError,expression:"passwordError"}]},[e._v(e._s(e.passwordError))])]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{staticClass:"form-ico-control right-ico"},[d("img",{directives:[{name:"show",rawName:"v-show",value:!e.showConfPassword,expression:"!(showConfPassword)"}],attrs:{src:o(119),alt:"eye"},on:{click:function(a){e.togggleConfPassState(!0)}}}),e._v(" "),d("img",{directives:[{name:"show",rawName:"v-show",value:e.showConfPassword,expression:"showConfPassword"}],attrs:{src:o(118),alt:"eye-cross"},on:{click:function(a){e.togggleConfPassState(!1)}}}),e._v(" "),d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.confirmPassword,expression:"user.confirmPassword"}],staticClass:"alt-form-control",attrs:{type:"password",placeholder:"Confirm Password",id:"accedit-conf-pass"},domProps:{value:e.user.confirmPassword},on:{input:function(a){a.target.composing||e.$set(e.user,"confirmPassword",a.target.value)}}})]),e._v(" "),d("p",{directives:[{name:"show",rawName:"v-show",value:e.confPasswordError,expression:"confPasswordError"}]},[e._v(e._s(e.confPasswordError))])]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{staticClass:"form-group"},[d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.login,expression:"user.login"}],staticClass:"alt-form-control",attrs:{type:"text",placeholder:"Email Address",disabled:"true"},domProps:{value:e.user.login},on:{input:function(a){a.target.composing||e.$set(e.user,"login",a.target.value)}}})])]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{directives:[{name:"show",rawName:"v-show",value:e.stateStatus,expression:"stateStatus"}],staticClass:"form-group"},[d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.state,expression:"user.state"}],staticClass:"alt-form-control",attrs:{type:"text",placeholder:"State",disabled:"true"},domProps:{value:e.user.state},on:{input:function(a){a.target.composing||e.$set(e.user,"state",a.target.value)}}})])]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{staticClass:"gender"},[e._v("Gender")]),e._v(" "),d("ul",{staticClass:"gender-setting"},[d("li",{staticClass:"active-gender"},[d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.gender,expression:"user.gender"}],staticClass:"radio-btn",attrs:{type:"radio",name:"radio",id:"radio1",value:"MALE"},domProps:{checked:e._q(e.user.gender,"MALE")},on:{change:function(a){e.$set(e.user,"gender","MALE")}}}),e._v(" "),d("label",{staticClass:"altf-gender-label",attrs:{for:"radio1"}},[e._v("MALE")])]),e._v(" "),d("li",{staticClass:"active-gender"},[d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.gender,expression:"user.gender"}],staticClass:"radio-btn",attrs:{type:"radio",name:"radio",id:"radio2",value:"FEMALE"},domProps:{checked:e._q(e.user.gender,"FEMALE")},on:{change:function(a){e.$set(e.user,"gender","FEMALE")}}}),e._v(" "),d("label",{staticClass:"altf-gender-label",attrs:{for:"radio2"}},[e._v("FEMALE")])])])]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{staticClass:"input-group"},[d("select",{directives:[{name:"model",rawName:"v-model",value:e.countryCode,expression:"countryCode"}],staticClass:"country_phone_code",attrs:{name:"countryPhone",id:"countryId"},on:{change:[function(a){var o=Array.prototype.filter.call(a.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.countryCode=a.target.multiple?o:o[0]},e.changeCountryCodeCB],focus:e.codeToName}},[d("option",{staticStyle:{display:"none"},attrs:{name:"One",value:"+972"}},[e._v("+972")]),e._v(" "),e._l(e.countryPhoneCode,function(a){return d("option",{attrs:{"data-text":a.name},domProps:{value:a.dial_code}},[e._v(e._s(a.dial_code))])})],2),e._v(" "),d("input",{directives:[{name:"model",rawName:"v-model",value:e.user.phoneNumber,expression:"user.phoneNumber"}],staticClass:"input-tel form-control",attrs:{type:"tel",maxlength:"15",onkeypress:"return (event.charCode < 48 || event.charCode > 57) ? false : true;",placeholder:"Contact Number (Optional)",id:"accedit-phone"},domProps:{value:e.user.phoneNumber},on:{input:[function(a){a.target.composing||e.$set(e.user,"phoneNumber",a.target.value)},e.isPhoneNumValid],keyup:e.readInput}})]),e._v(" "),d("p",{directives:[{name:"show",rawName:"v-show",value:e.phoneNumberError,expression:"phoneNumberError"}]},[e._v(e._s(e.phoneNumberError))])]),e._v(" "),d("div",{staticClass:"form-group"},[d("div",{staticClass:"dob"},[e._v("Date of Birth")]),e._v(" "),d("select",{directives:[{name:"model",rawName:"v-model",value:e.user.dob.day,expression:"user.dob.day"}],staticClass:"day",attrs:{name:"DOBDay"},on:{change:function(a){var o=Array.prototype.filter.call(a.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(e.user.dob,"day",a.target.multiple?o:o[0])}}},[d("option",{attrs:{disabled:"true"}},[e._v("DD")]),e._v(" "),e._l(e.altRange(1,31),function(a){return d("option",{domProps:{value:a}},[e._v(e._s(a))])})],2),e._v(" "),d("select",{directives:[{name:"model",rawName:"v-model",value:e.user.dob.month,expression:"user.dob.month"}],staticClass:"month",attrs:{name:"DOBMonth"},on:{change:function(a){var o=Array.prototype.filter.call(a.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(e.user.dob,"month",a.target.multiple?o:o[0])}}},[d("option",{attrs:{disabled:"true"}},[e._v("MM")]),e._v(" "),e._l(e.monthObj,function(a){return d("option",{domProps:{value:a.index}},[e._v(e._s(a.index))])})],2),e._v(" "),d("select",{directives:[{name:"model",rawName:"v-model",value:e.user.dob.year,expression:"user.dob.year"}],staticClass:"year",attrs:{name:"DOBYear"},on:{change:function(a){var o=Array.prototype.filter.call(a.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.$set(e.user.dob,"year",a.target.multiple?o:o[0])}}},[d("option",{attrs:{disabled:"true"}},[e._v("YYYY")]),e._v(" "),e._l(e.altRange(1947,(new Date).getFullYear()-18),function(a){return d("option",{domProps:{value:a}},[e._v(e._s(a))])})],2),e._v(" "),d("p",{staticClass:"form-error"})]),e._v(" "),d("button",{staticClass:"submit-btn grad-btn btn",attrs:{type:"button"},on:{click:function(a){return a.preventDefault(),e.updateUser(a)}}},[e._v("UPDATE")])])])},staticRenderFns:[]}},118:function(e,a,o){e.exports=o.p+"eye-cross.svg"},119:function(e,a,o){e.exports=o.p+"eye.svg"},610:function(e,a,o){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var d=o(1),n=o(5),t=o(4),i=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var o=arguments[a];for(var d in o)Object.prototype.hasOwnProperty.call(o,d)&&(e[d]=o[d])}return e};a.default={data:function(){return{user:{name:"",surname:"",login:"",gender:"",password:"",confirmPassword:"",dob:{year:void 0,month:void 0,day:void 0},phoneNumber:"",state:void 0},monthObj:[{index:"01",name:"January"},{index:"02",name:"February"},{index:"03",name:"March"},{index:"04",name:"April"},{index:"05",name:"May"},{index:"06",name:"June"},{index:"07",name:"July"},{index:"08",name:"August"},{index:"09",name:"September"},{index:"10",name:"October"},{index:"11",name:"November"},{index:"12",name:"December"}],passwordError:void 0,confPasswordError:void 0,phoneNumberError:void 0,showPassword:!1,showConfPassword:!1,nameError:!1,surnameError:!1,countryCode:"+91",stateStatus:!0,countryPhoneCode:[{name:"Israel",dial_code:"+972",code:"IL"},{name:"Afghanistan",dial_code:"+93",code:"AF"},{name:"Albania",dial_code:"+355",code:"AL"},{name:"Algeria",dial_code:"+213",code:"DZ"},{name:"AmericanSamoa",dial_code:"+1 684",code:"AS"},{name:"United States",dial_code:"+1",code:"US"},{name:"Andorra",dial_code:"+376",code:"AD"},{name:"Angola",dial_code:"+244",code:"AO"},{name:"Anguilla",dial_code:"+1 264",code:"AI"},{name:"Antigua and Barbuda",dial_code:"+1268",code:"AG"},{name:"Argentina",dial_code:"+54",code:"AR"},{name:"Armenia",dial_code:"+374",code:"AM"},{name:"Aruba",dial_code:"+297",code:"AW"},{name:"Australia",dial_code:"+61",code:"AU"},{name:"Austria",dial_code:"+43",code:"AT"},{name:"Azerbaijan",dial_code:"+994",code:"AZ"},{name:"Bahamas",dial_code:"+1 242",code:"BS"},{name:"Bahrain",dial_code:"+973",code:"BH"},{name:"Bangladesh",dial_code:"+880",code:"BD"},{name:"Barbados",dial_code:"+1 246",code:"BB"},{name:"Belarus",dial_code:"+375",code:"BY"},{name:"Belgium",dial_code:"+32",code:"BE"},{name:"Belize",dial_code:"+501",code:"BZ"},{name:"Benin",dial_code:"+229",code:"BJ"},{name:"Bermuda",dial_code:"+1 441",code:"BM"},{name:"Bhutan",dial_code:"+975",code:"BT"},{name:"Bosnia and Herzegovina",dial_code:"+387",code:"BA"},{name:"Botswana",dial_code:"+267",code:"BW"},{name:"Brazil",dial_code:"+55",code:"BR"},{name:"British Indian Ocean Territory",dial_code:"+246",code:"IO"},{name:"Bulgaria",dial_code:"+359",code:"BG"},{name:"Burkina Faso",dial_code:"+226",code:"BF"},{name:"Burundi",dial_code:"+257",code:"BI"},{name:"Cambodia",dial_code:"+855",code:"KH"},{name:"Cameroon",dial_code:"+237",code:"CM"},{name:"Canada",dial_code:"+1",code:"CA"},{name:"Cape Verde",dial_code:"+238",code:"CV"},{name:"Cayman Islands",dial_code:"+ 345",code:"KY"},{name:"Central African Republic",dial_code:"+236",code:"CF"},{name:"Chad",dial_code:"+235",code:"TD"},{name:"Chile",dial_code:"+56",code:"CL"},{name:"China",dial_code:"+86",code:"CN"},{name:"Christmas Island",dial_code:"+61",code:"CX"},{name:"Colombia",dial_code:"+57",code:"CO"},{name:"Comoros",dial_code:"+269",code:"KM"},{name:"Congo",dial_code:"+242",code:"CG"},{name:"Cook Islands",dial_code:"+682",code:"CK"},{name:"Costa Rica",dial_code:"+506",code:"CR"},{name:"Croatia",dial_code:"+385",code:"HR"},{name:"Cuba",dial_code:"+53",code:"CU"},{name:"Cyprus",dial_code:"+537",code:"CY"},{name:"Czech Republic",dial_code:"+420",code:"CZ"},{name:"Denmark",dial_code:"+45",code:"DK"},{name:"Djibouti",dial_code:"+253",code:"DJ"},{name:"Dominica",dial_code:"+1 767",code:"DM"},{name:"Dominican Republic",dial_code:"+1 849",code:"DO"},{name:"Ecuador",dial_code:"+593",code:"EC"},{name:"Egypt",dial_code:"+20",code:"EG"},{name:"El Salvador",dial_code:"+503",code:"SV"},{name:"Equatorial Guinea",dial_code:"+240",code:"GQ"},{name:"Eritrea",dial_code:"+291",code:"ER"},{name:"Estonia",dial_code:"+372",code:"EE"},{name:"Ethiopia",dial_code:"+251",code:"ET"},{name:"Faroe Islands",dial_code:"+298",code:"FO"},{name:"Fiji",dial_code:"+679",code:"FJ"},{name:"Finland",dial_code:"+358",code:"FI"},{name:"France",dial_code:"+33",code:"FR"},{name:"French Guiana",dial_code:"+594",code:"GF"},{name:"French Polynesia",dial_code:"+689",code:"PF"},{name:"Gabon",dial_code:"+241",code:"GA"},{name:"Gambia",dial_code:"+220",code:"GM"},{name:"Georgia",dial_code:"+995",code:"GE"},{name:"Germany",dial_code:"+49",code:"DE"},{name:"Ghana",dial_code:"+233",code:"GH"},{name:"Gibraltar",dial_code:"+350",code:"GI"},{name:"Greece",dial_code:"+30",code:"GR"},{name:"Greenland",dial_code:"+299",code:"GL"},{name:"Grenada",dial_code:"+1 473",code:"GD"},{name:"Guadeloupe",dial_code:"+590",code:"GP"},{name:"Guam",dial_code:"+1 671",code:"GU"},{name:"Guatemala",dial_code:"+502",code:"GT"},{name:"Guinea",dial_code:"+224",code:"GN"},{name:"Guinea-Bissau",dial_code:"+245",code:"GW"},{name:"Guyana",dial_code:"+595",code:"GY"},{name:"Haiti",dial_code:"+509",code:"HT"},{name:"Honduras",dial_code:"+504",code:"HN"},{name:"Hungary",dial_code:"+36",code:"HU"},{name:"Iceland",dial_code:"+354",code:"IS"},{name:"India",dial_code:"+91",code:"IN"},{name:"Indonesia",dial_code:"+62",code:"ID"},{name:"Iraq",dial_code:"+964",code:"IQ"},{name:"Ireland",dial_code:"+353",code:"IE"},{name:"Israel",dial_code:"+972",code:"IL"},{name:"Italy",dial_code:"+39",code:"IT"},{name:"Jamaica",dial_code:"+1 876",code:"JM"},{name:"Japan",dial_code:"+81",code:"JP"},{name:"Jordan",dial_code:"+962",code:"JO"},{name:"Kazakhstan",dial_code:"+7 7",code:"KZ"},{name:"Kenya",dial_code:"+254",code:"KE"},{name:"Kiribati",dial_code:"+686",code:"KI"},{name:"Kuwait",dial_code:"+965",code:"KW"},{name:"Kyrgyzstan",dial_code:"+996",code:"KG"},{name:"Latvia",dial_code:"+371",code:"LV"},{name:"Lebanon",dial_code:"+961",code:"LB"},{name:"Lesotho",dial_code:"+266",code:"LS"},{name:"Liberia",dial_code:"+231",code:"LR"},{name:"Liechtenstein",dial_code:"+423",code:"LI"},{name:"Lithuania",dial_code:"+370",code:"LT"},{name:"Luxembourg",dial_code:"+352",code:"LU"},{name:"Madagascar",dial_code:"+261",code:"MG"},{name:"Malawi",dial_code:"+265",code:"MW"},{name:"Malaysia",dial_code:"+60",code:"MY"},{name:"Maldives",dial_code:"+960",code:"MV"},{name:"Mali",dial_code:"+223",code:"ML"},{name:"Malta",dial_code:"+356",code:"MT"},{name:"Marshall Islands",dial_code:"+692",code:"MH"},{name:"Martinique",dial_code:"+596",code:"MQ"},{name:"Mauritania",dial_code:"+222",code:"MR"},{name:"Mauritius",dial_code:"+230",code:"MU"},{name:"Mayotte",dial_code:"+262",code:"YT"},{name:"Mexico",dial_code:"+52",code:"MX"},{name:"Monaco",dial_code:"+377",code:"MC"},{name:"Mongolia",dial_code:"+976",code:"MN"},{name:"Montenegro",dial_code:"+382",code:"ME"},{name:"Montserrat",dial_code:"+1664",code:"MS"},{name:"Morocco",dial_code:"+212",code:"MA"},{name:"Myanmar",dial_code:"+95",code:"MM"},{name:"Namibia",dial_code:"+264",code:"NA"},{name:"Nauru",dial_code:"+674",code:"NR"},{name:"Nepal",dial_code:"+977",code:"NP"},{name:"Netherlands",dial_code:"+31",code:"NL"},{name:"Netherlands Antilles",dial_code:"+599",code:"AN"},{name:"New Caledonia",dial_code:"+687",code:"NC"},{name:"New Zealand",dial_code:"+64",code:"NZ"},{name:"Nicaragua",dial_code:"+505",code:"NI"},{name:"Niger",dial_code:"+227",code:"NE"},{name:"Nigeria",dial_code:"+234",code:"NG"},{name:"Niue",dial_code:"+683",code:"NU"},{name:"Norfolk Island",dial_code:"+672",code:"NF"},{name:"Northern Mariana Islands",dial_code:"+1 670",code:"MP"},{name:"Norway",dial_code:"+47",code:"NO"},{name:"Oman",dial_code:"+968",code:"OM"},{name:"Pakistan",dial_code:"+92",code:"PK"},{name:"Palau",dial_code:"+680",code:"PW"},{name:"Panama",dial_code:"+507",code:"PA"},{name:"Papua New Guinea",dial_code:"+675",code:"PG"},{name:"Paraguay",dial_code:"+595",code:"PY"},{name:"Peru",dial_code:"+51",code:"PE"},{name:"Philippines",dial_code:"+63",code:"PH"},{name:"Poland",dial_code:"+48",code:"PL"},{name:"Portugal",dial_code:"+351",code:"PT"},{name:"Puerto Rico",dial_code:"+1 939",code:"PR"},{name:"Qatar",dial_code:"+974",code:"QA"},{name:"Romania",dial_code:"+40",code:"RO"},{name:"Rwanda",dial_code:"+250",code:"RW"},{name:"Samoa",dial_code:"+685",code:"WS"},{name:"San Marino",dial_code:"+378",code:"SM"},{name:"Saudi Arabia",dial_code:"+966",code:"SA"},{name:"Senegal",dial_code:"+221",code:"SN"},{name:"Serbia",dial_code:"+381",code:"RS"},{name:"Seychelles",dial_code:"+248",code:"SC"},{name:"Sierra Leone",dial_code:"+232",code:"SL"},{name:"Singapore",dial_code:"+65",code:"SG"},{name:"Slovakia",dial_code:"+421",code:"SK"},{name:"Slovenia",dial_code:"+386",code:"SI"},{name:"Solomon Islands",dial_code:"+677",code:"SB"},{name:"South Africa",dial_code:"+27",code:"ZA"},{name:"South Georgia and the South Sandwich Islands",dial_code:"+500",code:"GS"},{name:"Spain",dial_code:"+34",code:"ES"},{name:"Sri Lanka",dial_code:"+94",code:"LK"},{name:"Sudan",dial_code:"+249",code:"SD"},{name:"Suriname",dial_code:"+597",code:"SR"},{name:"Swaziland",dial_code:"+268",code:"SZ"},{name:"Sweden",dial_code:"+46",code:"SE"},{name:"Switzerland",dial_code:"+41",code:"CH"},{name:"Tajikistan",dial_code:"+992",code:"TJ"},{name:"Thailand",dial_code:"+66",code:"TH"},{name:"Togo",dial_code:"+228",code:"TG"},{name:"Tokelau",dial_code:"+690",code:"TK"},{name:"Tonga",dial_code:"+676",code:"TO"},{name:"Trinidad and Tobago",dial_code:"+1 868",code:"TT"},{name:"Tunisia",dial_code:"+216",code:"TN"},{name:"Turkey",dial_code:"+90",code:"TR"},{name:"Turkmenistan",dial_code:"+993",code:"TM"},{name:"Turks and Caicos Islands",dial_code:"+1 649",code:"TC"},{name:"Tuvalu",dial_code:"+688",code:"TV"},{name:"Uganda",dial_code:"+256",code:"UG"},{name:"Ukraine",dial_code:"+380",code:"UA"},{name:"United Arab Emirates",dial_code:"+971",code:"AE"},{name:"United Kingdom",dial_code:"+44",code:"GB"},{name:"Uruguay",dial_code:"+598",code:"UY"},{name:"Uzbekistan",dial_code:"+998",code:"UZ"},{name:"Vanuatu",dial_code:"+678",code:"VU"},{name:"Wallis and Futuna",dial_code:"+681",code:"WF"},{name:"Yemen",dial_code:"+967",code:"YE"},{name:"Zambia",dial_code:"+260",code:"ZM"},{name:"Zimbabwe",dial_code:"+263",code:"ZW"},{name:"land Islands",dial_code:"+358",code:"AX"},{name:"Antarctica",dial_code:"+672",code:"AQ"},{name:"Bolivia, Plurinational State of",dial_code:"+591",code:"BO"},{name:"Brunei Darussalam",dial_code:"+673",code:"BN"},{name:"Cocos (Keeling) Islands",dial_code:"+61",code:"CC"},{name:"Congo, The Democratic Republic of the",dial_code:"+243",code:"CD"},{name:"Cote d'Ivoire",dial_code:"+225",code:"CI"},{name:"Falkland Islands (Malvinas)",dial_code:"+500",code:"FK"},{name:"Guernsey",dial_code:"+44",code:"GG"},{name:"Holy See (Vatican City State)",dial_code:"+379",code:"VA"},{name:"Hong Kong",dial_code:"+852",code:"HK"},{name:"Iran, Islamic Republic of",dial_code:"+98",code:"IR"},{name:"Isle of Man",dial_code:"+44",code:"IM"},{name:"Jersey",dial_code:"+44",code:"JE"},{name:"Korea, Democratic People's Republic of",dial_code:"+850",code:"KP"},{name:"Korea, Republic of",dial_code:"+82",code:"KR"},{name:"Lao People's Democratic Republic",dial_code:"+856",code:"LA"},{name:"Libyan Arab Jamahiriya",dial_code:"+218",code:"LY"},{name:"Macao",dial_code:"+853",code:"MO"},{name:"Macedonia, The Former Yugoslav Republic of",dial_code:"+389",code:"MK"},{name:"Micronesia, Federated States of",dial_code:"+691",code:"FM"},{name:"Moldova, Republic of",dial_code:"+373",code:"MD"},{name:"Mozambique",dial_code:"+258",code:"MZ"},{name:"Palestinian Territory, Occupied",dial_code:"+970",code:"PS"},{name:"Pitcairn",dial_code:"+872",code:"PN"},{name:"Réunion",dial_code:"+262",code:"RE"},{name:"Russia",dial_code:"+7",code:"RU"},{name:"Saint Barthélemy",dial_code:"+590",code:"BL"},{name:"Saint Helena, Ascension and Tristan Da Cunha",dial_code:"+290",code:"SH"},{name:"Saint Kitts and Nevis",dial_code:"+1 869",code:"KN"},{name:"Saint Lucia",dial_code:"+1 758",code:"LC"},{name:"Saint Martin",dial_code:"+590",code:"MF"},{name:"Saint Pierre and Miquelon",dial_code:"+508",code:"PM"},{name:"Saint Vincent and the Grenadines",dial_code:"+1 784",code:"VC"},{name:"Sao Tome and Principe",dial_code:"+239",code:"ST"},{name:"Somalia",dial_code:"+252",code:"SO"},{name:"Svalbard and Jan Mayen",dial_code:"+47",code:"SJ"},{name:"Syrian Arab Republic",dial_code:"+963",code:"SY"},{name:"Taiwan, Province of China",dial_code:"+886",code:"TW"},{name:"Tanzania, United Republic of",dial_code:"+255",code:"TZ"},{name:"Timor-Leste",dial_code:"+670",code:"TL"},{name:"Venezuela, Bolivarian Republic of",dial_code:"+58",code:"VE"},{name:"Viet Nam",dial_code:"+84",code:"VN"},{name:"Virgin Islands, British",dial_code:"+1 284",code:"VG"},{name:"Virgin Islands, U.S.",dial_code:"+1 340",code:"VI"}]}},computed:i({},o.i(t.a)(["userProfile"])),methods:i({},o.i(t.b)(["setEditProfileMode"]),o.i(t.c)(["actGetUpdateUser"]),{updateUser:function(){var e=this;if(this.isUpdateFormValid()){this.toggleLoader(!0);var a={details:{}};a.name=this.user.name,this.user.name?(localStorage.setItem("user_name",this.user.name),d.eventBus.$emit("changeHumburgerName",this.user.name)):d.eventBus.$emit("changeHumburgerName","Welcome!"),this.user.password&&(a.password=this.user.password),this.user.phoneNumber&&(a.phoneNumber=this.user.phoneNumber?this.countryCode+"-"+this.user.phoneNumber:"",a.phone_number=this.user.phoneNumber?this.countryCode+"-"+this.user.phoneNumber:"",a.dial_code=this.countryCode),a.details.gender=this.user.gender,a.details.birthday=this.user.dob.year+"-"+this.user.dob.month+"-"+this.user.dob.day;var o=JSON.parse(localStorage.getItem("altAccount")),n=JSON.parse(localStorage.getItem("altUser"));a.Account_Id=n.accountId,a.Profile_Id=String(o.profile.id);var n=void 0,o=void 0;localStorage.getItem("altUser")&&(n=JSON.parse(localStorage.getItem("altUser")),localStorage.getItem("altAccount")&&(o=JSON.parse(localStorage.getItem("altAccount")))),this.actGetUpdateUser(a).then(function(o){if(o.status&&"ok"==o.status){if(a.password){if(window.mobileAnalyticsClient){var d=e.getAWSMACommonAttributes();window.mobileAnalyticsClient.recordEvent("_user.change_password",d,{})}}else if(window.mobileAnalyticsClient){var d=e.getAWSMACommonAttributes();d.user_name=a&&a.name?a.name:"N.A",d.user_dob=a&&a.details&&a.details.birthday?a.details.birthday:"N.A",d.user_gender=a&&a.details&&a.details.gender?a.details.gender:"N.A",window.mobileAnalyticsClient.recordEvent("_user.update_profile",d,{})}e.setEditProfileMode(!1),e.toggleLoader(!1)}},function(o){if(a.password){if(window.mobileAnalyticsClient){var d=e.getAWSMACommonAttributes();d.eventAction="error",d.eventMessage=o.message,d.eventCode=o.code.toString(),window.mobileAnalyticsClient.recordEvent("_user.change_password",d,{})}}else if(window.mobileAnalyticsClient){var d=e.getAWSMACommonAttributes();d.eventAction="error",d.eventMessage=o.message,d.eventCode=o.code.toString(),window.mobileAnalyticsClient.recordEvent("_user.update_profile",d,{})}})}},changeCountryCodeCB:function(){document.getElementById("countryId").getElementsByTagName("option")[0].value=document.getElementById("countryId").value,document.getElementById("countryId").getElementsByTagName("option")[0].innerHTML=document.getElementById("countryId").value,document.getElementById("countryId").selectedIndex="0"},readInput:function(e){13==e.keyCode&&document.getElementById("accedit-phone").blur()},codeToName:function(){for(var e=document.getElementById("countryId"),a=e.getElementsByTagName("option"),o=0;o<a.length;o++)a[o].innerHTML=a[o].getAttribute("data-text");e.blur(),document.getElementById("countryId").getElementsByTagName("option")[0].value=document.getElementById("countryId").value,document.getElementById("countryId").getElementsByTagName("option")[0].innerHTML=document.getElementById("countryId").value,document.getElementById("countryId").selectedIndex="0"},nameToCode:function(){for(var e=document.getElementById("countryId"),a=e.getElementsByTagName("option"),o=0;o<a.length;o++)a[o].innerHTML=a[o].getAttribute("value");e.blur()},mouseLeave:function(){},isUpdateFormValid:function(){return!!(this.isPasswordValid()&&this.isConfPasswordValid()&&this.isPhoneNumValid())},isPasswordValid:function(){return document.getElementById("accedit-pass").value&&document.getElementById("accedit-pass").value.toString().length<8?(this.passwordError="Password must contain atlease 8 characters",!1):(this.passwordError=!1,!0)},isConfPasswordValid:function(){return document.getElementById("accedit-conf-pass").value!=document.getElementById("accedit-pass").value?(this.confPasswordError="passwords not matching",!1):(this.confPasswordError=!1,!0)},isPhoneNumValid:function(){var e=document.getElementById("accedit-phone").value,a=/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?a-zA-Z]/;return"+91"==this.countryCode?0!=e.length&&10!=e.length?(this.phoneNumberError="Not a valid phone number",!1):a.test(e)?(this.phoneNumberError="Not a valid phone number",!1):(this.phoneNumberError=!1,!0):0!=e.length&&e.length<4||e.length>=14?(this.phoneNumberError="Not a valid phone number",!1):a.test(e)?(this.phoneNumberError="Not a valid phone number",!1):(this.phoneNumberError=!1,!0)},togglePasswordState:function(e){this.showPassword=e,this.showPassword?document.getElementById("accedit-pass").type="text":document.getElementById("accedit-pass").type="password"},togggleConfPassState:function(e){this.showConfPassword=e,this.showConfPassword?document.getElementById("accedit-conf-pass").type="text":document.getElementById("accedit-conf-pass").type="password"},filterDob:function(e){var a=e.split("-");if(a&&a.length){var o=void 0,d=void 0;return 4==a[0].length?(o=0,d=2):(d=0,o=2),{year:a[o],month:1==a[1].toString().length?"0"+a[1]:a[1],day:1==a[d].toString().length?"0"+a[d]:a[d]}}return""},stuffCommonAttributes:function(){var e={},a=localStorage.getItem("geo_location"),o=JSON.parse(localStorage.getItem("altConfig"));return a&&(a=JSON.parse(a),e=a),e.user_email=localStorage.getItem("user_email"),e.user_id=localStorage.getItem("account_id"),e.user_session=localStorage.getItem("token"),e.user_name=localStorage.getItem("user_name"),e.user_dob=localStorage.getItem("user_birthday"),e.user_gender=localStorage.getItem("user_gender"),e.app_env=o.environment.title,e},stuffChngPassSucAttributes:function(){return this.stuffCommonAttributes()},stuffUpdateProfileSucAttributes:function(){return this.stuffCommonAttributes()},stuffUpdatePassFailAttributes:function(e){var a={};return a=this.stuffCommonAttributes(),a.event_action=e.eventAction,a.event_message=e.eventMessage,a.event_code=e.eventCode,a},stuffUpdateProfileFailAttributes:function(e){var a={};return a=this.stuffCommonAttributes(),a.event_action="error",a.event_message=error.message,a.event_code=error.code.toString(),a}}),mounted:function(){},created:function(){if(this.userProfile){if(localStorage.getItem("homeDomain")&&"row"==localStorage.getItem("homeDomain")&&(this.stateStatus=!1),this.user.name=this.userProfile.name?this.userProfile.name:"",this.user.surname=this.userProfile.surname?this.userProfile.surname:"",this.user.login=this.userProfile.login?this.userProfile.login:"",this.user.gender=this.userProfile.details&&this.userProfile.details.gender?this.userProfile.details.gender.toUpperCase():"MALE",this.userProfile.details&&this.userProfile.details.birthday){var e=this.filterDob(this.userProfile.details.birthday),a=parseInt(e.year);if(isNaN(a))return void(this.user.dob={year:"1947",month:"01",day:"01"});this.user.dob={year:e.year,month:e.month,day:e.day}}if(this.user.state=this.userProfile.details?this.userProfile.details.state:"",this.userProfile.phone_number){var o=this.userProfile.phone_number.split("-"),d=(o[0],o[1],void 0);o&&2==o.length?(this.countryCode=o[0],d=o[1]):(this.countryCode=o[0],d=""),this.user.phoneNumber=this.userProfile.phone_number?d:""}else{var n=void 0;localStorage.getItem("altGeoData")&&(n=JSON.parse(localStorage.getItem("altGeoData")));for(var t in this.countryPhoneCode)this.countryPhoneCode[t].name==n.country.names.en&&(this.countryCode=this.countryPhoneCode[t].dial_code)}}},mixins:[n.a]}},876:function(e,a,o){var d=o(77)(o(610),o(1031),null,null,null);e.exports=d.exports}});