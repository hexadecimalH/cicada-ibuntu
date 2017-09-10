/**
 * Created by haris on 7.6.17.
 */
import axios from 'axios';

import Vue from 'vue';
import {tabset,tabs, tab, radio, alert} from 'vue-strap';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var Registartion = new Vue({
    el: '#root',
    components: {
        tabset,
        tabs,
        tab,
        radio,
        alert
    },
    data: {
        activeTab:0,
        name: '',
        surname:'',
        email:'',
        password: '',
        passwordClass:'form-group',
        rePassword:'',
        university:'',
        faculty:'',
        department:'',
        errorMsg:'Sorry the picture has NOT been uploaded succesfully please try again or contact support',
        image:'/uploads/chunk/avatar.png',
        imageUrl:'/uploads/chunk/avatar.png',
        universities:[],
        faculties:[],
        departments:[],
        showTop:false
    },
    computed: {
        passMatch(){
            if(this.passwordClass == "form-group has-success"){
                return true;
            }
            return false;
        }
    },
    methods: {
        checkEquality(pass, val){
            if(pass === val){
                this.passwordClass = "form-group has-success"
            }
            else{
                this.passwordClass = "form-group has-error"
            }
        },
        toFirstTab(event){
            event.preventDefault();
            this.activeTab = 0;
        },
        uploadImage(event){
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            let file = event.target.files[0];
            let data = new FormData();
            data.append('image',file);
            axios.post('/image', data, config).then(response => {
                this.image = response.data;
                this.imageUrl = response.data;
            }).catch( error => {
                this.showAlertWithCustomMessage("Image failed to Upload please refresh the page and try again");
            })
        },
        getUniversities(){
            axios.get('/professor/university/all').then(response => {
                this.universities = response.data;
                this.universities.forEach( university => {
                    university.faculty.forEach( faculty => {
                        this.faculties.push(faculty);
                        faculty.department.forEach( department => {
                            this.departments.push(department);
                        });
                    });
                });
            }).catch( error => {
                this.showAlertWithCustomMessage("Error loading Universities " +error.message);
            });
        },
        nextTab(event){
            event.preventDefault();
            this.$validator.validateAll({
                name: this.name,
                email: this.email,
                surname:this.surname,
                password:this.password
            }).then( response =>{
                this.activeTab = 1;
                let mail = this.email;
                this.emailExists(mail);
            }).catch(error => {
                this.showAlertWithCustomMessage("Please fill out with correct data ");
            });
        },
        emailExists(email){
            let data = new FormData();
            data.append('email', email);
            axios.post('/user/email', data, [])
                .then( response => {

                })
                .catch( error => {
                    this.activeTab = 0;
                    this.showAlertWithCustomMessage(" User with e-mail " + email + " allready exists");
                });

        },
        submitData(event){
            event.preventDefault();
            this.$validator.validateAll({
                university:this.university,
                faculty:this.faculty,
                department:this.department
            }).then( response =>{
                this.sendDataToDb();
            }).catch(error =>{
                this.showAlertWithCustomMessage("Validation failed please re-check your data and try submiting");
            })
        },
        sendDataToDb(){
            let data = new FormData();
            data.append('image_url', this.imageUrl);
            data.append('user_name', this.name);
            data.append('user_surname', this.surname);
            data.append('user_email', this.email);
            data.append('gender', this.gender);
            data.append('password', this.password);
            data.append('university', this.university);
            data.append('faculty', this.faculty);
            data.append('department', this.department);
            data.append('type', "student");

            axios.post('/user/create', data, []).then( response => {
                $('#email').val(response.data.email);
                $('#password').val(this.password);
                $('#hiddenFormSubmit').submit();
            }).catch( error => {
                this.showAlertWithCustomMessage(error.message);
            })
        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        },
        showAlertWithCustomMessage(message){
            this.showTop = true;
            this.setAlertToFalse();
            this.errorMsg = message;
        },
        getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        getUserVendorData(email){
            axios.get('/session/'+email).then( response => {
                this.imageUrl = response.data.picture;
                this.image = response.data.picture;
                this.name = response.data.first_name;
                this.surname = response.data.last_name;
                this.email = response.data.email;
            }).catch( error => {
                this.showAlertWithCustomMessage(error.message);
            });
        }
    },
    beforeMount(){
        this.getUniversities();

    },
    mounted(){
        var email = this.getParameterByName('email',window.location);

        if(email !== null){
            this.getUserVendorData();
        }

    },
    watch:{
        password:function(val,oldVal){
            if(this.rePassword !== ""){
                this.checkEquality(this.rePassword, val);
            }
        },
        rePassword:function(val,oldVal){
            this.checkEquality(this.password, val);
        }
    },
    delimiters: ['${', '}']
});

export { Registartion as default }