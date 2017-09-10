/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {checkbox, buttonGroup, alert} from 'vue-strap';
import NewCourseComponent from './NewCourseComponent/new-course';
import Datepicker from 'vuejs-datepicker';

import moment from 'moment';

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var Dashboard = new Vue({
    el:'#wrapper',
    components:{
        NewCourseComponent,
        buttonGroup,
        checkbox,
        alert
    },
    data:{
        days:[],
        courses:[],
        showTop: false,
        errorMsg :"",

    },
    computed:{

    },
    methods:{
        daysContains:function(day){
            let value;
            (this.days.includes(day)) ? value = true : value = false;
            return value;
        },
        capitalize:function(word){
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        },
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
                console.log(response.data);
                this.courses = response.data;
            }).catch( error => {
                console.log(error);
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
        this.getProfessorsCourses();
    },
    delimiters: ['${', '}']
});

export {Dashboard as default};