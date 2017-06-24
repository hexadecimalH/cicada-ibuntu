/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {tabset,tabs, tab, alert, datepicker} from 'vue-strap';
import vueEventCalendar from 'vue-event-calendar'

import moment from 'moment';

import VeeValidate from 'vee-validate';
Vue.use(vueEventCalendar, {locale: 'en'})
Vue.use(VeeValidate);

var Course = new Vue({
    el:'#wrapper',
    components:{
        tabset,
        tabs,
        tab,
        alert,
        datepicker
    },
    data:{
        courses:[],
        activeTab:0,
        courseId:0,
        requests:[],
        content:'',
        course:{},
        fileName:'',
        files:[],
        uploadedFilesNames:'',
        uploadedFilesAssignment:'',
        courseFiles:[],
        editMode:false,
        showTop:false,
        errorMsg:"",
        demoEvents: [{
            date: '2017/6/15',
            title: 'Foo',
            desc: 'longlonglong description'
        },{
            date: '2017/6/16',
            title: 'Bar'
        }],
        date:moment(new Date).format('YYYY-MM-D'),
        format:'yyyy-MM-dd',
        clear:false,
        assignemntTitle:'',
        assignemntDescription:'',
        assignments:[]
    },
    computed:{

    },
    methods:{
        createAssignemt:function(event){
            event.preventDefault();
            var data = new FormData();
            data.append('title',this.assignemntTitle);
            data.append('title',this.assignemntDescription);
            data.append('due_date', this.date);
            var i  = 0 ;
            Array.from(this.files).forEach( file => {
                data.append('file['+i+']', file)
                i++;
            });
            axios.post('/dashboard/assignment/'+this.courseId, data).then( response =>{
                this.assignments.push(response.data);
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        toggleEdit(){
            this.editMode = !this.editMode;

        },
        storeFilesInVar:function(event){
            this.uploadedFilesNames = "";
            this.files = event.target.files;
            var string = "";
            Array.from(this.files).forEach( file => {
                string = string.concat(file.name.toString() + " , ");
            });
            ($(event.target).attr("id") == "upload") ? this.uploadedFilesNames = string : this.uploadedFilesAssignment = string;

        },
        storeFiles:function(event){
            event.preventDefault();
            // implement validation of fileds
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            var data = new FormData();
            let i = 0;
            Array.from(this.files).forEach( file => {
                data.append('file['+i+']', file)
                i++;
            });
            data.append('file_name', this.fileName);
            console.log(data);
            axios.post('/dashboard/upload/'+this.courseId, data, config).then( response => {
                console.log(response.data);
                this.courseFiles.push(response.data);
                this.fileName = "";
                $('#upload').val('');
                this.uploadedFilesNames = '';
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })
        },
        deleteStoredFiles:function(id){
            axios.delete('/dashboard/files/'+id).then( response => {
                console.log(response.data);
                this.courseFiles.forEach( file => {
                    if(file.id == id){
                        let index = this.courseFiles.indexOf(file);
                        this.courseFiles.splice(index,1);
                    }
                });
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        openUpload:function(event){
            event.preventDefault();
            var id = $(event.target).attr('data-id');
            $("#"+id).click();
        },
        sendCourseInfo(){
            var id = $(event.target).attr('data-id');
            var content =  tinyMCE.activeEditor.getContent();
            let data = new FormData();
            console.log(content);
            data.append('info', content);
            axios.post('/dashboard/course/info/'+id, data, []).then(response => {
                console.log(response.data);
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
                this.requests.forEach(request => {
                    if(request.id == requestId){
                        let index = this.requests.indexOf(request);
                        this.requests.splice(index,1);

                    }
                });
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
        getProfessorsCourses(){
            axios.get('/dashboard/course/professor').then(response => {
                console.log(response.data);
                this.courses = response.data;
                var courseId = this.getCourseId();
                this.courses.forEach(course => {
                    if(course.id == courseId){
                        this.courseFiles = course.course_files;
                        this.assignments = course.assignments;
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
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
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