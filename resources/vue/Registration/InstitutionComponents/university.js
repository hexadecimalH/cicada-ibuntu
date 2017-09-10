/**
 * Created by haris on 23.7.17.
 */

import axios from 'axios';
import Vue from 'vue';

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

var UniversityComponent = Vue.component('university',{

    template:
        `<div class="modal-content">
            <div class="modal-header" >
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h2 class="modal-title">Create University</h2>
            </div>
            <div class="modal-body">
                <form action="" class="form-horizontal">
                    <div :class=" { 'form-group': true , 'form-group has-error' : errors.has('university_name')}">
                        <label for="focusedinput" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control1" id="focusedinput" v-model="university_name" data-vv-name="university_name" v-validate="'required|alpha_spaces'" placeholder="University Offical Name" >
                        </div>
                    </div>
                    <div :class=" {'form-group': true , 'form-group has-error' : errors.has('university_address')}">
                        <label for="focusedinput" class="col-sm-2 control-label">Address</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control1" id="focusedinput" v-model="university_address" data-vv-name="university_address" v-validate="'required|alpha_spaces'" placeholder="University Registered Addres" >
                        </div>
                    </div>
                    <div :class=" {'form-group': true , 'form-group has-error' : errors.has('university_city')}">
                        <label for="focusedinput" class="col-sm-2 control-label">City</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control1" id="focusedinput" v-model="university_city" data-vv-name="university_city" v-validate="'required|alpha_spaces'" placeholder="City" >
                        </div>
                    </div>
                    <div :class=" {'form-group': true , 'form-group has-error' : errors.has('university_country')}">
                        <label for="focusedinput" class="col-sm-2 control-label">Country</label>
                        <div class="col-sm-8">
                            <select name="university_country" v-model="university_country" id="selector1" data-vv-name="university_country" v-validate="'required|alpha_spaces'" class="form-control1" >
                                <option value="">Click to pick</option>
                                <option value="macedonia">Macedonia</option>
                                <option value="albania">Albania</option>
                                <option value="serbia">Serbia</option>
                                <option value="kosovo">Kosovo</option>
                            </select>
                        </div>
                    </div>
                    <div :class=" {'form-group': true , 'form-group has-error' : errors.has('university_email')}">
                        <label for="focusedinput" class="col-sm-2 control-label">Email</label>
                        <div class="col-sm-8">
                            <input type="email" class="form-control1" id="focusedinput" v-model="university_email" data-vv-name="university_email" v-validate="'required|email'" placeholder="uni@uni.edu.*" >
                        </div>
                    </div>
                    <div :class=" {'form-group': true , 'form-group has-error' : errors.has('university_site')}">
                        <label for="focusedinput" class="col-sm-2 control-label">University Website</label>
                        <div class="col-sm-8">
                            <input type="url" class="form-control1" id="focusedinput" v-model="university_site" data-vv-name="university_site" v-validate="'required|url'" placeholder="www.uni.edu.*" >
                        </div>
                    </div>
                </form>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Dismiss</button>
                <button type="button" class="btn btn-primary" @click='registerUniversity' >Create</button>
            </div>
        </div>`,
    data:function(){
        return {
            university_name:'',
            university_email:'',
            university_number:'',
            university_city:'',
            university_address:'',
            university_country:'',
            university_mail:'',
            university_site:'',
        }
    },
    methods:{
        registerUniversity:function(){
            this.$validator.validateAll({
                university_name: this.university_name,
                university_address: this.university_address,
                university_city: this.university_city,
                university_country: this.university_country,
                university_email: this.university_email,
                university_site: this.university_site
            }).then(response => {
                this.sendUniversityData();
            }).catch(error => {
                this.$parent.showAlertWithCustomMessage("Invalid data");
            });
        },
        sendUniversityData() {
            let data = new FormData();
            data.append('university_name', this.university_name);
            data.append('university_address', this.university_address);
            data.append('university_country', this.university_country);
            data.append('university_city', this.university_city);
            data.append('university_site', this.university_site);
            data.append('university_email', this.university_email);

            axios.post('/professor/university', data, []).then(response => {
                this.$parent.universities.push(response.data);
                this.university_name = "";
                this.university_address = "";
                this.university_country = "";
                this.university_city = "";
                this.university_site = "";
                this.university_email = "";
                $("#universityModal").modal('hide');
            }).catch(error => {
                // implment Error message showing
                this.$parent.showAlertWithCustomMessage("InstitutionComponents not succefully created");
            })
        }
    }
});
export {UniversityComponent as default};