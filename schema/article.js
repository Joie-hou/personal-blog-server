//导入定义验证规则的模块
const joi = require("joi")

//定义验证规则
const title = joi.string().required().messages({
    "any.required": "文章标题为必填",
    "string.empty": "文章标题必填",
})
const cate_id = joi.number().integer().min(1).required().messages({
    "any.required": "文章分类为必填",
    "string.empty": "文章分类必填",
    "number.base": "文章分类必须为数字类型",
    "number.integer": "文章分类必须是一个整数",
    "number.min": '文章分类最小为1',
})
const content = joi.string().required().messages({
    "any.required": "文章内容为必填",
    "string.empty": "文章内容必填",
})
const cover_img = joi.string().required().messages({
    "any.required": "文章封面为必填",
    "string.empty": "文章封面必填",
})
const state = joi.string().valid("发布", "草稿").required().messages({
    "any.required": "文章发布状态为必填",
    "string.empty": "文章发布状态必填",
    "any.only": "文章新增状态只能是[发布, 草稿]其中一个"
})

const id = joi.number().integer().min(1).required().messages({
    "number.base": "id必须是一个数字类型",
    "number.integer": "id必须是一个整数",
    "any.required": "id为必填",
    "number.min": 'id最小为1',
})
const page = joi.number().integer().min(1).required().messages({
    "number.base": "页码必须是一个数字类型",
    "number.integer": "页码必须是一个整数",
    "any.required": "页码为必填",
    "number.min": '页码最小为1',
})
const pageSize = joi.number().integer().min(1).required().messages({
    "number.base": "页数必须是一个数字类型",
    "number.integer": "页数必须是一个整数",
    "any.required": "页数为必填",
    "number.min": '页数最小为1',
})

//验证规则对象，新增文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        cover_img,
        state
    }
}

//验证规则对象，更新文章
exports.update_article_schema = {
    body: {
        id,
        title,
        cate_id,
        content,
        cover_img,
        state
    }
}

//验证规则对象，删除文章，根据id获取文章内容
exports.delete_article_schema = {
    params: {
        id
    }
}

//验证规则对象，查询文章
exports.query_article_schema = {
    query: {
        page,
        pageSize
    }
}