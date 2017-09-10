/**
 * Created by haris on 23.7.17.
 */

import axios from 'axios';
import Vue from 'vue';

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

var NewCourseComponent = Vue.component('new-course',{

    template:
        `<div class="modal fade" id="newCourse" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" >
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" >
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h2 class="modal-title">Create Course</h2>
                    </div>
                    <div class="modal-body">
                        <form action="" class="form-horizontal">
                            <div :class=" { 'form-group': true , 'form-group has-error' : errors.has('courseName')}">
                                <label for="focusedinput" class="col-sm-2 control-label">Name</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control1" id="focusedinput" v-model="courseName" data-vv-name="courseName" v-validate="'required|alpha_spaces'" placeholder="Course Name" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="" class="col-sm-2 control-label" >Working Days</label>
                                <div class="col-sm-8">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-primary" data-info="monday" v-on:click="daysCheckbox">Monday</button>
                                        <button type="button" class="btn btn-primary" data-info="tuesday" v-on:click="daysCheckbox">Tuesday</button>
                                        <button type="button" class="btn btn-primary" data-info="wednesday" v-on:click="daysCheckbox">Wednesday</button>
                                        <button type="button" class="btn btn-primary" data-info="thursday" v-on:click="daysCheckbox">Thursday</button>
                                        <button type="button" class="btn btn-primary" data-info="friday" v-on:click="daysCheckbox">Friday</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" v-if="daysContains('monday')" >
                                <label for="" class="col-sm-2 control-label">Working Hours for Monday</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control1" id="focusedinput" v-model="monday"  placeholder="from 10:00 to 12:00, from 14:00 to 16:00" >
                                </div>
                            </div>
                            <div class="form-group" v-if="daysContains('tuesday')" >
                                <label for="" class="col-sm-2 control-label">Working Hours for Tuesday</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control1" id="focusedinput" v-model="tuesday"  placeholder="from 10:00 to 12:00, from 14:00 to 16:00" >
                                </div>
                            </div>
                            <div class="form-group" v-if="daysContains('wednesday')" >
                                <label for="" class="col-sm-2 control-label">Working Hours for Wednesday</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control1" id="focusedinput" v-model="wednesday"  placeholder="from 10:00 to 12:00, from 14:00 to 16:00" >
                                </div>
                            </div>
                            <div class="form-group" v-if="daysContains('thursday')" >
                                <label for="" class="col-sm-2 control-label">Working Hours for Thursday</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control1" id="focusedinput" v-model="thursday"  placeholder="from 10:00 to 12:00, from 14:00 to 16:00" >
                                </div>
                            </div>
                            <div class="form-group" v-if="daysContains('friday')" >
                                <label for="" class="col-sm-2 control-label">Working Hours for Friday</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control1" id="focusedinput" v-model="friday"  placeholder="from 10:00 to 12:00, from 14:00 to 16:00" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="" class="col-sm-2 control-label">Smester</label>
                                <div class="col-sm-8">
                                    <div class="dropdown">
                                        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" v-text="semester" >
                                             <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                                            <li role="presentation">
                                                <a role="menuitem" tabindex="-1" href="#" v-on:click="setSemester" data-info="Summer">Summer</a>
                                            </li>
                                            <li role="presentation">
                                                <a role="menuitem" tabindex="-1" href="#" v-on:click="setSemester" data-info="Winter">Winter</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="dropdown">
                                        <button class="btn btn-default dropdown-toggle" type="button" id="menu1" data-toggle="dropdown" v-text="year">
                                             <span class="caret"></span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                                            <li role="presentation" v-for="year in years">
                                                <a role="menuitem" tabindex="-1" href="#" v-on:click="setYear" v-text="year" :data-info="year"></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Dismiss</button>
                        <button type="button" class="btn btn-primary" v-on:click="pileUserData">Create</button>
                    </div>
                </div>
            </div>
        </div>`,
    data:function(){
        return {
            days:[],
            courseName:'',
            semester:'Summer',
            monday:'',
            tuesday:'',
            wednesday:'',
            thursday:'',
            friday:'',
            year:0,
            years:[],
            showTop: false,
            errorMsg :"",
        }
    },
    methods:{
        daysCheckbox(event){
            $(event.target).toggleClass('active-button').blur();
            let day = $(event.target).attr('data-info');
            if(this.days.includes(day)){
                let index = this.days.indexOf(day);
                this.days.splice(index,1);
            }
            else{
                this.days.push(day);
            }
        },
        daysContains:function(day){
            let value;
            (this.days.includes(day)) ? value = true : value = false;
            return value;
        },
        setSemester(event){
            this.semester = $(event.target).attr('data-info');
        },
        pileUserData(){
            let data = new FormData();
            var self = this;
            data.append("course_name", this.courseName);
            data.append("scheduled_days", this.days );
            data.append("semester", this.semester);
            data.append("year", this.year);

            this.days.forEach(function(element){
                data.append(element, self[element]);
            });

            axios.post('/dashboard/course/create', data, []).then(response => {
                console.log(response.data);
                this.$parent.courses.push(response.data);
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
                console.log(this.errorMsg);
            });
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
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        }

    },
    beforeMount(){
        this.fillUpYearsContainer();
        // this.getProfessorsCourses();
    },
    delimiters: ['${', '}']
});
export {NewCourseComponent as default};