<template>
    <div class="ch-state-slct alt-popup-bg dark-bg" id="ch-state-slct">
        <div class="popup-box">
            <div class="popup-bg state-popup">
                <div class="form-group">
                    <h4>Please select your state to comply with GST(Mandatory requirement for uninterupted service)</h4>
                </div>
                <div class="form-group">
                    <select class="slct-control" v-model="selectedState">
                        <option v-for="state in statesObj" :value="state">{{state}}</option>
                    </select>
                </div>
                <button type="button" class="btn grad-btn btn-lg" @click="updateState">UPDATE</button>
            </div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            statesObj:
            {
                "AP":"Andhra Pradesh", "AR":"Arunachal Pradesh", "AS":"Assam", "BR":"Bihar", "CG":"Chhattisgarh", "Chandigarh":"Chandigarh", "DN":"Dadra and Nagar Haveli", "DD":"Daman and Diu", "DL":"Delhi", "GA":"Goa", "GJ":"Gujarat", "HR":"Haryana", "HP":"Himachal Pradesh", "JK":"Jammu and Kashmir", "JH":"Jharkhand", "KA":"Karnataka", "KL":"Kerala", "MP":"Madhya Pradesh", "MH":"Maharashtra", "MN":"Manipur", "ML":"Meghalaya", "MZ":"Mizoram", "NL":"Nagaland", "OR":"Orissa", "PB":"Punjab", "PY":"Pondicherry", "RJ":"Rajasthan", "SK":"Sikkim", "TN":"Tamil Nadu", "TR":"Tripura", "UP":"Uttar Pradesh", "UK":"Uttarakhand", "WB":"West Bengal"
            },
            selectedState: 'Select State',
        };
    },
    methods: {
        updateState() {
            if(this.selectedState != "Select State")
            eventBus.$emit('updateStateEvent', this.selectedState);
        }
    },
}
</script>
