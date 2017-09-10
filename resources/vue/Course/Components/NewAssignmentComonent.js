/**
 * Created by haris on 23.7.17.
 */

import axios from 'axios';
import Vue from 'vue';
import {datepicker} from 'vue-strap';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

var NewAssignmentComonent = Vue.component('new-assignment', {

    template:
        `<div class="col-sm-12 assignments">
            <form action="" class="form-horizontal">
                <div :class=" {'form-group': true , 'form-group has-error' : errors.has('assignemntTitle')}">
                    <label for="focusedinput" class="col-sm-2 control-label">Create Assignemnt</label>
                    <div class="col-sm-8">
                            <input type="text" class="form-control1" id="focusedinput" v-model="assignemntTitle" data-vv-name="assignemntTitle" v-validate="'required|alpha_spaces'"  placeholder="Files Purpose" >
                    </div>
                </div>
                <div class="form-group">
                    <label for="selector1" class="col-sm-2 control-label">Set Due Data</label>
                    <div class="col-sm-8">
                        <datepicker :value.sync="date"  :format="format" :clear-button="clear" placeholder="Please select date" class="form-control1">
                        </datepicker>
                    </div>
                </div>
                <div class="form-group" v-if="!ismodal">
                    <label for="selector1" class="col-sm-2 control-label">Files</label>
                    <div class="col-sm-8">
                        <button class="btn btn-primary"  v-on:click="openUpload" data-id="uploadAss" >Upload Files</button>
                        <input type="file" name="files[]" class="hidden" id="uploadAss" v-on:change="storeFilesInVar" accept="audio/*,video/*,image/*,media_type" multiple>
                        <p v-text="uploadedFilesAssignment"></p>
                    </div>
                </div>
                <div class="form-group">
                    <label for="selector1" class="col-sm-2 control-label">Description</label>
                    <div class="col-sm-8">
                        <textarea placeholder="Your Comment..." required="" style="width:100%;" rows="10" v-model="assignemntDescription"></textarea>
                    </div>
                </div>

                <div class="form-group">
                    <label for="selector1" class="col-sm-2 control-label"></label>
                    <div class="col-sm-8">
                        <p style="text-align: right;">
                            <button type="button" class="btn btn-default" data-dismiss="modal" v-if="ismodal">Dismiss</button>
                            <button type="button" class="btn btn-primary" v-if="ismodal" v-on:click="updateAssignment">Update </button>
                            <button class="btn-success btn" v-on:click="createAssignemt" v-if="!ismodal">Add Assignment</button>
                        </p>
                    </div>
                </div>
            </form>
        </div>`,
    props:['ismodal', 'assignment' ],
    components:{
        datepicker
    },
    data:function(){
        return {
            assignmentId:0,
            assignemntTitle:'',
            assignemntDescription:'',
            uploadedFilesAssignment:'',
            date:moment(new Date).format('YYYY-MM-D'),
            format:'yyyy-MM-dd',
            clear:false,
            showTop: false,
            errorMsg :"",
            root: this.$parent.$parent.$parent
        }
    },
    computed:{

    },
    methods:{
        openUpload:function(event){
            event.preventDefault();
            var id = $(event.target).attr('data-id');
            $("#"+id).click();
        },
        storeFilesInVar:function(event){
            this.uploadedFilesAssignment = "";
            this.files = event.target.files;
            var string = "";
            Array.from(this.files).forEach( file => {
                string = string.concat(file.name.toString() + " , ");
            });
            string = string.substring(0, string.length - 1);
            this.uploadedFilesAssignment = string;
        },
        createAssignemt:function(event){
            event.preventDefault();
            var data = new FormData();
            data.append('title',this.assignemntTitle);
            data.append('description',this.assignemntDescription);
            data.append('due_date', this.date);
            var i  = 0 ;
            Array.from(this.files).forEach( file => {
                data.append('file['+i+']', file)
                i++;
            });
            axios.post('/dashboard/assignment/'+this.root.getCourseId(), data).then( response =>{
                console.log(response.data);
                this.root.assignments.push(response.data);
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });
        },
        updateAssignment:function(event){
            event.preventDefault();

            let dataUpdate = new FormData();
            dataUpdate.append('name', this.assignemntTitle);
            dataUpdate.append('description', this.assignemntDescription);
            dataUpdate.append('due_date', this.date);
            dataUpdate.append('idAss',this.assignmentId);
            console.log(this.assignemntTitle, this.assignemntDescription, this.date, this.assignmentId);
            console.log(dataUpdate);
            axios.put('/dashboard/assignment', dataUpdate).then( response =>{
                console.log(response.data);
                // this.root.removeElementFromArray(this.root.assignments, response.data.id);
                // this.root.assignments.push(response.data);
            }).catch(error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            });

        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        },
    },
    watch:{
        assignment: {
            handler: function(val, oldVal) {
                console.log(val,oldVal);
                if(val != null){
                    this.assignemntTitle = val.name;
                    this.assignemntDescription = val.description;
                    this.date = moment(val.due_date).format('YYYY-MM-D');
                    this.assignmentId = val.id;
                }
            },
            deep: true
        }
    },
    beforeMount(){

    },
    delimiters: ['${', '}']
});
export {NewAssignmentComonent as default};