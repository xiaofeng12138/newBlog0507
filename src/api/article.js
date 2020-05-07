// 文章处理接口函数

import service from './requset'

//文章阅读量接口
export function addReadNum(data){
    return service.request({
        method: "post",
        url: "/addreadNum",
        data
    })
}

//文章评论接口
export function addComment(data){
    return service.request({
        method: "post",
        url: "/comment",
        data
    })
}

//文章评论查询接口
export function queryComment(data){
    return service.request({
        method: "post",
        url: "/queryComment",
        data
    })
}

//文章阅读量查询接口
export function Rank(data={}){
    return service.request({
        method: "post",
        url: "/rank",
        data
    })
}

//文章评论返回接口
export function commentList(data={}){
    return service.request({
        method: "post",
        url: "/commentlist",
        data
    })
}

//文章评论删除接口
export function delComment(data={}){
    return service.request({
        method: "post",
        url: "/delcomment",
        data
    })
}

//生活随笔文章类型查询接口
export function queryLife(data){
    return service.request({
        method: "post",
        url: "/queryLife",
        data
    })
}

//资源分享文章类型查询接口
export function queryResource(data){
    return service.request({
        method: "post",
        url: "/queryResource",
        data
    })
}

//前端基础文章类型查询接口
export function JC(data){
    return service.request({
        method: "post",
        url: "/jc",
        data
    })
}

//前端js分类
export function JS(data){
    return service.request({
        method: "post",
        url: "/js",
        data
    })
}

//前端框架分类
export function KJ(data){
    return service.request({
        method: "post",
        url: "/kj",
        data
    })
}

