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
        rePasswordClass:'form-group',
        errorMsg:'Sorry the picture has NOT been uploaded succesfully please try again or contact support',
        image:'/uploads/chunk/avatar.png',
        imageUrl:'/uploads/chunk/avatar.png',
        universities:[],
        faculties:[],
        departments:[],
        userId:'',
        userEmail:'',
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
            if(pass == val){
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
            }
            var file = event.target.files[0];
            let data = new FormData();
            data.append('image',file);
            axios.post('/professor/image',data,config).then(response => {
                this.image = response.data;
                this.imageUrl = response.data;
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
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
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        storeUserInformation(){
            let data = new FormData();
            data.append('image_url', this.imageUrl);
            data.append('user_name', this.name);
            data.append('user_surname', this.surname);
            data.append('user_email', this.email);
            data.append('gender', this.gender);
            data.append('type', "student");

            axios.post('/user/create', data, []).then( response => {
                this.userId = response.data.id;
                this.userEmail = response.data.email;
                console.log(response);
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
                this.activeTab = 0;
            })
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
                console.log('auth')
                this.storeUserInformation();
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = "Please fill out with correct data ";
            });
        },
        submitData(event){
            event.preventDefault();
            this.$validator.validateAll({
                university:this.university,
                faculty:this.faculty,
                department:this.department
            }).then( response =>{
                console.log('valid');
                this.sendDataToDb();
            }).catch(error =>{
                this.showTop = true;
                this.setAlertToFalse();
            })
        },
        sendDataToDb(){
            let data = new FormData();
            data.append('university', this.university);
            data.append('faculty', this.faculty);
            data.append('department', this.department);
            data.append('user_id', this.userId);
            data.append('type', "student");
            axios.post('/academic/create', data, []).then( response => {
                this.userEmail = response.data.email;
                console.log(response);
                $('#hiddenFormSubmit').submit();
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })
        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        }
    },
    beforeMount(){
        this.getUniversities();
    },
    watch:{
        password:function(val,oldVal){
            if(this.rePassword != ""){
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