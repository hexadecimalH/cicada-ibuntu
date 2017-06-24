/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {checkbox, buttonGroup, alert} from 'vue-strap';
import Datepicker from 'vuejs-datepicker';

import moment from 'moment';

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var Dashboard = new Vue({
    el:'#wrapper',
    components:{
        buttonGroup,
        checkbox,
        alert
    },
    data:{
        days:[],
        courseName:'',
        semester:'Summer',
        courses:[],
        monday:'',
        tuesday:'',
        wednesday:'',
        thursday:'',
        friday:'',
        year:0,
        years:[],
        showTop: false,
        errorMsg :"",

    },
    computed:{
    },
    methods:{
        daysCheckbox(event){
            $(event.target).toggleClass('active-button').blur();
            var day = $(event.target).attr('data-info');
            if(this.days.includes(day)){
                let index = this.days.indexOf(day);
                this.days.splice(index,1);
            }
            else{
                this.days.push(day);
            }
            console.log(this.days);

        },
        daysContains:function(day){
            let value;
            (this.days.includes(day)) ? value = true : value = false;
            return value;
        },
        capitalize:function(word){
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        },
        setSemester(event){
            this.semester = $(event.target).attr('data-info');
        },
        setYear(event){
            this.year = $(event.target).attr('data-info');
        },
        fillUpYearsContainer(){
            this.year = moment().year();
            this.years.push(this.year);
            this.years.push(this.year + 1);
            this.years.push(this.year + 2);
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
        pileUserData(){
            let data = new FormData();

            data.append("course_name", this.courseName);
            data.append("scheduled_days", this.days );
            data.append("semester", this.semester);
            data.append("year", this.year);
            data.append("monday", this.monday);
            data.append("tuesday", this.tuesday);
            data.append("wednesday", this.wednesday);
            data.append("thursday", this.thursday);
            data.append("friday", this.friday);

            axios.post('/dashboard/course/create',data, []).then(response => {
                console.log(response.data);
                this.courses.push(response.data);
                $('#newCourse').modal('hide');
                this.courseName = "";
                this.days = [];
                this.semester = '';
                this.year = '';
                this.monday = '';
                this.tuesday = '';
                this.wednesday = '';
                this.thursday = '';
                this.friday = '';
            }).catch(error =>{
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
                console.log(error);
            });
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
        this.fillUpYearsContainer();
        this.getProfessorsCourses();
    },
    delimiters: ['${', '}']
});

export {Dashboard as default};