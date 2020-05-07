<template>
    <div class="comment">
        <div class="nav">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>后台管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>评论查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="table">
             <el-table
            :data="tableData"
            :header-cell-style="{background:'#e9e9e9',color:'#606266',fontWeight:'bold'}"
            border
            style="width: 100%">
            <el-table-column
            prop="commentUser"
            label="评论人"
            align="center"
           >
            </el-table-column>
            <el-table-column
            prop="commentTime"
            label="评价时间"
            align="center"
           >
            </el-table-column>
            <el-table-column
            prop="commentContent"
            align="center"
            label="评价内容"
            >
            </el-table-column>
             <el-table-column
            prop="articleTitle.title"
            align="center"
            label="评论文章"
             >
            </el-table-column>
            <el-table-column
             prop="articleTitle.readNum"
            align="center"
            label="文章阅读量"
             >
            </el-table-column>
            <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
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
import { commentList,delComment } from '@/api/article'
export default {
    data() {
        return {
         tableData: [] ,
         total:0,
        }
    },
    mounted() {
        this.fn(1)
        
    },
    methods: {

        fn(page){
            let data = {
              page:page
          }
            commentList(data).then((res)=>{
              this.tableData = res.data.data
              this.total = res.data.count

            })
        },
      handleDelete(index, row) {
                this.$confirm('确定要删除这条评论吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                    }).then(() => {
                        let data = {
                            id:row._id
                        }
                        delComment(data).then((res)=>{
                        if(res.data.code == '200'){
                            this.$message.success(res.data.msg)
                            this.fn(1);
                        }else{
                            this.$message.error(res.data.msg)
                          }
                        })
                    }).catch(() => {
                });
      
        },

      //翻页
       currentPageChange(currentPage) {
        this.fn(currentPage);
     },
    },
    
}
</script>
<style lang="scss" scoped>
.comment{
    .nav{
        margin: 20px;
    }
    .table{
        margin-top: 20px;
        width: 98%;
        margin:20px auto
    }
    .el-pagination{
    text-align: center;
   }

}
</style>




