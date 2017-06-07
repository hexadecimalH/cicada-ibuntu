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
        update: function (e) {
            this.input = e.target.value
        }
    },
    delimiters: ['${', '}']
});

export { Login as default }