<template>
    <div class="article">
        <!-- 留言板头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>留言板</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="bgImg">
            <img src="./img/langwl.gif" alt="">
        </div>
        <div class="showMessage">
            请勿发表广告、色情、违法的言论信息,谢谢！！
            <img src="./img/wl.gif" alt="">
        </div>
          <div class="comment">
             <el-divider content-position="center">留言板</el-divider>
             <div class="commentBox">
                <el-input
                    type="textarea"
                    :rows="8"
                    placeholder="请输入您的留言。。。"
                    v-model="message">
                    </el-input>
                    <el-button type="primary" style="margin-top:10px" @click="submitMessage">提  交</el-button>
             </div>
        </div>

        <div class="commentList">
             <el-divider content-position="center" style="color:#f00">留言列表，共 {{this.allNumber}} 条留言</el-divider>
             <li v-for="(item,index) in showData" :key="index">
                 <div class="top">
                     <img src="./img/plIcon.jpg" alt="">
                     <span>
                         <i class="iconfont icon-yonghu"></i>
                         {{item.messageUser}}
                     </span>
                      <span>
                          <i class="iconfont icon-shizhong"></i>
                           {{item.messageTime}}
                     </span>
                 </div>
                 <div class="content">
                    <span style="display:block">{{item.messageContent}}</span>
                 </div>
             </li>
             <el-pagination
                    background
                    layout="prev, pager, next,total"
                    :total="this.allNumber"
                    :page-size= '5'
                    @current-change="this.currentPageChange"
                >
             </el-pagination>
        </div>
    </div>
</template>

<script>
import { addMessage ,queryMessage} from '@/api/message'
import { getUsername,getCookie } from '@/utils/cookie'

export default {
    data() {
        return {
            showData:[],
            allNumber:0,
            message:'',
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
        }
    },

    mounted() {
       this.showMessageFn(1)
    },

    methods: { 
        //翻页函数
        currentPageChange(currentPage) {
          this.showMessageFn(currentPage);
       },

        //留言查询函数
        showMessageFn(page){
            let data = {
                page:page,
                sizee:5
            }
            queryMessage(data).then(r=>{
                this.showData = r.data.data
                this.allNumber = r.data.count
            })
        },

        submitMessage(){
          let data = {
              messageUser:getUsername(),
              messageTime:this.time,
              messageContent:this.message
          }
          if(!getCookie()){
             this.$message.error('请先登录！！')
          }else{
            if(this.message){
                addMessage(data).then(r=>{
                if(r.data.code =='200'){
                    this.$message.success(r.data.msg)
                    this.message = ''
                    this.showMessageFn(1)
                }else{
                     this.$message.error(r.data.msg)
                }
            })
            }else{
                this.$message.error('留言内容不能为空！！')
            }
          }
        } 
     
    },
    
}
</script>
<style lang="scss" scoped>
.el-divider__text{
  color: #B67B81;
  font-size: 18px;
}
.bgImg{
    width: 100%;
    height: 230px;
    border-radius: 10px;
    margin-top: 20px;
    img{
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }
}
.showMessage{
    height: 60px;
    background-color: #F8D7DA;
    display: flex;
    line-height: 60px;
    margin-top: 20px;
    text-align: center;
    padding-left: 200px;
    font-size: 16px;
    color: #B67B81;
    border-radius: 10px;
    img{
        height: 50px;
        width: 50px;
        margin-left: 50px;
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
    text-align: center;
    li{
        height: 120px;
        width: 90%;
        margin:20px  auto;
        background-color: #F0F2F7;
        border-radius: 10px;
        margin-bottom: 20px;
        .top{
            height: 60px;
            display: flex;
            font-size: 18px;
            line-height: 60px;
            font-weight: normal;
            border-bottom: 1px solid #fff;
            color: #409EFF;
            img{
                width: 50px;
                height: 50px;
                margin-top: 10px;
                margin-left: 10px;
                margin-right: 20px;
            }
            span{
                margin-left: 20px;
            }
        }
        .content{
           display: block;
           height: 60px;
           width:100%;
           font-size: 16px;
           text-indent: 20px;
           margin-top: 10px;
           text-align: left;
        }
    }
}
.el-pagination{
    margin-top:20px;
   }
</style>

