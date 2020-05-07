import { asyncRouter,defaultRouter} from "@/router/index.js"
import { getRole } from '@/utils/cookie'
const state ={
    userRouter:defaultRouter,
    allRouter:[],
    newRouter:[]
}

const getters = {
    userRouter:state =>state.userRouter , //用户初始化路由
    allRouter:state =>state.allRouter, //用户最终路由
    newRouter:state =>state.newRouter, //用户新增路由
}
const mutations ={
    SET_NEWROUTERS(state,value){
      state.allRouter = defaultRouter.concat(value)
      state.newRouter = value
   }
}

const actions={
    createRouters({commit},data){
        return new Promise((resolve,reject)=>{
            let newRouters = []  //表示新增加的路由
            //超管状态，不需要匹配
            if(getRole()> 100){
               newRouters = asyncRouter
            }else{
                let lastRouter = [asyncRouter[asyncRouter.length - 1]]
                newRouters = lastRouter
            }
            commit('SET_NEWROUTERS',newRouters)
            resolve() //告知外面 内部已经处理完成 一定要返回
        })
    }
}

export default {
  namespaced:true,  
  state,
  actions,
  getters,
  mutations,
};