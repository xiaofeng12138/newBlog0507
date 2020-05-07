import service from './requset'


//添加留言
export function addMessage(data){
    return service.request({
        method: "post",
        url: "/addMessage",
        data
    })
}

//查询留言
export function queryMessage(data={}){
    return service.request({
        method: "post",
        url: "/queryMessage",
        data
    })
}


//删除留言
export function delMessage(data={}){
    return service.request({
        method: "post",
        url: "/delmessage",
        data
    })
}
