//文章分类的路由模块
const express = require("express")
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
//导入需要的验证规则对象

//导入文章分类的路由处理函数模块
const { getArticleCates } = require("../router_handler/artcate")
const { articleContent, listArticle } = require("../router_handler/article")

const { delete_article_schema } = require("../schema/article")
const { query_article_schema } = require("../schema/article")

//获取文章分类列表数据api
router.get("/cates", getArticleCates)

//查询文章api
router.get("/articleList/:id", expressJoi(delete_article_schema), expressJoi(query_article_schema), listArticle)

//根据id获取文章内容api
router.get("/articleContent/:id", expressJoi(delete_article_schema), articleContent)

module.exports = router