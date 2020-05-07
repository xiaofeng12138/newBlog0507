import service from './requset'



//用户权限修改
export function updateRole(data){
    return service.request({
        method: "post",
        url: "/updateRole",
        data
    })
}

//获取七牛云token
export function getToken(data={}){
    return service.request({
        method: "post",
        url: "/getToken",
        data
    })
}