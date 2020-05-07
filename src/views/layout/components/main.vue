<template>
<div class="boxWrap">
     <div class="box">
          <router-view />
        </div>
     <div class="sidebar">
         <div class="s_top">
               <el-tabs v-model="activeName">
                  <el-tab-pane name="first">
                    <span slot="label"><i class="iconfont icon-gonggao" style="padding-left:10px"></i> 公告</span>
                     <div class="desc">
                         <p>晓风个人博客</p>
                         <p>座右铭：付出不亚于任何人的努力  谦虚戒骄</p>
                         <p>博客简介：<br/>
                            前端：Vue2.0版本，<br/>
                            后端：Node.js+Express<br/>
                            数据库：Mongodb数据库（只会这个）手动滑稽<br/>
                            UI：ElementUI<br/>
                            图片上传：七牛云+Node.js<br/>
                        </p>
                        </div>
                </el-tab-pane>
            </el-tabs>
             
         </div>
          <div class="readNum">
               <el-tabs v-model="activeName">
                  <el-tab-pane name="first">
                    <span slot="label"><i class="iconfont icon-hot" style="padding-left:10px"></i> 阅读排行</span>
                     <div class="readlist">
                        <li v-for="(item,index) in rankData" :key="index" @click="godetail(item._id)">
                            <span>{{index + 1 }}</span>
                            <p>{{item.title}}</p>
                        </li>
                    </div>
                </el-tab-pane>
            </el-tabs>
             
         </div>
         <div class="readNum">
               <el-tabs v-model="activeName">
                  <el-tab-pane name="first">
                    <span slot="label"><i class="iconfont icon-lianjie" style="padding-left:10px"></i> 友情链接</span>
                     <div class="readlist">
                        <li >
                            <span>1</span>
                            <p><a href="http://www.web-jshtml.cn/" target="_blank"> 手把手撸码前端</a></p>
                        </li>
                        <li >
                            <span>2</span>
                            <p><a href="https://juejin.im/post/5d23e750f265da1b855c7bbe?tdsourcetag=s_pcqq_aiomsg" target="_blank"> 前端面试题（壹题）</a></p>
                        </li>
                         <li >
                            <span>3</span>
                            <p><a href="https://iblossomspace.com/" target="_blank"> 绫玖玖博客</a></p>
                        </li>
                        <li >
                            <span>4</span>
                            <p><a href="http://www.webzzw.xyz/blog" target="_blank"> ZZW前端博客</a></p>
                        </li>
                        <li >
                            <span>5</span>
                            <p><a href="https://cn.vuejs.org/" target="_blank"> Vue官网</a></p>
                        </li>
                    </div>
                </el-tab-pane>
            </el-tabs>
             
         </div>
     </div>
     </div>
</template>
<script>
import { Rank ,addReadNum} from  '@/api/article'
export default {
    data() {
        return {
             activeName: 'first',
             rankData:[]
        }
    },

    methods: {
        queryRank(){
           Rank().then(r=>{
               this.rankData = r.data.data
               if(r.data.data.length >5){
                  this.rankData = r.data.data.slice(0,5)
               }else{
                   this.rankData = r.data.data
               }
                   
           })
        },

        godetail(t){
          let id = t
          addReadNum({ id:id}).then(r=>{
               if(r.data.code == '200'){
                    this.$router.push({
                    name:'ArtDetailInfo',
                    query:{id:id}
                 })
               }else{
                   this.$message.error('数据库查询有误！！')
                   return false
               }
          })
        }
    },

    mounted() {
        this.queryRank()
    },
    
}
</script>
<style lang="scss" scope>
.boxWrap{
    display: flex;
    width: 60%;
    margin: auto;
    // height: 500px;
    margin-top:20px;
    justify-content: space-between;
.box{
    width: 72%;
    // background-color: #ccc;
}
 .sidebar{
    width: 25%;
    .s_top{
       width: 100%;
       background-color: #F3F9FF;
       margin-bottom: 20px;
       .desc{ 
           width: 95%;
           margin: auto;
           p{
               font-size: 15px;
               color: #666;
               line-height: 1.5;
               margin-bottom: 7px;
           }

       }
     }
   }
   .readNum{
      width: 100%;
       background-color: #F3F9FF;
       margin-bottom: 20px;
      .readlist{
          li{
              height: 30px;
              width: 290px;
              margin: 5px 0;
              display: flex;
              background-color: #eee;
              cursor: pointer;
              span{
                  display: block;
                  height: 30px ;
                  width: 30px ;
                  font-size: 14px;
                  line-height: 30px;
                  text-align: center;
                  background-color: #ccc;
                  margin-right: 10px;
                  color: #fff;
              }
              p:hover{
                  background-color: #CDE6EA;
                  transition: all 1s;
              }
              p{
                  display: inline-block;
                  width: 260px;
                  height: 30px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  line-height: 30px;
                  a{
                      color: #000;
                  }
              }
          }
      }
   }
}
</style>

