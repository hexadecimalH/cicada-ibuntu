/**
 * Created by haris on 12.6.17.
 */
/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {checkbox, buttonGroup} from 'vue-strap';
import moment from 'moment';

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var DashboardStudent = new Vue({
    el:'#wrapper',
    components:{
        buttonGroup,
        checkbox
    },
    data:{
        courses:[],
        departmentName: ''
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
        getCoursesForDepartment(){
            axios.get('/dashboard/course/student').then(response => {
                console.log(response.data);
                this.courses = response.data;
                this.departmentName = response.data[0].department.name;
            }).catch( error => {
                console.log(error);
            })
        },
        requestSubmit:function(event){
            let courseId = $(event.target).attr('data-id');
            axios.post('/dashboard/request/'+ courseId).then(response => {
                console.log(response.data);
                this.courses.forEach(course => {
                    if(course.id == courseId){
                        course.request = response.data;
                    }
                });
            }).catch(error => {
                console.log(error);
            });
        },
        deleteRequest:function(event){
            let courseId = $(event.target).attr('data-id');
            var requestId = 0;
            this.courses.forEach( course => {
                if(course.id == courseId){
                    requestId = course.request.id;
                }
            });
            this.removeRequest(courseId);
            axios.delete('/dashboard/request/'+ requestId).then(response =>{
                console.log(response.data)
            }).catch(error => {
                console.log(error.message);
            });
        },
        generateUrl:function(course){
            return '/dashboard/course/'+course.id;
        },
        removeRequest(id){
            this.courses.forEach(course =>{
                if(course.id == id){
                    course.request = null;
                }
            });
        },

    },
    beforeMount(){
        this.getCoursesForDepartment();
    },
    delimiters: ['${', '}']
});

export {DashboardStudent as default};