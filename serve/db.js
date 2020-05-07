const mongoose = require('mongoose')

const crypto = require('crypto'); //密码加密模块

mongoose.connect('mongodb://127.0.0.1:27017/xfBlogg',{ useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('open',()=>{
    console.log('数据库连接成功')
})
mongoose.connection.on('error',()=>{
    console.log('数据库连接失败')
})

//设置用户的Schema
let userSchema = new mongoose.Schema({
    username:{type:String,required:true},
    role:{type:Number,default:1},
    password:{type:String,required:true},
    time:{type:String } //用户注册时间
},{
  versionKey:false
 })


 //设置文章的Schema
let articleSchema = new mongoose.Schema({
    title:{type:String,required:true},  //文章作者
    author:{                            //文章作者
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    time:{type:String,required:true},  //文章发布时间
    content:{type:String,required:true}, //文章内容
    artdesc:{type:String,required:true}, //文章描述
    artType:{type:String,required:true},  //文章类型
    picUrl:{type:String,required:false}, //文章介绍的图片地址
    readNum:{type:Number},  //用户阅读量
},{
  versionKey:false
 })

 //设置评论的Schema
let commentSchema = new mongoose.Schema({
    commentUser:{type:String,required:true}, //评论人
    articleTitle:{                            
        type:mongoose.Schema.Types.ObjectId,
        ref:'article'
    },
    commentTime:{type:String,required:true},  //评论时间
    commentContent:{type:String,required:true}, //评论内容
},{
  versionKey:false
 })

  //设置留言的Schema
let MessageSchema = new mongoose.Schema({
    messageUser:{type:String,required:true}, //评论人
    messageTime:{type:String,required:true},  //评论时间
    messageContent:{type:String,required:true}, //评论内容
},{
  versionKey:false
 })




 const User = mongoose.model('user',userSchema)
 const Article = mongoose.model('article',articleSchema)
 const Comment = mongoose.model('comment',commentSchema)
 const Message = mongoose.model('message',MessageSchema)


 //这一段修改成你自己的查破及管理员的用户名和密码，表示在启动和服务时候自动创建超级管理员  下面三个username修改成你的用户名,psd为你的密码


 User.findOne({ username:'username'}).then((res)=>{
    //  console.log(res)
     if(res){
         return false
     }else{
         
        const c = crypto.createHash('sha256');
        const password = c.update('psd').digest('hex');

        User.create({
            username:'username',
            password:password,
            role:666,
            time:new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate() +
                " " +
                (function() {
                return new Date().getHours() < 10
                    ? "0" + new Date().getHours()
                    : new Date().getHours();
                    
                })() +
                ":" +
                (function() {
                return new Date().getMinutes() < 10
                    ? "0" + new Date().getMinutes()
                    : new Date().getMinutes();
                })() +
                ":" +
                (function() {
                return new Date().getSeconds() < 10
                    ? "0" + new Date().getSeconds()
                    : new Date().getSeconds();
                })(),
        })
     }
 }).catch((err)=>{
   console.log(err)
 })



 const Models = { User,Article,Comment,Message}

module.exports = Models;


