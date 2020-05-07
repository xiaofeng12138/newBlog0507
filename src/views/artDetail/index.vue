<template>
    <div class="wrap">
        <div class="detail">
         <div class="header">
            <p class="artTitle">{{arrList.title}}</p>
                 <el-row :gutter='10' style="width:60%;text-align:center;margin:auto;">
                        <el-col :span="10"><div class="artTime"> 
                           <i class="iconfont icon-shizhong"></i>
                            {{arrList.time}} </div></el-col>
                        <el-col :span="6"><div class="artTime"> 
                            <i class="iconfont icon-yonghu"></i> {{username}}</div></el-col>
                        <el-col :span="5"><div class="artTime"> 
                            <i class="iconfont icon-fenlei"></i>{{arrList.artType}}</div></el-col>
                        <el-col :span="3"><div class="artTime"> 
                            <i class="iconfont icon-hot"></i>{{arrList.readNum}}</div></el-col>
                </el-row>
                <hr style="color:#E9EAED"/>
            </div>
            <div class="content">
                <div class="ql-snow">
                    <div class="ql-editor" v-html="arrList.content">
                    </div>
                </div>
                <!-- <div class="ql-snow ql-editor" v-html="arrList.content" /> -->
                 <!-- <div class="ql-container ql-snow">
                     {{arrList.content}}
               </div> -->
            </div>
        </div>
          
        <div class="comment">
             <el-divider content-position="center">评论</el-divider>
             <div class="commentBox">
                <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入内容"
                    v-model="comment">
                    </el-input>
                    <el-button type="primary" style="margin-top:10px" @click="submitComment">提  交</el-button>
             </div>
        </div>

        <div class="commentList" v-if="commentData.length > 0">
             <li v-for="(item,index) in commentData">
                 <div class="top">
                     <img src="./img/plIcon.jpg" alt="">
                     {{ item.commentUser}}

                     <!-- <el-button type="primary" size='small' style="width:80px;height:40px;color:#000;font-size:14px;margin-top:10px;margin-left:20px" >回  复</el-button> -->
                 </div>
                 <div class="content">
                    <span style="display:block">{{ item.commentContent}} </span>
                 </div>
                 <div class="time">  {{ item.commentTime}}
                 </div>
             </li>
        </div>
    </div>
</template>
<script>
import  {ArtDetail} from '@/api/login'
import { getCookie,getUsername,getInfo } from '@/utils/cookie'
import  {addComment,queryComment} from '@/api/article'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    data() {
        return {
            arrList:[],
            username:'',
            comment:'',
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
            articleId:'',
            commentData:[]
        }
    },
    mounted() {
        this.queryInfo()
    },
    methods: {
        //评论查询函数
        queryCommentFn(){
             let data = {
                 id:this.articleId
             }
            queryComment(data).then((r)=>{
                if(r.data.code = '200'){
                  this.commentData = r.data.data
                }
            })
        },
        //提交评论
        submitComment(){
           if(getCookie()){
               let data = {
                   commentUser:getUsername(),
                   commentTime:this.time,
                   commentContent:this.comment,
                   articleTitle:this.articleId
               }
               if(!this.comment){
                   this.$message.error('内容不能为空！！')
                   return false
               }else{
                   addComment(data).then(r=>{
                    if(r.data.code == '200'){
                        this.$message.success(r.data.msg)
                        this.comment = ''
                        this.queryCommentFn()
                    }else{
                         this.$message.error(r.data.msg)
                    }
               })
               }
               
           }else{
               this.$message.error('请先登录！！')
           }
        },
        queryInfo(){
            let data = {
               id : this.$route.query.id
            }
            ArtDetail(data).then((res)=>{
                this.arrList = res.data.data
                this.username = res.data.data.author.username
                this.articleId = res.data.data._id
                this.queryCommentFn() //查询文章评论
                if( res.data.code !== '200'){
                  this.$message.error(res.data.msg)
                }
            })
        }
    },
    
}
</script>
<style lang="scss" scoped>
.detail{
    background-color: #fff;
    border: 1px solid rgb(194, 255, 192);
    padding: 10px;
    border-radius:5px;
    .header{
        text-align: center;
        padding-top: 10px;
        height: 80px;
        width: 100%;
        .artTitle{
            font-size: 30px;
            color: #ACACAC;
            margin-bottom: 20px;
        }
        .artTime{
            color: #ACACAC;
            font-size: 16px;
            i{
                margin-right: 5px;
                font-size: bold;
            }
        }
    }
    .content{
        text-indent: 30px;
        line-height: 20px;
        padding: 0 10px;
        margin-top: 10px;
        color: #666;
    }
 


}
.comment{
    width: 100%;
    height: 300px;
    margin-top: 100px;
    background-color: #fff;
    padding-top: 40px;
   .commentBox{
       width: 90%;
       height: 200px;
       margin: 30px auto;
   }
}
.commentList{
    width: 100%;
    padding: 20px 0;
    margin-top: 50px;
    background-color: #fff;
    border-radius: 5px;
    li{
        height: 180px;
        width: 90%;
        margin:20px  auto;
        background-color: #F0F2F7;
        border-radius: 10px;
        margin-bottom: 20px;
        .top{
            height: 60px;
            display: flex;
            font-size: 18px;
            line-height: 70px;
            font-weight: bold;
            
            img{
                width: 50px;
                height: 50px;
                margin-top: 10px;
                margin-left: 10px;
                margin-right: 20px;
            }
        }
        .content{
           display: block;
           height: 80px;
           width:100%;
           font-size: 16px;
           text-indent: 20px;
           margin-top: 10px;
        }
        .time{
           height: 30px;
           font-size: 16px;
           text-indent: 20px;
           line-height: 30px;
           color: #B9C4CD;
        }
    }
    
}

</style>
