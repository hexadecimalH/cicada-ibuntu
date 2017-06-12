/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {checkbox, buttonGroup} from 'vue-strap';
import moment from 'moment';

import VeeValidate from 'vee-validate';
import VueTinymce from 'vue-tinymce'
Vue.use(VueTinymce)
Vue.use(VeeValidate);

var Course = new Vue({
    el:'#wrapper',
    components:{
        buttonGroup,
        checkbox,
        Tinymce
    },
    data:{
        courses:[]
    },
    computed:{

    },
    methods:{

        coursePath:function(id){
            return "/dashboard/course/"+id;
        },
        ajustNameToShow:function(name){
            if(name.length < 23){
                return name;
            }
            else{
                return name;

            }
        },
        getProfessorsCourses(){
            axios.get('/dashboard/course/professor').then(response => {
                this.courses = response.data;
            }).catch( error => {
                console.log(error);
            })
        }
    },
    beforeMount(){
        this.getProfessorsCourses();
    },
    delimiters: ['${', '}']
});

export {Course as default};