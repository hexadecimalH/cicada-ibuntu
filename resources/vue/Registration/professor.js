import axios from 'axios';
import Vue from 'vue';
import { tabset,tabs, tab, radio,alert} from 'vue-strap';

import UniversityComponent from './InstitutionComponents/university';
import FacultyComponent from './InstitutionComponents/faculty';
import DepartmentComponent from './InstitutionComponents/department';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);


var Registartion = new Vue({
    el: '#root',
    components: {
        UniversityComponent,
        FacultyComponent,
        DepartmentComponent,
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
        gender:'',
        university:'',
        department:'',
        faculty:'',
        errorMsg:'Sorry the picture has NOT been uploaded succesfully please try again or contact support',
        rePassword:'',
        buttonHref:'#profile',
        input: '#hello',
        labelClass: "form-group",
        image:'/uploads/chunk/avatar.png',
        imageUrl:'/uploads/chunk/avatar.png',
        faculties:[],
        departments:[],
        universities:[],
        userEmail:'',
        showTop:false,
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
        uploadImage(event){
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            let file = event.target.files[0];
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
        toFirstTab(event){
            event.preventDefault();
            this.activeTab = 0;
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
            });
        },
        storeUserInformation(){
            let data = new FormData();
            data.append('image_url', this.imageUrl);
            data.append('user_name', this.name );
            data.append('user_surname', this.surname);
            data.append('user_email', this.email );
            data.append('type', "professor");

            axios.post('/user/create', data, []).then( response => {
                this.userId = response.data.id;
                this.userEmail = response.data.email;
            }).catch( error => {
                this.errorMsg = error.message;
                this.showTop = true;
                this.setAlertToFalse();
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
                let mail = this.email;
                this.emailExists(mail);
                return false;
            }).catch(error => {
                console.log(error);
                this.showTop = true;

                this.setAlertToFalse();
                this.errorMsg = "Please fill out with correct data ";
                return false;
            });
            return false;
        },
        emailExists(email){
            let data = new FormData();
            data.append('email', email);
            axios.post('/user/email', data, [])
                .then( response => {

                })
                .catch( error => {
                    this.activeTab = 0;
                    this.showTop = true;
                    this.setAlertToFalse();
                    this.errorMsg = " User with e-mail " + email + " allready exists"
                });

        },
        submitData(event){
            event.preventDefault();
            this.$validator.validateAll({
                university:this.university,
                faculty:this.faculty,
                department:this.department
            }).then( response => {
                console.log('valid');
                this.sendDataToDb();
            }).catch(error =>{
                console.log('not valid');
                this.showTop = true;
                this.setAlertToFalse();
                return false;
            })
        },
        sendDataToDb(){
            var data = new FormData();
            data.append('image_url', this.imageUrl);
            data.append('user_name', this.name );
            data.append('user_surname', this.surname);
            data.append('user_email', this.email );
            data.append('password', this.password)
            data.append('type', "professor");
            data.append('university', this.university);
            data.append('faculty', this.faculty);
            data.append('department', this.department);

            axios.post('/user/create', data, []).then( response => {
                $('#email').val(response.data.email);
                $('#password').val(this.password);
                $('#hiddenFormSubmit').submit();
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })
        },
        showAlertWithCustomMessage(message){
            this.showTop = true;
            this.setAlertToFalse();
            this.errorMsg = message;
        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
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
        this.showTop = false;
    },
    mounted(){
        var email = this.getParameterByName('email',window.location);

        if(email !== null){
            this.getUserVendorData();
        }

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