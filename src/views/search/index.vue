<template>
    <div class="article">

        <!-- 文章列表头部 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>搜索文章列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 文章列表 -->
        <div class="noArt" v-if="ArtInfoList.length == 0">
            <p>暂无相关内容</p>
            <img src="@/assets/unhappy.png" alt="" class="unhappy">
        </div>
        <div class="artList" v-for="(item,index) in ArtInfoList" :key="index" v-else>
            <div class="a_left">
                 <img :src = item.picUrl alt="">
                <!-- <img :src="`http://127.0.0.1:8080/#${item.picUrl.trim()}`"  alt=""> -->
            </div>
            <div class="a_right">
                <el-row :gutter='10'>
                    <el-col :span="8"><div class="artType">{{ item.artType }}</div></el-col>
                    <el-col :span="16"><div class="artTitle">  {{ item.title}} </div></el-col>
                </el-row>
                <div class="artContent">
                     {{item.artdesc}}
                </div>
                <div class="artBottom">
                      <el-row :gutter='20'>
                        <el-col :span="8"><div class="artTime"> 
                           <i class="iconfont icon-shizhong"></i>
                            {{item.time}}</div></el-col>
                        <el-col :span="5"><div class="artAuthor"> 
                            <i class="iconfont icon-yonghu"></i> {{item.author.username}}</div></el-col>
                        <el-col :span="5"><div class="artAuthor"> 
                            <i class="iconfont icon-hot"></i> {{item.readNum}}</div></el-col>
                        <el-col :span="6"><div class="artDetail" @click="readInfo(item._id)">  阅读详情>> </div></el-col>
                    </el-row>
                </div>
            </div>
        </div>

        <el-pagination
            background
            layout="prev, pager, next,total"
            :total="this.total"
            @current-change="this.currentPageChange"
            >
        </el-pagination>
    </div>
</template>

<script>
import {Search} from '@/api/login'
import {addReadNum} from '@/api/article'
export default {
    data() {
        return {
            ArtInfoList:[],
            total:0,
        }
    },

    mounted() {
        this.getInfoList(1)
        
    },

    methods: {  
     getInfoList(page){
         let data = {
             page:page,
             value:this.$route.query.id
         }
       Search(data).then((res)=>{
          this.ArtInfoList = res.data.data
          this.total = res.data.count
       }).catch((err)=>{
       })
     },

      currentPageChange(currentPage) {
        this.getInfoList(currentPage);
    },


     readInfo(t){
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
    
}
</script>
<style lang="scss" scoped>
.article{
    .noArt{
        width: 100%;
        height: 200px;
        margin: 20px 0;
        display: flex;
        background-color: #fff;
        p{
          font-size: 20px;
          text-align: center;
          line-height: 200px;
          margin-left: 300px;
          color: #666;
        }
        .unhappy{
            display: inline-block;
            width: 120px;
            height: 100px;
            padding-top: 50px;
        }
    }
    .artList{
        width: calc(100% - 5 );
        display: flex;
        justify-content: space-between;
        height: 200px;
        margin: 20px 0;
        box-shadow: #666 5px 5px 5px ; 
        border: 2px solid #e9e9e9;
        .a_left{
            width: 30%;
            height: 100%;
            img{
                height: 180px;
                width: 90%;
                margin: auto;
                margin-top: 10px;
            }
        }
        .a_right{
            width: 69%;
            height: 100%;
            background-color: #FFFFFF;
            .el-row {
                margin-bottom: 10px;
                &:last-child {
                  margin-bottom: 0;
                }
            }
            .artType {
                background: #06AAFF;
                font-size: 18px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                color: #fff;
                border-radius: 20px;
                margin-top: 10px;
                margin-left: 10px;
            }
            .artTitle {
                font-size: 20px;
                height: 30px;
                line-height: 30px;
                margin-top: 10px;
                margin-left: 10px;
                cursor: pointer;
                font-weight: bold;
            }
            .artContent{
                height: 100px;
                width: 95%;
                display:-webkit-box;
                -webkit-line-clamp:3;
                -webkit-box-orient:vertical;
                overflow:hidden;
                font-size: 16px;
                text-indent: 30px;
                line-height: 35px;
                padding: 0 10px;
                color:#CDB8B9;
            }
            .artBottom{
                margin-top: 15px;
                margin-left: 10px;
                .artTime{
                    font-size: 16px;
                }
                .artAuthor{
                   font-size: 16px;
                }
                .artDetail{
                   height: 30px;
                   font-size: 16px;
                   background-color: #DDDDDD;
                   color:#098FFF;
                   margin-right: 10px;
                   text-align: center;
                   cursor: pointer;
                   line-height: 30px;
                   text-align: center;
                }
              }
           
            }
    }
     .artList:hover{
          transition: all 1s ease;
        img{
            transform: scale(1.1);
        }
    }
    .el-pagination{
       text-align: center;
   }
}
</style>

