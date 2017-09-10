/**
 * Created by haris on 23.7.17.
 */

import axios from 'axios';
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

var NewCourseFilesComonent = Vue.component('new-files', {

    template:
        `<div>
            <div class="col-sm-12 form-upload">
                <form action="" class="form-horizontal">
                    <div :class=" {'form-group': true , 'form-group has-error' : errors.has('fileName')}">
                        <label for="focusedinput" class="col-sm-2 control-label">Files for </label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control1" id="focusedinput" v-model="fileName" data-vv-name="fileName" v-validate="'required|alpha_spaces'"  placeholder="Files Purpose" >
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="selector1" class="col-sm-2 control-label">Files</label>
                        <div class="col-sm-8">
                            <button class="btn btn-primary"  v-on:click="openUpload" data-id="upload">Upload Files</button>
                            <input type="file" name="files[]" class="hidden" id="upload" v-on:change="storeFilesInVar" accept="audio/*,video/*,image/*,media_type" multiple>
                            <p v-text="uploadedFilesNames"></p>
                        </div>
                    </div>
                </form>
            </div>
            <p class="storage-but">
                <button v-on:click="storeFiles" class="btn btn-success" >Store Files</button>
            </p>
        </div>`,
    data:function(){
        return {
            fileName:'',
            uploadedFilesNames:'',
            showTop: false,
            errorMsg :"",
            root: this.$parent.$parent.$parent
        }
    },
    methods:{
        openUpload:function(event){
            event.preventDefault();
            var id = $(event.target).attr('data-id');
            $("#"+id).click();
        },

        storeFilesInVar:function(event){
            this.uploadedFilesNames = "";
            this.files = event.target.files;
            var string = "";
            Array.from(this.files).forEach( file => {
                string = string.concat(file.name.toString() + " , ");
            });
            string = string.substring(0, string.length - 1);
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
            Array.from(this.files).forEach( file => {
                data.append('file['+i+']', file)
                i++;
            });
            data.append('file_name', this.fileName);
            axios.post('/dashboard/upload/'+this.root.getCourseId(), data, config).then( response => {
                console.log(response.data);
                this.root.courseFiles.push(response.data);
                this.fileName = "";
                $('#upload').val('');
                this.uploadedFilesNames = '';
            }).catch( error => {
                this.showTop = true;
                this.setAlertToFalse();
                this.errorMsg = error.message;
            })
        },
        setAlertToFalse(){
            var self = this;
            setTimeout(function(){
                self.showTop = false;
            }, 3000);
        },
    },
    beforeMount(){

    },
    delimiters: ['${', '}']
});
export {NewCourseFilesComonent as default};