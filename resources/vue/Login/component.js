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
            $("#logInForm").submit();
        },
        openLoadingModal: function(event){
            event.preventDefault();
            console.log(event);
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