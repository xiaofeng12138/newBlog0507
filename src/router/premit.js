import router from './index.js'
import { getCookie,removeCookie,removeUsername,getRole,getInfo} from '../utils/cookie'
import { Message } from 'element-ui'
import store from '@/store'
import {defaultRouter,asyncRouter} from './index.js'
import { checkAdmin } from '@/api/login'

router.beforeEach((to,from,next)=>{
   window.document.title = to.meta == undefined?'XF_blog':(to.meta)  + ' | XF_blog'
   if(getCookie() && getRole() > 100 ){  //表示用户为管理员
       if(store.getters['Permission/allRouter'].length  < 13){
         store.dispatch('Permission/createRouters','').then(r=>{
            let newRouter =  store.getters['Permission/newRouter'] //获取匹配到的路由
            let allRouters =  store.getters['Permission/allRouter'] //获取所有的路由
            router.options.routes = allRouters  //修改页面路由显示
            router.addRoutes(newRouter)
            next()
        })
       }else{
          next()

       }
   }else{ 
      if(store.getters['Permission/allRouter'].length != 8){
         store.dispatch('Permission/createRouters','').then(r=>{
            let newRouter =  store.getters['Permission/newRouter'] //获取匹配到的路由
            let allRouters =  store.getters['Permission/allRouter'] //获取所有的路由
            router.options.routes = allRouters  //修改页面路由显示
            router.addRoutes(newRouter)
            next()
       })
      }else{
         next()
      }
   }
})