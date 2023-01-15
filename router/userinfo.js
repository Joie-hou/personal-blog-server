const express = require("express")

//导入验证数据合法性的中间件
const expressJoi = require("@escook/express-joi")

//导入解析formdata格式表单数据的模块
const { uploadMiddleWare } = require("../upload")

//导入路由处理函数模块
const userinfo_handler = require("../router_handler/userinfo")
//导入验证规则对象
const { update_userinfo_schema } = require("../schema/user")
const { update_password_schema } = require("../schema/user")
const { update_avatar_schema } = require("../schema/user")

//创建路由对象
const router = express.Router()

//获取用户信息api
router.get("/userinfo", userinfo_handler.getUserinfo)
//更新用户信息api
router.post("/userinfo", expressJoi(update_userinfo_schema), userinfo_handler.updateUserinfo)
//更新用户密码api
router.post("/updatepwd", expressJoi(update_password_schema), userinfo_handler.updatePassword)
//更新用户头像路由api
router.post("/upadte/avatar", uploadMiddleWare.single("avatar"), userinfo_handler.updateAvatar)


//挂在路由
module.exports = router