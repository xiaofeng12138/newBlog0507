<template>
    <div>
		<el-carousel :interval="4000" type="card" height="250px">
			<el-carousel-item><a href="https://cn.vuejs.org/" target="_blank"><img src="./img/4.png" alt=""></a></el-carousel-item>
			<el-carousel-item><a href="https://react.caibaojian.com/" target="_blank" ><img src="./img/3.png" alt=""></a></el-carousel-item>
			<el-carousel-item><a href="http://nodejs.cn/" target="_blank"><img src="./img/1.png" alt=""></a></el-carousel-item>
			<el-carousel-item><a href="https://www.runoob.com/js/js-tutorial.html" target="_blank"><img src="./img/2.png" alt=""></a></el-carousel-item>
			<el-carousel-item><a href="https://www.runoob.com/html/html-tutorial.html" target="_blank"><img src="./img/5.png" alt=""></a></el-carousel-item>
		</el-carousel>
    </div>
</template>
<script>
export default {
    data(){
        return{
        }
    },
       
}
</script>

<style scoped>
  img{
	  width: 100%;
	  height: 100%;
  }

</style>


