<template>
    <div class="footer">
      <el-row :gutter='20'>
        <el-col :span="8"><div class="f_left">版权所有 © 2020 晓风个人博客</div></el-col>
        <el-col :span="6"><div class="f_mid"> -</div></el-col>
        <!-- <el-col :span="8"><div class="f_right"><a href="http://icp.chinaz.com/info?q=xiaofenggege.com" target="_Blank" >备案号:皖ICP备18010820号</a></div></el-col> -->
        <el-col :span="10"><div class="f_right">备案号:皖ICP备18010820号</div></el-col>
     </el-row>
      
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scope>
.footer{
  height: 50px;
  width: 100%;
  margin:auto;
  margin-top: 20px;
  background-color: #F1F5F8;
  line-height: 50px;
  overflow:hidden;
  div{
    font-size: 18px;
    text-align: center;
    .f_mid{
      color: #F1F5F8;
    }
    
  }
}

</style>

