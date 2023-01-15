const express = require("express")

//导入验证表单数据的中间件
const expressJoi = require("@escook/express-joi")
//导入需要的验证规则对象
const {reg_login_schema} = require("../schema/user")

//导入路由处理函数模块
const userHandler = require("../router_handler/user")

//创建路由对象
const router = express.Router()

//注册新用户api
router.post("/reguser", expressJoi(reg_login_schema), userHandler.reguser)

//用户登录api
router.post("/login", expressJoi(reg_login_schema), userHandler.login)

//查询用户列表api
router.get("/usersList", userHandler.getUsersList)

module.exports = router