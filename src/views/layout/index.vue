<template>
    <div>
        <Header/>
        <Main/>
        <Footer/>
        <img src="@/assets/rockets.png" alt="" class="sbtnFlag" v-if="btnFlag" @click="backTop">
    </div>
</template>


<script>
import Header from './components/header'
import Main from './components/main'
import Footer from './components/footer'

export default {

    components:{
         Header,Main,Footer
        },

    data() {
        return {
                backgroundImage: "url(" + require("@/public/32.jpg") + ")",
                btnFlag:false,
        }
    },
    mounted() {
        this.setBodyBackGround()
        window.addEventListener('scroll',this.scrollToTop)
    },
    methods: { 
         setBodyBackGround () {
            document.body.style.backgroundSize = '100%'
            document.body.style.backgroundImage = this.backgroundImage
         },
          backTop () {
                const that = this
                let timer = setInterval(() => {
                    let ispeed = Math.floor(-that.scrollTop / 5)
                    document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
                    if (that.scrollTop === 0) {
                      clearInterval(timer)
                    }
                }, 16)
         },

         scrollToTop () {
                const that = this
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                that.scrollTop = scrollTop
                if (that.scrollTop > 200) {
                  that.btnFlag = true
                } else {
                  that.btnFlag = false
                }
            }

    },
    destroyed() {
      window.removeEventListener('scroll',this.scrollToTop)
    },
    
}
</script>
<style lang="scss" scope>
.sbtnFlag{
    display: block;
    height: 80px;
    width: 80px;
    position: fixed;
    right: 250px;
    bottom: 100px;
    cursor: pointer;
}
</style>

