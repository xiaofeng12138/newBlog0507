<template>
    <div class="nav">
         <div class="img">
            <img src="@/assets/logo.png" alt="" @click="goHome">
            <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            background-color ='transparent'
             text-color='#fff'
            active-text-color	="#639FB5"
            router
          >
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>后台首页</span>
                </template>
                <el-menu-item index="artSubmit">文章发布</el-menu-item>
                <el-menu-item index="artSearch">文章查询</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>文章管理</span>
                </template>
                <el-menu-item index="artSubmit">文章发布</el-menu-item>
                <el-menu-item index="artSearch">文章查询</el-menu-item>
               
            </el-submenu>
             <el-submenu index="3">
                <template slot="title">
                <i class="el-icon-printer"></i>
                <span>用户管理</span>
                </template>
                <el-menu-item index="queryUsers">用户查询</el-menu-item>
                <el-menu-item index="querycomment">评论查询</el-menu-item>
                <el-menu-item index="querymessage">留言查询</el-menu-item>
            </el-submenu>
            </el-menu>


        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           
        }
    },

    // computed:()=>{
    //     this.defaultActive = this.$route.path
      
    // },

    computed: {
       defaultActive:function (){
           console.log(this.$route.path)
           return this.$route.path
       }
    },

    methods: {
          goHome(){
              this.$router.push('/')
          }
    }
}
</script>
<style lang="scss" scoped>
.nav{
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background-color: #3D6B8C;
    .img{
         width:240px; 
         height: 150px;
         img{
             margin: auto;
             display: block;
             width: 150px;
             height: 150px;
             cursor: pointer;
         }
     }
}
</style>


