//导入定义验证规则的包
const joi = require("joi")

//定义用户名和密码的验证规则
const username = joi.string().alphanum().min(5).max(10).required().messages({
    "any.required": "用户名必填",
    "string.empty": "用户名必填",
    "string.alphanum": '用户名只能包含a-zA-Z0-9',
    "string.min": '用户名长度不能低于5位',
    "string.max": '用户名长度不能超过10位',
})
const password = joi.string().pattern(/^[\S]{6,15}$/).required().messages({
    "any.required": "密码必填",
    "string.empty": "密码必填",
    "string.pattern.base": '密码不能包含空格,且长度为6-15位',
})

//定义更新用户信息的验证规则
const id = joi.number().integer().min(1).required().messages({
    "number.base": "id必须是一个数字类型",
    "number.integer": "id必须是一个整数",
    "any.required": "用户名必填",
    "number.min": 'id最小为1',
})
const nickname = joi.string().required().messages({
    "any.required": "昵称为必填",
})
const email = joi.string().email().required().messages({
    "any.required": "邮箱为必填",
    "string.empty": "邮箱必填",
    "string.email": '邮箱格式不正确',
})

//定义更新用户头像的验证规则
const avatar = joi.string().dataUri().required().messages({
    "any.required": "头像为必填",
    "string.empty": "头像必填",
    "string.dataUri": "头像应为base64格式的字符串"
})


//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}
//定义验证更新用户信息表单数据的规则对象
exports.update_userinfo_schema = {
    body: {
        nickname,
        email
    }
}

//定义验证更新用户密码表单数据的规则对象
exports.update_password_schema = {
    body: {
        id,
        oldPwd: password,
        newPwd: joi.not(joi.ref("oldPwd")).concat(password) // .not(x)不能包含x .concat()合并多条验证规则
    }
}

//定义验证更新用户头像表单数据的规则对象
exports.update_avatar_schema = {
    body: {
        avatar
    }
}