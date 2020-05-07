import { getUsername } from '@/utils/cookie'

const state ={
    token:'',
    userName:getUsername() || '',
}

const mutations ={
    set_Token(state,value){
        state.token = value
    },
    set_userName(state,value){
        state.userName = value
      },
}

export default {
  namespaced:true,  
  state,
  mutations,
};