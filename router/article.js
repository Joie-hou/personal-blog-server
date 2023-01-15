const express = require("express")
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi")

//导入解析formdata格式表单数据的模块
const { uploadMiddleWare } = require("../upload")

const articleRouterHandler = require("../router_handler/article") //文章的处理函数

const { add_article_schema } = require("../schema/article") //新增文章的校验对象
const { update_article_schema } = require("../schema/article") //新增文章的校验对象
const { delete_article_schema } = require("../schema/article") //删除文章的校验对象

//upload.single() 局部生效的中间件，用来解析 FormData 格式的数据
//将文件类型的数据挂在到 req.file 属性中
//将文本类型的数据挂在到 req.body 属性中
//新增文章api
router.post("/addArticle", expressJoi(add_article_schema), articleRouterHandler.addArticle)

//删除文章api
router.get("/deleteArticle/:id", expressJoi(delete_article_schema), articleRouterHandler.deleteArticle)

//查询文章api
router.get("/articleList", articleRouterHandler.listArticle)

//上传文章封面api
router.post("/upload", uploadMiddleWare.single("cover_img"), articleRouterHandler.uploadFile)

//根据id获取文章内容api
router.get("/articleContent/:id", expressJoi(delete_article_schema), articleRouterHandler.articleContent)

//根据id更新文章内容api
router.post("/updateArticle", expressJoi(update_article_schema), articleRouterHandler.updateArticle)

//文章内容上传图片
router.post("/article/upload", uploadMiddleWare.single("article_img"), articleRouterHandler.uploadArticleFile)

module.exports = router