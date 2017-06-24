/**
 * Created by haris on 12.6.17.
 */
/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {tabset,tabs, tab} from 'vue-strap';
import moment from 'moment';

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var CourseStudent = new Vue({
    el:'#wrapper',
    components:{
        tabset,
        tabs,
        tab
    },
    data:{
        courses:[],
        content:'',
        activeTab:0,
        courseFiles:[],
        showTop:false,
        errorMsg:""
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
        getCourseData(){
            let id = this.getCourseId();
            axios.get('/dashboard/course-info/'+id).then(response => {
                if(response.data.info != null){

                    var content = response.data.info;
                    this.content = response.data.info;
                    $('#content').html(content);
                }
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        getCourseId(){
            var url = window.location.href;
            var array = url.split('/');
            return array[array.length - 1 ];
        },
        getCoursesForDepartment(){
            axios.get('/dashboard/course/student').then(response => {
                console.log(response.data);
                this.courses = response.data;
                var courseId = this.getCourseId();
                this.courses.forEach(course => {
                    if(course.id == courseId){
                        this.courseFiles = course.course_files;
                    }
                });
                this.departmentName = response.data[0].department.name;
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })
        },
        getCourseId(){
            var url = window.location.href;
            var array = url.split('/');
            var id = array[array.length - 1 ]
            return id.replace(/\D/g,'');
        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        }
    },
    mounted() {
        let self = this;
        $(window).load(function(){
            self.getCourseData()
        })

    },
    beforeMount(){
        this.getCoursesForDepartment();
    },
    delimiters: ['${', '}']
});

export {CourseStudent as default};