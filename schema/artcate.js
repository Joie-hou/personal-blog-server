//文章分类校验模块
//导入定义验证规则的包
const joi = require("joi")

const artName = joi.string().required().messages({
    "any.required": "文章分类名称为必填",
    "string.empty": "文章分类名称为必填",
})
const artAlias = joi.string().alphanum().required().messages({
    "any.required": "文章分类别名为必填",
    "string.empty": "文章分类别名为必填",
    "string.alphanum": '只能包含a-zA-Z0-9',
})

const id = joi.number().integer().min(1).required().messages({
    "number.base": "id必须是一个数字类型",
    "number.integer": "id必须是一个整数",
    "any.required": "id为必填",
    "number.min": 'id最小为1',
})

const status = joi.number().integer().required().messages({
    "number.base": "文章状态必须是一个数字类型",
    "number.integer": "文章状态必须是一个整数",
    "any.required": "文章状态为必填",
})

exports.add_cate_schema = {
    body: {
        name: artName,
        alias: artAlias
    }
}

exports.delete_cate_schema = {
    params: {
        id
    },
    query: {
        status
    }
}

exports.get_cate_schema = {
    params: {
        id
    }
}

exports.update_cate_schema = {
    body: {
        id: id,
        name: artName,
        alias: artAlias
    }
}