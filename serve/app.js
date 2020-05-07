const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')
const db = require('./db')
const session = require('express-session')
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const qiniu = require('qiniu');
const crypto = require('crypto'); //密码加密模块

// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


//设置用户session
app.use(session({
    secret : 'xiaofeng', // 对session id 相关的cookie 进行签名
    resave :true,
    rolling:true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 60, // 设置 session 的有效时间，单位毫秒
    },
},));


//获取七牛云的token
var accessKey = 'DDinTpKdKIJi9NA0q2nMoJV-296wps2DYD5JUxb8';
var secretKey = 'POvLMBoC-EnwHWvwaJVkCjzLVvYuGl9TOVnzBpRv';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
   scope: 'xiaofenggeg',
 };
 var putPolicy = new qiniu.rs.PutPolicy(options);
 var uploadToken = putPolicy.uploadToken(mac);

 
 app.use('/getToken',(req,res)=>{
    let token = uploadToken
    res.send({msg:'token获取成功',code:'200',token:token})
 })
 

//注册模块
app.use('/reg',(req,res)=>{
   let { username,password,repasswd,time} = req.body;
   db.User.findOne({username}).then((users)=>{
      if(users){
         res.send({msg:'用户名已存在',code:'500'})
         return
      }else{
         const c = crypto.createHash('sha256');
         const password = c.update(req.body.password).digest('hex');

         res.send({msg:'注册成功',code:'200'})
         db.User.create({
            username,
            password,
            time
         })
      }
   })
})




//登录模块
app.use('/login',(req,res,next)=>{
  let { username,password } = req.body;
  const c = crypto.createHash('sha256');
  const newPsd = c.update(req.body.password).digest('hex');

  db.User.findOne({username}).then(r=>{
     if(r){
        let psd = r.password;
        if(newPsd != psd){
         res.send({msg:'密码错误',code:'500'})
         return false
        }else{
               let userId = r._id;
               let content = r.username
               let role = r.role
               let secretOrPrivateKey = "123456" // 这是加密的key（密钥） 
               let  token = jwt.sign({
                  content,
                  secretOrPrivateKey
              }, 'my_token', { expiresIn: '0.5h' });
              res.send({msg:'登录成功',code:'200',token:token,username:content,role:role,userId:userId})
        }

     }else{
      res.send({msg:'用户名不存在，请注册后在登录',code:'500'})
      return false
     }
  })
})

//文章发表模块

app.use('/AddArticle',(req,res)=>{
   let { title,author,time,content,artdesc,artType,picUrl,readNum } = req.body;
   db.User.find({_id:author},(err,docs)=>{
     if(err){
      res.send({msg:'服务器错误，请重试',code:'500'})
      return
     }
     if(docs.length == '0'){
        res.send({msg:'该用户不存在请注册后再发布',code:'500'})
        return
     }else{
      db.Article.create({
         title,
         author,
         time,
         content,
         artdesc,
         artType,
         picUrl,
         readNum
      }).then((resp)=>{
           res.send({msg:'文章发表成功',code:'200'})
      }).catch((err)=>{
         res.send({msg:'文章发表失败',code:'500'})
      })
     }
   })

})

//文章列表返回
app.use('/articleList',(req,res)=>{
    let count = 0
    db.Article.find().countDocuments().then((r)=>{
      count = r
      let page = req.body.page ;
      db.Article.find().populate('author')
      .sort({time:-1})
      .skip(10*(page - 1))  //跳过多少页
      .limit(10)            //每页显示几条
      .then((resp)=>{
         res.send({data:resp,msg:'请求成功',code:'200',count})
      }).catch((err)=>{
         res.send({msg:'请求失败',code:'500'})
         return err;
      })
      }).catch((err)=>{
         res.send({msg:'请求失败',code:'500'})
         return err
      }) 
})

//文章删除接口
app.use('/delArticle',(req,res)=>{
   let id = req.body.id
   db.Article.deleteOne({_id:id}).then((resp)=>{
      res.send({msg:'数据删除成功',code:'200'})
   }).catch((err)=>{
      res.send({msg:'数据删除失败',code:'500'})
      return err
   })
})


