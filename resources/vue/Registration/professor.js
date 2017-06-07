import axios from 'axios';

var Registartion = new Vue({
    el: '#root',
    data: {
        nameClass:'form-group',
        surnameClass:'form-group',
        emailClass:'form-group',
        password: '',
        university_name:'',
        universityNameClass:'form-group',
        university_email:'',
        universityEmailClass:'form-group',
        university_number:'',
        universityNumberClass:'form-group',
        university_city:'',
        universityCityClass:'form-group',
        university_address:'',
        universityAddressClass:'form-group',
        university_country:'',
        universityCountryClass:'form-group',
        university_mail:'',
        universityMailClass:'form-group',
        university_site:'',
        universitySiteClass:'form-group',
        universities:[],
        rePassword:'',
        buttonHref:'#profile',
        input: '#hello',
        labelClass: "form-group",
        name: '',
        surname:'',
        email:'',
        image:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        imageUrl:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        facultyBelongsToUniversity:'',
        facultyBelongsToUniversityClass:'form-group',
        facultyName:'',
        facultyNameClass:'form-group',
        facultyBranch:'',
        facultyBranchClass:'form-group',
        facultyInfo:'',
        facultyInfoClass:'form-group',
        faculties:[],
        departmentBelongsToUniversity:'',
        departmentBelongsToUniversityClass:'form-group',
        departmentBelongsToFaculty:'',
        departmentBelongsToFacultyClass:'form-group',
        departmentName:'',
        departmentNameClass:'form-group',
        departmentInfo:'',
        departmentInfoClass:'form-group',
        departments:[]
    },
    computed: {

    },
    methods: {
        checkEquality(pass, val){
            if(pass == val){
                this.labelClass = "form-group has-success"
            }
            else{
                this.labelClass = "form-group has-error"
            }
        },
        // checking validity of first step YELLS FOR REFACTORING
        checkFirstStepFields(){
            let value = false;
            if(this.name == ""){
                this.nameClass = "form-group has-error";
                value = true;
            }
            else{
                this.nameClass = "form-group";
            }
            if(this.surname == ""){
                this.surnameClass =  "form-group has-error";
                value = true;
            }
            else{
                this.surnameClass =  "form-group";
            }
            if(this.email == ""){
                this.emailClass = "form-group has-error";
                value = true;
            }
            else{
                // validating email with regex
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(this.email)){
                    value = true;
                    this.emailClass = "form-group has-error";
                }
                else{
                    this.emailClass = "form-group";
                }

            }
            (value) ? this.returnPreviousTab() : this.changeTabs();
        },
        changeTabs(){
            this.buttonHref = "#profile"
            var tabs = $('li[role="presentation"]');
            $(tabs).each(function(){
                if($(this).hasClass('active')){
                    $(this).removeClass('active');
                }
                else{
                    $(this).addClass('active');
                }
            })
        },
        returnPreviousTab(){
            $("button#home-tab").click();
            this.buttonHref = ""
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
                console.log(response.data);
            }).catch( error => {
                $('#failModal').modal("show");
            })
        },
        validateUniversityInput(){

            let value = false;
            if(this.university_name == ""){
                this.universityNameClass = "form-group has-error";
                value = true;
            }
            else{
                this.universityNameClass = "form-group";
            }
            if(this.university_address == ""){
                this.universityAddressClass =  "form-group has-error";
                value = true;
            }
            else{
                this.universityAddressClass =  "form-group";
            }
            if(this.university_city == ""){
                this.universityCityClass =  "form-group has-error";
                value = true;
            }
            else{
                this.universityCityClass=  "form-group";
            }
            if(this.university_country == ""){
                this.universityCountryClass =  "form-group has-error";
                value = true;
            }
            else{
                this.universityCountryClass=  "form-group";
            }
            if(this.university_site == ""){
                this.universitySiteClass =  "form-group has-error";
                value = true;
            }
            else{
                // validating email with regex
                var re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
                var regex = new RegExp(re);
                if(!(this.university_site.match(regex))){
                    value = true;
                    this.universitySiteClass = "form-group has-error";
                }
                else{
                    this.universitySiteClass = "form-group";
                }
            }
            if(this.university_email == ""){
                value = true;
                this.universityEmailClass = "form-group has-error";
            }
            else{
                // validating email with regex
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(this.university_email)){
                    value = true;
                    this.universityEmailClass = "form-group has-error";
                }
                else{
                    this.universityEmailClass = "form-group";
                }
            }
            if(!value){
                this.sendUniversityData();
            }
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
            }).catch( error => {
                $('#failModal').modal("show");
            })
        },
        registerUniversity(){
            this.validateUniversityInput();
        },
        createFaculty(){
            this.facultyCheckValidity();
        },
        facultyCheckValidity(){
            let value = false;
            if(this.facultyBelongsToUniversity == ""){
                this.facultyBelongsToUniversityClass = "form-group has-error";
                value = true;
            }
            else{
                this.facultyBelongsToUniversityClass = "form-group";
            }
            if(this.facultyName == ""){
                this.facultyNameClass =  "form-group has-error";
                value = true;
            }
            else{
                this.facultyNameClass =  "form-group";
            }
            if(this.facultyBranch == ""){
                this.facultyBranchClass = "form-group has-error";
                value = true;
            }
            else{
                this.facultyBranchClass=  "form-group";
            }
            if(!value){
                this.storeFacultyData();
            }
        },
        storeFacultyData(){
            let data = new FormData();
            data.append('university_id',this.facultyBelongsToUniversity);
            data.append('faculty_name',this.facultyName);
            data.append('faculty_branch',this.facultyBranch);
            data.append('faculty_info',this.facultyInfo);

            axios.post('/professor/faculty', data, []).then( response =>{
                console.log(response.data);
                this.faculties.push(response.data);
            }).catch( error => {
                console.log(error);
            });
        },
        createDepartment(){
            this.departmentValidityCheck();
        },
        departmentValidityCheck(){
            let value = false;
            if(this.departmentName == ""){
                this.departmentNameClass = "form-group has-error";
                value = true;
            }
            else{
                this.departmentNameClass = "form-group";
            }
            if(this.departmentBelongsToUniversity == ""){
                this.departmentBelongsToUniversityClass =  "form-group has-error";
                value = true;
            }
            else{
                this.departmentBelongsToUniversityClass =  "form-group";
            }
            if(this.departmentBelongsToFaculty == ""){
                this.departmentBelongsToFacultyClass = "form-group has-error";
                value = true;
            }
            else{
                this.departmentBelongsToFacultyClass=  "form-group";
            }
            if(!value){
                this.storeDepartmentData();
            }
        },
        storeDepartmentData(){
            let data = new FormData();

            data.append('department_name', this.departmentName);
            data.append('university_id', this.departmentBelongsToUniversity);
            data.append('faculty_id', this.departmentBelongsToFaculty);
            data.append('department_info', this.departmentInfo);

            axios.post('/professor/department', data, []).then( response =>{
                console.log(response.data);
            }).catch( error => {
                console.log(error);
            });
        },
        getUniversities(){
            axios.get('/professor/university/all').then(response => {
                console.log(response.data);
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