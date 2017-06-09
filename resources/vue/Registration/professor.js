import axios from 'axios';
import Vue from 'vue';
import {tabset,tabs, tab, radio} from 'vue-strap';

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);
var Registartion = new Vue({
    el: '#root',
    components: {
        tabset,
        tabs,
        tab,
        radio
    },
    data: {
        activeTab:1,
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
        university_name:'',
        university_email:'',
        university_number:'',
        university_city:'',
        university_address:'',
        university_country:'',
        university_mail:'',
        university_site:'',
        universities:[],
        rePassword:'',
        buttonHref:'#profile',
        input: '#hello',
        labelClass: "form-group",
        image:'/uploads/chunk/avatar.png',
        imageUrl:'/uploads/chunk/avatar.png',
        facultyBelongsToUniversity:'',
        facultyName:'',
        facultyBranch:'',
        facultyInfo:'',
        faculties:[],
        departmentBelongsToUniversity:'',
        departmentBelongsToFaculty:'',
        departmentName:'',
        departmentInfo:'',
        departments:[],
        userId:'',
        userEmail:''
    },
    computed: {

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
                $('#failModal').modal("show");
            })
        },
        toFirstTab(event){
            event.preventDefault();
            this.activeTab = 0;
        },
        registerUniversity(){
            this.$validator.validateAll({
                university_name:this.university_name,
                university_address:this.university_address,
                university_city:this.university_city,
                university_country:this.university_country,
                university_email:this.university_email,
                university_site:this.university_site
            }).then( response => {
                console.log('valid');
                this.sendUniversityData();
            }).catch(error => {
                console.log('not valid')
            });
        },
        registerFaculty(){
            this.$validator.validateAll({
                facultyBelongsToUniversity:this.facultyBelongsToUniversity,
                facultyName:this.facultyName,
            }).then( response => {
                console.log('valid');
                this.sendFacultyData();
            }).catch(error => {
                console.log('not valid')
            });
        },
        registerDepartment(){
            this.$validator.validateAll({
                departmentBelongsToFaculty:this.departmentBelongsToFaculty,
                departmentBelongsToUniversity:this.departmentBelongsToUniversity,
                departmentName:this.departmentName
            }).then( response => {
                console.log('valid');
                this.sendDepartmentData();
            }).catch(error => {
                console.log('not valid')
            });
        },
        sendFacultyData(){
            let data = new FormData();
            data.append('university_id',this.facultyBelongsToUniversity);
            data.append('faculty_name',this.facultyName);
            data.append('faculty_branch',this.facultyBranch);
            data.append('faculty_info',this.facultyInfo);

            axios.post('/professor/faculty', data, []).then( response =>{
                this.faculties.push(response.data);
                this.facultyBelongsToUniversity = "";
                this.facultyName = "";
                this.facultyBranch = "";
                this.facultyInfo = "";
                $('#facultyModal').modal('hide');
            }).catch( error => {
                console.log(error);
                $('#failModal').modal("show");
            });
        },
        sendDepartmentData(){
            let data = new FormData();

            data.append('department_name', this.departmentName);
            data.append('university_id', this.departmentBelongsToUniversity);
            data.append('faculty_id', this.departmentBelongsToFaculty);
            data.append('department_info', this.departmentInfo);

            axios.post('/professor/department', data, []).then( response => {
                this.departments.push(response.data);
                this.departmentName = "";
                this.departmentBelongsToUniversity = "";
                this.departmentBelongsToFaculty = "";
                this.departmentInfo = "";
                $('#departmentModal').modal('hide');

            }).catch( error => {
                console.log(error);
                $("#failModal").modal('show');
            });
        },
        sendUniversityData(){
            let data = new FormData();
            data.append('university_name',this.university_name);
            data.append('university_address',this.university_address);
            data.append('university_country',this.university_country);
            data.append('university_city',this.university_city);
            data.append('university_site',this.university_site);
            data.append('university_email',this.university_email);

            axios.post('/professor/university',data, []).then(response => {
                this.universities.push(response.data);
                this.university_name = "";
                this.university_address = "";
                this.university_country = "";
                this.university_city = "";
                this.university_site = "";
                this.university_email = "";

                $("#universityModal").modal('hide');
            }).catch( error => {
                // implment Error message showing
                $('#failModal').modal("show");
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
                console.log(error);
            });
        },
        storeUserInformation(){
            let data = new FormData();
            data.append('image_url', this.imageUrl);
            data.append('user_name', this.name );
            data.append('user_surname', this.surname);
            data.append('user_email', this.email );
            data.append('type', "student");

            axios.post('/user/create', data, []).then( response => {
                this.userId = response.data.id;
            }).catch( error => {
                $("#failModal").modal('show');
                this.errorMsg = error.message;
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
                console.log('auth');
                this.storeUserInformation();
                return false;
            }).catch(error => {
                console.log(error);
                $("#failModal").modal('show');
                this.errorMsg = "Please fill out with correct data ";
                return false;
            });
            return false;
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
                console.log('not valid')
                return false;
            })
        },
        sendDataToDb(){
            var data = new FormData();
            data.append('university', this.university);
            data.append('faculty', this.faculty);
            data.append('department', this.department);
            data.append('user_id', this.userId);
            data.append('type', "professor");

            axios.post('/academic/create', data, []).then( response => {
                this.userEmail = response.data.email;
                $('#hiddenFormSubmit').submit();
            }).catch( error => {
                $("#failModal").modal('show');
                this.errorMsg = error.message;
            })
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