//文章详情接口
app.use('/artDetail',(req,res)=>{
   let id = req.body.id
   if(!id){
      res.send({data:[],msg:'未查询到数据',code:'500'})
      return false
   }
   db.Article.findOne({_id:id}).populate('author').then((resp)=>{
       res.send({data:resp,msg:'数据查询成功',code:'200'})
   }).catch((err)=>{
      res.send({data:[],msg:'未查询到数据',code:'500'})
      return err
   })
})

//阅读量增加接口
app.use('/addreadNum',(req,res)=>{
    let id = req.body.id
    db.Article.findOne({_id:id}).then((resp)=>{
       let num = resp.readNum + 1
      resp.updateOne({readNum:num}).then(r=>{
         res.send({msg:'数据修改成功',code:'200'})
      }).catch((err)=>{
         res.send({msg:'数据修改失败',code:'500'})
         return err
      })
    })
})


//文件上传模块

// let storage = multer.diskStorage({
//    //存储的位置
//    //destination: path.join(process.cwd(),'public/upload'),
//    //重命名文件函数
//    destination: path.join(__dirname,'../upload'),
//    filename(req,file,cb){
//      const filename = file.originalname.split('.');
//      cb(null,`${Date.now()}.${filename[filename.length -1]}`)
//    }
// })

// const upload = multer({
//    storage:storage
// })
// app.use('/upload',(req,res)=>{
//  upload.single('file')(req,res,(err)=>{
//   if(err){
//     return res.send({msg:'文件上传失败',code:'500'})
//    }
//    res.send({msg:'图片上传成功',code: '200', data: {
//    src: `/upload/${req.file.filename}`
//     }})  
//  })
// })


//文章搜索接口
app.use('/search',(req,res)=>{
    let count = 0
    let value = req.body.value;  //搜索关键字
    db.Article.find({"artdesc":{$regex: value }}).countDocuments().then((r)=>{  
      count = r
      let page = req.body.page ;   //搜索分页
      db.Article.find({"artdesc":{$regex: value }}).populate('author')  //模糊查询文章表中artdesc字段的内容
      .sort({time:-1})
      .skip(10*(page - 1))     //跳过多少页
      .limit(10)         //每页显示几条
      .then((resp)=>{
         res.send({data:resp,msg:'请求成功',code:'200',count:count})
      }).catch((err)=>{
         res.send({msg:'请求失败',code:'500'})
      })
      }).catch((err)=>{
         res.send({msg:'请求失败',code:'500'})
         return err
      }) 
})


//用户查询接口
app.use('/queryUser',(req,res)=>{
   let count = 0
    db.User.find().countDocuments().then((r)=>{
      count = r
      let page = req.body.page ;
      db.User.find()
      .sort({time:-1})
      .skip(10*(page - 1))     //跳过多少页
      .limit(10)         //每页显示几条
      .then((resp)=>{
         res.send({data:resp,msg:'请求成功',code:'200',count:count})
      }).catch((err)=>{
         res.send({msg:'请求失败',code:'500'})
      })
      }).catch((err)=>{
         res.send({msg:'请求失败',code:'500'})
         return err
      }) 
})


//用户删除接口
app.use('/delUser',(req,res)=>{
   let id = req.body.id
   db.User.deleteOne({_id:id}).then((resp)=>{
      res.send({msg:'数据删除成功',code:'200'})
   }).catch((err)=>{
      res.send({msg:'数据删除失败',code:'500'})
      return err
   })
})


//修改用户权限
app.use('/updateRole',(req,res)=>{
   let id = req.body.id;
   let role = req.body.role;
  
   db.User.findOne({_id:id}).then(resp=>{
      if(resp.role == 666){
         res.send({msg:'无法修改超级管理员权限',code:'500'})
         return false
      }else{
         resp.update({role:role}).then(r=>{
            res.send({msg:'数据修改成功',code:'200'})
         }).catch((err)=>{
            res.send({msg:'数据修改失败',code:'500'})
            return err
         })
      }
         
   })
})


//用户评论接口
app.use('/comment',(req,res)=>{
   let { commentUser,commentTime,commentContent,articleTitle } = req.body;
      db.Comment.create({
         commentUser,
         commentTime,
         commentContent,
         articleTitle,
      }).then((resp)=>{
           res.send({msg:'评论成功',code:'200'})
      }).catch((err)=>{
         res.send({msg:'评论失败',code:'500'})
      })
   })

