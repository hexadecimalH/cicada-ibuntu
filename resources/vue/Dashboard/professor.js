/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {checkbox, buttonGroup} from 'vue-strap';
import moment from 'moment';

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var Dashboard = new Vue({
    el:'#wrapper',
    components:{
        buttonGroup,
        checkbox
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
        years:[]
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
        dayLabel:function(day){
            return "Working Hours for "+  this.capitalize(day);
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
        pileUserData(){
            console.log(this);
            let data = new FormData();

            data.append("course_name", this.courseName);
            data.append("scheduled_days", this.days);
            data.append("semester", this.days);
            data.append("year", this.days);
            this.days.foreach(day => {
                data.append(day, this.get(day));
            });

        }
    },
    beforeMount(){
        this.fillUpYearsContainer();
    },
    delimiters: ['${', '}']
});

export {Dashboard as default};