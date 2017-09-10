import axios from 'axios';
import Vue from 'vue';
import {alert} from 'vue-strap';

var Login = new Vue({
    el: '#root',
    components:{
        alert
    },
    data: {
        input: '# hello',
        name: 'haris',
        showTop: false,
        email:'',
        errorMsg :""
    },
    computed: {
        compiledMarkdown: function () {
            return this.input
        }
    },
    methods: {
        submitFormEmail:function(event){
            event.preventDefault();
            $('#loadingModal').modal('show');
            axios.post('/session/'+this.email, {}, []).then( response =>{
                $("#logInForm").submit();
            }).catch( error => {
                console.log(error);
                $('#loadingModal').modal('hide');
                this.showAlertWithCustomMessage("Not valid user");
            });

        },
        openLoadingModal: function(event){
            event.preventDefault();
            $('#loadingModal').modal('show');
        },
        toCustomSignUp:function(event){
            event.preventDefault();
            if(window.location.href.includes('professor')){
                window.location.href = '/professor/signup'
            }
            else{
                window.location.href = '/student/signup'
            }
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
        }
    },
    delimiters: ['${', '}']
});

export { Login as default }