//评论查询接口
app.use('/queryComment',(req,res)=>{
   let { id } = req.body;
      if(id){
         db.Comment.find({articleTitle:id}).sort({commentTime:-1}).then(resp =>{
            res.send({data:resp,msg:'查询成功',code:'200'})
         }).catch(err=>{
            res.send({data:[],msg:'查询成功',code:'500'})
            return err
         })
      }else{
         db.Comment.find().sort({commentTime:-1}).then(resp =>{
            res.send({data:resp,msg:'查询成功',code:'200'})
         }).catch(err=>{
            res.send({data:[],msg:'查询成功',code:'500'})
            return err
         })
      }
   })


//查询阅读排行
app.use('/rank',(req,res)=>{
   db.Article.find().sort({readNum:-1}).then(resp =>{
      res.send({data:resp,msg:'查询成功',code:'200'})
   }).catch(err=>{
      res.send({data:[],msg:'查询失败',code:'500'})
      return err
   })
})

//评论查询分页返回后台展示
app.use('/commentlist',(req,res)=>{
   let count = 0
   db.Comment.find().countDocuments().then((r)=>{
     count = r
     let page = req.body.page ;
     db.Comment.find().populate('articleTitle')
     .sort({commentTime:-1})
     .skip(10*(page - 1))  //跳过多少页
     .limit(10)            //每页显示几条
     .then((resp)=>{
        res.send({data:resp,msg:'请求成功',code:'200',count})
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err;
     })
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     }) 
})


//评论删除接口
app.use('/delcomment',(req,res)=>{
   let id = req.body.id
   db.Comment.deleteOne({_id:id}).then((resp)=>{
      res.send({msg:'删除成功',code:'200'})
   }).catch((err)=>{
      res.send({msg:'删除失败',code:'500'})
      return err
   })
})

//查询生活随笔分类的文章接口
app.use('/queryLife',(req,res)=>{
   let count = 0
   db.Article.find({"artType":'生活随笔'}).countDocuments().then((r)=>{  
     count = r
     let page = req.body.page ;   //搜索分页
     db.Article.find({"artType":'生活随笔'}).populate('author')  //模糊查询文章表中artdesc字段的内容
     .sort({time:-1})
     .skip(10*(page - 1))     //跳过多少页
     .limit(10)         //每页显示几条
     .then((resp)=>{
        res.send({data:resp,msg:'请求成功',code:'200',count:count})
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
     })
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     }) 
})

//查询资源分享分类的文章接口
app.use('/queryResource',(req,res)=>{
   let count = 0
   db.Article.find({"artType":'资源分享'}).countDocuments().then((r)=>{  
     count = r
     let page = req.body.page ;   //搜索分页
     db.Article.find({"artType":'资源分享'}).populate('author')  //模糊查询文章表中artdesc字段的内容
     .sort({time:-1})
     .skip(10*(page - 1))     //跳过多少页
     .limit(10)         //每页显示几条
     .then((resp)=>{
        res.send({data:resp,msg:'请求成功',code:'200',count:count})
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
     })
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     }) 
})

//查询前端基础分类的文章接口
app.use('/jc',(req,res)=>{
   let count = 0
   db.Article.find({"artType":'HTML+CSS'}).countDocuments().then((r)=>{  
     count = r
     let page = req.body.page ;   //搜索分页
     db.Article.find({"artType":'HTML+CSS'}).populate('author')  //模糊查询文章表中artdesc字段的内容
     .sort({time:-1})
     .skip(10*(page - 1))     //跳过多少页
     .limit(10)         //每页显示几条
     .then((resp)=>{
        res.send({data:resp,msg:'请求成功',code:'200',count:count})
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
     })
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     }) 
})

