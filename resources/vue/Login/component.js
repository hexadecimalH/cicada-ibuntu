import axios from 'axios';

var Login = new Vue({
    el: '#root',
    data: {
        input: '# hello',
        name: 'haris'
    },
    computed: {
        compiledMarkdown: function () {
            return this.input
        }
    },
    methods: {
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
        }
    },
    delimiters: ['${', '}']
});

export { Login as default }