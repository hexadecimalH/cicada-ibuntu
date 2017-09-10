/**
 * Created by haris on 23.7.17.
 */

import axios from 'axios';
import Vue from 'vue';

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

var FacultyComponent = Vue.component('faculty',{

    template:
        `<div class="modal-content">
            <form class=""></form>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h2 class="modal-title">Create new Faculty</h2>
                </div>
                <div class="modal-body">
                    <form action="" class="form-horizontal">
                        <div :class=" {'form-group': true , 'form-group has-error' : errors.has('facultyBelongsToUniversity')}">
                            <label for="focusedinput" class="col-sm-2 control-label">University</label>
                            <div class="col-sm-8">
                                <select v-model="facultyBelongsToUniversity" id="selector1" class="form-control1" data-vv-name="facultyBelongsToUniversity" v-validate="'required|alpha_num'" >
                                    <option value="">Click to select University</option>
                                    <option v-for="university in universities" v-text="university.name" v-bind:value="university.id"></option>
                                </select>
                            </div>
                        </div>
                        <div :class=" {'form-group': true , 'form-group has-error' : errors.has('facultyName')}">
                            <label for="focusedinput" class="col-sm-2 control-label">Name</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control1" id="focusedinput" v-model="facultyName" placeholder="Faculty Offical Name" data-vv-name="facultyName" v-validate="'required|alpha_spaces'" >
                            </div>
                        </div>
                        <div class="form-group" >
                            <label for="txtarea1" class="col-sm-2 control-label">Faculty Info</label>
                            <div class="col-sm-8"><textarea v-model="facultyInfo" id="txtarea1" cols="50" rows="6" class="form-control1"></textarea></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Dissmis</button>
                    <button type="button" class="btn btn-primary" v-on:click="registerFaculty">Create</button>
                </div>
            </div><!-- /.modal-content -->`,
    props:['universities'],
    data: function(){
        return {
            facultyBelongsToUniversity:'',
            facultyName:'',
            facultyBranch:'',
            facultyInfo:'',
        }
    },
    methods:{
        registerFaculty(){
            this.$validator.validateAll({
                facultyBelongsToUniversity:this.facultyBelongsToUniversity,
                facultyName:this.facultyName,
            }).then( response => {
                console.log('valid');
                this.sendFacultyData();
            }).catch(error => {
                this.$parent.showAlertWithCustomMessage("Invalid data");
            });
        },
        sendFacultyData(){
            let data = new FormData();
            data.append('university_id',this.facultyBelongsToUniversity);
            data.append('faculty_name',this.facultyName);
            data.append('faculty_branch',this.facultyBranch);
            data.append('faculty_info',this.facultyInfo);

            axios.post('/professor/faculty', data, []).then( response =>{
                this.$parent.faculties.push(response.data);
                this.facultyBelongsToUniversity = "";
                this.facultyName = "";
                this.facultyBranch = "";
                this.facultyInfo = "";
                $('#facultyModal').modal('hide');
            }).catch( error => {
                this.$parent.showAlertWithCustomMessage("Invalid data");
            });
        }
    },
    ready(){
        console.log(this.universities);
    }
});

export { FacultyComponent as default};