//查询js分类
app.use('/js',(req,res)=>{
   let count = 0
   db.Article.find({"$or":[{"artType":"JavaScript"}, {"artType":"Node.js"}]}).countDocuments().then((r)=>{  
     count = r
     let page = req.body.page ;   //搜索分页
     db.Article.find({"$or":[{"artType":"JavaScript"}, {"artType":"Node.js"}]}).populate('author')  //模糊查询文章表中artdesc字段的内容
     .sort({time:-1})
     .skip(10*(page - 1))     //跳过多少页
     .limit(10)         //每页显示几条
     .then((resp)=>{
        res.send({data:resp,msg:'请求成功',code:'200',count:count})
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     })
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     }) 
})

//查询框架分类
app.use('/kj',(req,res)=>{
   let count = 0
   db.Article.find({"$or":[{"artType":"React"}, {"artType":"Vue"}]}).countDocuments().then((r)=>{  
     count = r
     let page = req.body.page ;   //搜索分页
     db.Article.find({"$or":[{"artType":"React"}, {"artType":"Vue"}]}).populate('author')  //模糊查询文章表中artdesc字段的内容
     .sort({time:-1})
     .skip(10*(page - 1))     //跳过多少页
     .limit(10)         //每页显示几条
     .then((resp)=>{
        res.send({data:resp,msg:'请求成功',code:'200',count:count})
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     })
     }).catch((err)=>{
        res.send({msg:'请求失败',code:'500'})
        return err
     }) 
})

//用户留言接口
app.use('/addMessage',(req,res)=>{
   let { messageUser,messageTime,messageContent,} = req.body;
      db.Message.create({
         messageUser,
         messageTime,
         messageContent,
      }).then((resp)=>{
         res.send({msg:'留言成功',code:'200'})
      }).catch((err)=>{
         res.send({msg:'留言失败',code:'500'})
      })
})

//用户留言查询接口
app.use('/queryMessage',(req,res)=>{
   let page = req.body.page ;
   
   let sizee = req.body.sizee ;
   if(page && sizee != 5){
      let count = 0
      db.Message.find().countDocuments().then((r)=>{
         count = r
        db.Message.find()
        .sort({messageTime:-1})
        .skip(10*(page - 1))  //跳过多少页
        .limit(10)        //每页显示几条
        .then((resp)=>{
           res.send({data:resp,msg:'请求成功',code:'200',count})
        }).catch((err)=>{
           res.send({msg:'请求失败',code:'500'})
           return err;
        })
        }).catch((err)=>{
           res.send({msg:'请求失败',code:'500'})
           return err
        }) 
   }else{
      let count = 0
      db.Message.find().countDocuments().then((r)=>{
         count = r
        db.Message.find()
        .sort({messageTime:-1})
        .skip(5*(page - 1))  //跳过多少页
        .limit(5)            //每页显示几条
        .then((resp)=>{
           res.send({data:resp,msg:'请求成功',code:'200',count})
        }).catch((err)=>{
           res.send({msg:'请求失败',code:'500'})
           return err;
        })
        }).catch((err)=>{
           res.send({msg:'请求失败',code:'500'})
           return err
      })
   }
})


//用户留言删除接口
app.use('/delmessage',(req,res)=>{
   let id = req.body.id
   db.Message.deleteOne({_id:id}).then((resp)=>{
      res.send({msg:'删除成功',code:'200'})
   }).catch((err)=>{
      res.send({msg:'删除失败',code:'500'})
      return err
   })
})

//管理员检测接口
app.use('/checkAdmin',(req,res)=>{
   let id = req.body.id
   db.User.findOne({_id:id}).then(r=>{
      if(r.username =='xiaofeng'){
         res.send({msg:'校验通过',code:'200'})
      }else{
         res.send({msg:'请不要尝试注入，后台有校验！！！',code:'500'})
      }
   })
})








//测试接口

app.use('/test',(req,res)=>{
   let time =  req.body.time 

   db.Article.find({"time":{$regex: time }},(err,docs)=>{    //模糊查询
      if(err){ 
         return false
      }
   }).then(()=>{})
   
})

app.use('/testt',(req,res)=>{
   let startTime = req.body.start
   let endTime = req.body.end

   db.Article.find({"time":{"$gte": startTime}},(err,docs)=>{    //模糊查询   , "$lt" :endTime
      if(err){ 
         return false
      }
   })
})

app.listen(6030,()=>{
    console.log('项目启动成功，监听在6030端口！！！');
  });