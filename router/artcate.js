//文章分类的路由模块
const express = require("express")
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
//导入需要的验证规则对象
const { add_cate_schema } = require("../schema/artcate")
const { delete_cate_schema } = require("../schema/artcate")
const { get_cate_schema } = require("../schema/artcate")
const { update_cate_schema } = require("../schema/artcate")

//导入文章分类的路由处理函数模块
const artCate_handler = require("../router_handler/artcate")

//获取文章分类列表数据api
router.get("/cates", artCate_handler.getArticleCates)

//新增文章分类api
router.post("/addcates", expressJoi(add_cate_schema), artCate_handler.addArticleCates)

//根据id删除文章分类api
router.get("/deleteCate/:id", expressJoi(delete_cate_schema), artCate_handler.deleteCateById)

//根据id获取文章分类api
router.get("/cates/:id", expressJoi(get_cate_schema), artCate_handler.getArtCateById)

//根据id更新文章分类api
router.post("/updateCate", expressJoi(update_cate_schema), artCate_handler.updateCateById)

module.exports = router