//导入express模块
const express = require("express")

//导入joi验证模块
const joi = require("joi")

//导入express-jwt解密模块
const expressJWT = require("express-jwt")
const config = require("./config")

//创建express实例
const app = express()

//导入并配置cors中间件
//导入 cors 中间件
const cors = require("cors")
//将 cors 注册为全局中间件
app.use(cors())

//配置解析 raw json 格式的表单数据的中间件
app.use(express.json())
//配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({extended: false}))

//一定要在路由之前，封装一个res.cc()函数
app.use((req, res, next) => {
    //err 可能是一个错误对象，也可能是一个字符串
    //status 默认为 1，表示失败的情况
    res.cc = function(err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//一定要在路由之前，配置解析token的中间件
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^(?!\/my)/]}))

//托管静态资源文件
app.use("/upload", express.static("./upload"))

//导入路由模块并使用
const userRouter = require("./router/user") //用户注册|登录模块
const userinfoRouter = require("./router/userinfo") //用户信息模块
const artCateRouter = require("./router/artcate") //文章分类模块
const articleRouter = require("./router/article") //文章模块
const webRouter = require("./router/webApi") //web端使用的接口
app.use("/api", userRouter)
app.use("/my", userinfoRouter)
app.use("/my/article", artCateRouter)
app.use("/my/article", articleRouter)
app.use("/web", webRouter)

//定义错误级别中间件
app.use((err, req, res, next) => {
    //验证失败导致的错误
    if(err instanceof joi.ValidationError) return res.cc(err)
    //身份认证失败的错误
    if(err.name === "UnauthorizedError") return res.cc("身份认证失败！")

    //未知的错误
    return res.cc(err)
})

//启动服务器
//app.listen(3007, () => {
//    console.log("api server running at http://127.0.0.1:3007");
//})
const {HOST, PORT} = require("./config")
app.server = app.listen(PORT, HOST, () => {
    console.log(`服务启动成功，访问路径 @ http://${HOST ? HOST : 'localhost'}:${PORT}`)
  })