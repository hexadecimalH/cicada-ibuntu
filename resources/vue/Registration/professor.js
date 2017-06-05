import axios from 'axios';

var Registartion = new Vue({
    el: '#root',
    data: {
        nameClass:'form-group',
        surnameClass:'form-group',
        emailClass:'form-group',
        password: '',
        rePassword:'',
        buttonHref:'#profile',
        input: '#hello',
        labelClass: "form-group",
        name: '',
        surname:'',
        email:'',
        image:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        imageUrl:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
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
                $('#errorModal').modal().show();
            })
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