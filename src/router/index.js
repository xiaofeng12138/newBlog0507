import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

//使用动态路由的方式处理权限

export const defaultRouter = [
          { 
            path: "/",
            name:'index',
            redirect:'/index',
            component:resolve=>require(['@/views/layout'],resolve),
            children:[
                  {
                    path:"/index",
                    name:"Index",
                    meta:'首页',
                    component:resolve=>require(['@/views/index/index.vue'],resolve),
                  }
                ]
          },

          { 
            path: "/study",
            name: "Study",
            component:resolve=>require(['@/views/layout'],resolve),
            children:[
              { 
                path: "/studyInfo",
                name: "StudyInfo",
                meta:'资源分享',
                component:resolve=>require(['@/views/study'],resolve),
              }
            ]
          },

          {
             path: "/life",
             name: "Life",
             component:resolve=>require(['@/views/layout'],resolve),
             children:[
                { 
                    path: "/lifeInfo",
                    name: "LifeInfo",
                    meta:'生活随笔',
                    component:resolve=>require(['@/views/life'],resolve),
                }
              ]
          },

          { 
            path: "/myself",
            name: "Myself",
            component:resolve=>require(['@/views/layout'],resolve),
            children:[
               { 
                 path: "/myselfInfo",
                 name: "MyselfInfo",
                 meta:'博主简介',
                 component:resolve=>require(['@/views/myself'],resolve),
                }
            ]
          },

                {
                  path: "/JC",
                  name: "JC",
                  component:resolve=>require(['@/views/layout'],resolve),
                  children:[
                    { 
                      path: "/JCinfo",
                      name: "JCinfo",
                      meta:'前端基础',
                      component:resolve=>require(['@/views/studyType/jc.vue'],resolve),
                    },
                  ]
              },
              {
                path: "/JS",
                name: "JS",
                component:resolve=>require(['@/views/layout'],resolve),
                children:[
                  { 
                    path: "/JSinfo",
                    name: "JSinfo",
                    meta:'js部分',
                    component:resolve=>require(['@/views/studyType/js.vue'],resolve),
                  }
                ]
            },
            {
              path: "/KJ",
              name: "KJ",
              component:resolve=>require(['@/views/layout'],resolve),
              children:[
                { 
                  path: "/KJinfo",
                  name: "KJinfo",
                  meta:'框架部分',
                  component:resolve=>require(['@/views/studyType/kj.vue'],resolve),
                }
              ]
          },
          {
            path: "/message",
            name: "message",
            component:resolve=>require(['@/views/layout'],resolve),
            children:[
              { 
                path: "/messageInfo",
                name: "messageInfo",
                meta:'留言板',
                component:resolve=>require(['@/views/message/index.vue'],resolve),
              }
            ]
        },
          { 
            path: "/artDetail",
            name: "ArtDetail",
            component:resolve=>require(['@/views/layout'],resolve),
            children:[
              {
                path:'/artDetailInfo',
                name: "ArtDetailInfo", 
                meta:'文章详情',
                component:resolve=>require(['@/views/artDetail'],resolve),
              },
            ]
          },
          //搜索路由
          { 
            path: "/search",
            name: "Search",
            component:resolve=>require(['@/views/layout'],resolve),
            children:[
              {
                path:'/searchInfo',
                name: "SearchInfo", 
                meta:'文章搜索',
                component:resolve=>require(['@/views/search'],resolve),
              },
            ]
          },
          {
            path:'/login',
            name: "Login", 
            meta:'登录',
            component:resolve=>require(['@/views/login'],resolve),
          },
        
]


//管理员后台管理路由
export const asyncRouter = [
    //后台管理首页
    {
      path:'/adminView',
      name: "AdminView", 
      redirect:'/adminIndex',
      component:resolve=>require(['@/views/admin'],resolve),
      children:[
          {
            path:'/adminIndex',
            name: "adminIndex",
            meta:'后台首页',
            component:resolve=>require(['@/views/admin/adminview/index'],resolve),
          },
        ]
    },
    //后台管理文章查询
    {
      path:'/artManage',
      name: "ArtMangae", 
      component:resolve=>require(['@/views/admin'],resolve),
      children:[
          {path:'/artSubmit',name: "ArtSubmit", meta:'文章发表', component:resolve=>require(['@/views/admin/artManage/artsubmit.vue'],resolve),},
          {path:'/artSearch',name: "ArtSearch", meta:'文章列表',component:resolve=>require(['@/views/admin/artManage/artSearch.vue'],resolve)},
        ]
    },
    {
      path:'/usersManage',
      name: "userMangae",   //用户查询
      component:resolve=>require(['@/views/admin'],resolve),
      children:[
          {path:'/queryUsers',name: "queryUsers", meta:'用户列表',component:resolve=>require(['@/views/admin/userManage/usersManage.vue'],resolve)},
          {path:'/querycomment',name: "querycomment", meta:'评论列表',component:resolve=>require(['@/views/admin/comment/index.vue'],resolve)},
          {path:'/querymessage',name: "querymessage", meta:'留言列表',component:resolve=>require(['@/views/admin/message/index.vue'],resolve)},
        ]
    },
    
    {path:'*',name: "Not",  meta:'404',component:resolve=>require(['@/views/404.vue'],resolve),}
]

// const routes = defaultRouter.concat(asyncRouter)
const routes = defaultRouter

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
