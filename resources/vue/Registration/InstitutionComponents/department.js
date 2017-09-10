/**
 * Created by haris on 23.7.17.
 */
import axios from 'axios';
import Vue from 'vue';

import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

var DepartmentComponent = Vue.component('department',{

    template:
        `<div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h2 class="modal-title">Create new Department</h2>
                </div>

                <div class="modal-body">
                    <form action="" class="form-horizontal">
                        <div :class=" {'form-group': true , 'form-group has-error' : errors.has('departmentName')}">
                            <label for="focusedinput" class="col-sm-2 control-label">Name</label>
                            <div class="col-sm-8">
                                <input type="text" class="form-control1" id="focusedinput" v-model="departmentName" data-vv-name="departmentName" v-validate="'required|alpha_spaces'"  placeholder="Department Offical Name" >
                            </div>
                        </div>
                        <div :class=" {'form-group': true , 'form-group has-error' : errors.has('departmentBelongsToUniversity')}">
                            <label for="focusedinput" class="col-sm-2 control-label">University</label>
                            <div class="col-sm-8">
                                <select v-model="departmentBelongsToUniversity" id="selector1" class="form-control1" data-vv-name="departmentBelongsToUniversity" v-validate="'required|alpha_num'" >
                                    <option value="">Click to select University</option>
                                    <option v-for="university in universities" :value="university.id" v-text="university.name"></option>
                                </select>
                            </div>
                        </div>
                        <div :class=" {'form-group': true , 'form-group has-error' : errors.has('departmentBelongsToFaculty')}">
                            <label for="selector1" class="col-sm-2 control-label">Faculty</label>
                            <div class="col-sm-8">
                                <select v-model="departmentBelongsToFaculty" id="selector1" class="form-control1" data-vv-name="departmentBelongsToFaculty" v-validate="'required|alpha_num'" >
                                    <option value="">Click to select Faculty</option>
                                    <option v-for="faculty in faculties" :value="faculty.id" v-text="faculty.name"></option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="txtarea1" class="col-sm-2 control-label">Department Info</label>
                            <div class="col-sm-8"><textarea v-model="departmentInfo" id="txtarea1" cols="50" rows="6" class="form-control1"></textarea></div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Dismiss</button>
                    <button type="button" class="btn btn-primary" v-on:click="registerDepartment">Create</button>
                </div>
            </div>`,
    props:['universities', 'faculties'],
    data: function(){
        return {
            departmentBelongsToUniversity:'',
            departmentBelongsToFaculty:'',
            departmentName:'',
            departmentInfo:'',
        }
    },
    methods:{
        registerDepartment(){
            this.$validator.validateAll({
                departmentBelongsToFaculty:this.departmentBelongsToFaculty,
                departmentBelongsToUniversity:this.departmentBelongsToUniversity,
                departmentName:this.departmentName
            }).then( response => {
                console.log('valid');
                this.sendDepartmentData();
            }).catch(error => {
                this.$parent.showAlertWithCustomMessage("Invalid data");
            });
        },
        sendDepartmentData(){
            let data = new FormData();

            data.append('department_name', this.departmentName);
            data.append('university_id', this.departmentBelongsToUniversity);
            data.append('faculty_id', this.departmentBelongsToFaculty);
            data.append('department_info', this.departmentInfo);

            axios.post('/professor/department', data, []).then( response => {
                this.$parent.departments.push(response.data);
                $('#departmentModal').modal('hide');
                this.departmentName = "";
                this.departmentBelongsToUniversity = "";
                this.departmentBelongsToFaculty = "";
                this.departmentInfo = "";

            }).catch( error => {
                this.$parent.showAlertWithCustomMessage("Invalid data");
            });
        },
    }
});

export { DepartmentComponent as default};