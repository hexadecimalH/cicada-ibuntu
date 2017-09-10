/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {tabset,tabs, tab, alert, datepicker} from 'vue-strap';
import vueEventCalendar from 'vue-event-calendar'
import NewAssignemntComonent from './Components/NewAssignmentComonent';
import NewCourseFilesComonent from './Components/NewCourseFiles';

import moment from 'moment';

import VeeValidate from 'vee-validate';
Vue.use(vueEventCalendar, {locale: 'en'})
Vue.use(VeeValidate);

var Course = new Vue({
    el:'#wrapper',
    components:{
        NewAssignemntComonent,
        NewCourseFilesComonent,
        tabset,
        tabs,
        tab,
        alert,
    },
    data:{
        courses:[],
        activeTab:0,
        courseId:0,
        requests:[],
        content:'',
        course:{},
        files:[],

        courseFiles:[],
        editMode:false,
        showTop:false,
        errorMsg:"",
        demoEvents: [{
            date: '2017/9/15',
            title: 'Foo',
            desc: 'longlonglong description'
        },{
            date: '2017/9/16',
            title: 'Bar'
        }],
        assignments:[],
        currentAssignment:null
    },
    computed:{

    },
    methods:{
        toggleEdit(){
            this.editMode = !this.editMode;

        },
        deleteStoredFiles:function(id){
            axios.delete('/dashboard/files/'+id).then( response => {
                console.log(response.data);
                this.removeElementFromArray(this.courseFiles, id);
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        sendCourseInfo(){
            var id = $(event.target).attr('data-id');
            var content =  tinyMCE.activeEditor.getContent();
            let data = new FormData();
            console.log(content);
            data.append('info', content);
            axios.post('/dashboard/course/info/'+id, data, []).then(response => {
                console.log(response.data);
                this.toggleEdit()
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })

        },
        coursePath:function(id){
            return "/dashboard/course/"+id;
        },
        acceptStudentRequest: function(event){
            var requestId = this.getIdFromEvent(event);
            axios.put('/dashboard/request/approve/'+requestId).then(response => {
                this.requests.forEach(request => {
                    if(request.id == requestId){
                        request.status = response.data.status;
                    }
                });
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        deleteStudentRequest:function(event){
            var requestId = this.getIdFromEvent(event);
            axios.delete('/dashboard/request/'+requestId).then(response => {
                this.removeElementFromArray(this.requests, requestId);
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        getIdFromEvent:function(event){
            return $(event.target).attr('data-id');
        },
        ajustNameToShow:function(name){
            if(name.length < 23){
                return name;
            }
            else{
                return name;

            }
        },
        beautifyDate(date){
            return moment(date).format('LLLL');
        },
        getProfessorsCourses(){
            var self = this;
            axios.get('/dashboard/course/professor').then(response => {

                this.courses = response.data;
                var courseId = this.getCourseId();
                this.courses.forEach(course => {
                    if(course.id == courseId){
                        self.courseFiles = course.course_files;
                        self.assignments = course.assignments;
                    }
                });
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })
        },
        getRequestsForCourse(){
            this.courseId = this.getCourseId();
            axios.get('/dashboard/request/'+this.courseId).then(response => {
                this.requests = response.data;
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        getCourseData(){
            let id = this.getCourseId();
            axios.get('/dashboard/course-info/'+id).then(response => {
                if(response.data.info != null){

                    var content = response.data.info;
                    this.content = response.data.info;
                    tinyMCE.activeEditor.setContent(content);
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
            var id = array[array.length - 1 ]
            return id.replace(/\D/g,'');
        },
        undoContent(){
            tinyMCE.activeEditor.setContent(this.content);
            $('#content').html(this.content);
        },
        deleteAssignment(event){
            let id = this.getIdFromEvent(event);
            axios.delete("/dashboard/assignment/"+ id).then( response =>{
                console.log(response);
                this.removeElementFromArray(this.assignments, id);
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        editAssignment(event){
            let id = this.getIdFromEvent(event);
            this.currentAssignment = id;
            this.assignments.forEach(assigment =>{
                if(assigment.id == id){
                    this.currentAssignment = assigment;
                }
            });
        },
        removeElementFromArray(array, elementId){
            array.forEach(element => {
                if(element.id == elementId){
                    let index = array.indexOf(element);
                    array.splice(index, 1);
                }
            });
        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        },
        getSelfObject(){
            return this;
        }
    },
    beforeMount(){
        this.getProfessorsCourses();
        this.getRequestsForCourse();

    },
    mounted() {
        let self = this;
        $(window).load(function(){
            self.getCourseData()
        })

    },
    delimiters: ['${', '}']
});
export {Course as default};