<template>
    <div class="artSubmit">
        <div class="nav">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>后台管理</el-breadcrumb-item>
                <el-breadcrumb-item>文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>文章发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
            <el-form-item label="文章分类" prop="artType">
                    <el-select v-model="ruleForm.artType" placeholder="请选择文章类型">
                    <el-option label="HTML+CSS" value="HTML+CSS"></el-option>
                    <el-option label="JavaScript" value="JavaScript"></el-option>
                    <el-option label="Vue" value="Vue"></el-option>
                    <el-option label="Node.js" value="Node.js"></el-option>
                    <el-option label="React" value="React"></el-option>
                    <el-option label="生活随笔" value="生活随笔"></el-option>
                    <el-option label="资源分享" value="资源分享"></el-option>
                </el-select>
            </el-form-item>
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="ruleForm.title" style="width:600px"></el-input>
        </el-form-item>
        <el-form-item label="文章描述" prop="artDesc">
            <el-input v-model="ruleForm.artDesc" style="width:600px"></el-input>
        </el-form-item>
         <el-form-item label="图片描述" style="width:400px">
            <el-upload
              class="avatar-uploader"
              action="http://up.qiniup.com"
              :data="uploadData"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
    
        <el-form-item label="文章内容">
            <quill-editor 
              v-model="editorContent"
              ref="myQuillEditor"
            >
              </quill-editor>
        </el-form-item>
        
        <el-form-item >
            <el-button type="primary" @click="submitForm('ruleForm')" size='medium' style="margin-top:20px">提交</el-button>
            <!-- <el-button type="primary" @click='fn'>提交</el-button> -->
            <el-button @click="resetForm('ruleForm')" style="margin-top:20px">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {getUsername,getRole,getInfo} from '@/utils/cookie'
import { AddArticle } from '@/api/login'
import { getToken } from '@/api/user'
export default {
     data() {
      return {
        //文件上传
        imageUrl:'',
        //富文本参数
        editorContent: '',
        uploadData:{
           token:'',
           key:''
        },
         //七牛云文件上传的Token



        time:new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate() +
          " " +
          (function() {
            return new Date().getHours() < 10
              ? "0" + new Date().getHours()
              : new Date().getHours();
          })() +
          ":" +
          (function() {
            return new Date().getMinutes() < 10
              ? "0" + new Date().getMinutes()
              : new Date().getMinutes();
          })() +
          ":" +
          (function() {
            return new Date().getSeconds() < 10
              ? "0" + new Date().getSeconds()
              : new Date().getSeconds();
          })(),
        ruleForm: {
          artType: '',  //文章分类
          title: '',  //文章标题
          artDesc: '',

        },
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
          ],
          artType: [
            { required: true, message: '请选择文章类型', trigger: 'change' }
          ],
          artDesc: [
            {  required: true, message: '请输入文章描述', trigger: 'change' }
          ],
        }
      };
    },
    // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
    // props: ['catchData'], // 接收父组件的方法
   
    methods: {

      //文件上传
      handleAvatarSuccess(res,file){
         let src = `http://llc.xiaofenggege.com/${res.key}`;
         this.imageUrl = src
      },
      beforeAvatarUpload(file){
         //文件名转码
        let tt = file.name;
        let key = encodeURI(`${tt}`);
        this.uploadData.key = key;
      },

      //获取token
      getTokenFn(){
        getToken().then(r=>{
          this.uploadData.token = r.data.token
        })
      },
      
      fn(){
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$refs.upload.submit();
            if( getRole() == 1){
               this.$message.error('您的权限不足，无法发布文章')
               return false
            }
            let data = {
              title:this.ruleForm.title,   //文章标题
              author:getInfo('userId'),
              content:this.editorContent,
              artdesc:this.ruleForm.artDesc,
              artType:this.ruleForm.artType,
              time:this.time,
              picUrl:this.imageUrl,
              readNum:0
            }
            AddArticle(data).then((res)=>{
              if(res.data.code == '200'){
                  this.$message.success(res.data.msg)
              }else{
                this.$message.error(res.data.msg)
              }
            }).catch((err)=>{
            })
            
          } else {
            console.log('error submit!!');
            return false;
          }
      });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
     mounted() {
        this.getTokenFn()
   },
    
}
</script>
<style lang="scss" scoped>
.artSubmit{
    .nav{
        margin: 20px;
    }
  .el-form-item{
      margin-bottom: 22px;
  }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
.quill-editor{
         height:350px;
         margin-bottom: 30px;
     }
</style>
