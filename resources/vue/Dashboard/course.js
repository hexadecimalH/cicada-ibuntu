/**
 * Created by haris on 11.6.17.
 */
import axios from 'axios';
import Vue from 'vue';
import {tabset,tabs, tab} from 'vue-strap';
import moment from 'moment';

import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

var Course = new Vue({
    el:'#wrapper',
    components:{
        tabset,
        tabs,
        tab
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
        courseFiles:[],
        editMode:false
    },
    computed:{

    },
    methods:{
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
            this.uploadedFilesNames = string;
        },
        storeFiles:function(event){
            event.preventDefault();
            // implement validation of fileds
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            var data = new FormData();
            let i = 0;
            console.log(this.files.length);
            Array.from(this.files).forEach( file => {
                data.append('file['+i+']', file)
                i++;
            });
            data.append('file_name', this.fileName);
            console.log(data);
            axios.post('/dashboard/upload/'+this.courseId, data, config).then( response => {
                this.courseFiles.push(response.data);
                this.fileName = "";
                $('#upload').val('');
                this.uploadedFilesNames = '';
            }).catch( error => {
                console.log(error);
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
                console.log(error);
            });
        },
        openUpload:function(event){
            event.preventDefault();
            $("#upload").click();
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
                console.log(error);
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
                console.log(error);
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
                console.log(error);
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
                    }
                });
            }).catch( error => {
                console.log(error);
            })
        },
        getRequestsForCourse(){
            this.courseId = this.getCourseId();
            axios.get('/dashboard/request/'+this.courseId).then(response => {
                this.requests = response.data;
            }).catch(error => {
                console.log(error.message);
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
                console.log(error.message);
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