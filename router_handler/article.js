//导入处理文件的核心模块
const fs = require("fs")

//导入数据库操作模块
const db = require("../db/index")

//导入上传文件处理函数
const { uploadFile } = require("../upload")

//上传文件
exports.uploadFile = (req, res) => {
    uploadFile(req.file.path, "article_cover_img/" + req.file.filename).then(ress => {
        return res.send({
            status: 0,
            message: "上传文件成功",
            data: ress.url
        })
    }).catch(err => {
        return res.cc(err)
    })
}

//上传文章内容文件
exports.uploadArticleFile = (req, res) => {
    const savePath = `article/${req.body.floder}/`
    uploadFile(req.file.path, savePath + req.file.filename).then(ress => {
        return res.send({
            status: 0,
            message: "上传图片成功",
            data: ress.url
        })
    }).catch(err => {
        return res.cc(err)
    })
}

//新增文章处理函数
exports.addArticle = (req, res) => {
    //console.log(req.body) // 文本类型的数据
    //console.log('--------分割线----------')
    //console.log(req.file) // 文件类型的数据

    //手动判断是否上传了封面
    //if (!req.file || req.file.fieldname !== "cover_img") return res.cc("文章封面为必选参数")

    //const file = uploadFile(req.file.path, "article_cover_img/" + req.file.filename)
    //uploadFile(req.file.path, "article_cover_img/" + req.file.filename).then(ress => {
        const articleInfo = {
            //标题，内容，状态，分类id，封面图
            ...req.body,
            //封面在服务器端的存放路径
            //cover_img: path.join("/upload", req.file.filename), //保存在服务器端
            //cover_img: ress.url, //七牛云链接
            //新增时间
            pub_date: new Date(),
            //作者id
            author_id: req.user.id,
        }
        //定义新增文章的sql语句
        const sqlStr = `insert into ev_articles set ?`
        //执行sql语句
        db.query(sqlStr, articleInfo, (err, results) => {
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc("新增文章失败！")

            //fs.unlink(req.file.path, (err) => {
            //    if (err) return res.cc("新增文章失败！")
            //    return res.cc("新增文章成功！", 0)
            //})
            return res.cc("新增文章成功！", 0)
        })
    //}).catch(err => {
    //    console.error(err);
    //    return res.cc(err)
    //})

}

//删除文章处理函数
exports.deleteArticle = (req, res) => {
    //定义标记删除的sql语句
    const sqlStr = `update ev_articles set is_delete=1 where id = ?`
    //执行sql语句
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("删除文章失败!")

        return res.cc("删除文章成功!", 0)
    })
}

//查询文章处理函数
exports.listArticle = (req, res) => {
    //定义查询文章的 sql 语句
    let sqlStr = ``
    if(req.params.id) {
        sqlStr = `select * from ev_articles where cate_id=${parseInt(req.params.id)} and is_delete=0 and state='发布' limit ?, ?`
    } else {
        sqlStr = `select * from ev_articles limit ?, ?`
    }
    //执行sql语句
    db.query(sqlStr, [parseInt((req.query.page - 1) * req.query.pageSize), parseInt(req.query.pageSize)], (err, results) => {
        if (err) return res.cc(err)

        if (results.length === 0) return res.cc("暂无文章数据！")

        //定义统计文章数量的sql语句
        let sqlStr = ``
        if(req.params.id) {
            sqlStr = `select count(id) as total from ev_articles where cate_id=${parseInt(req.params.id)} and is_delete=0 and state='发布'`
        } else {
            sqlStr = `select count(id) as total from ev_articles`
        }
        //执行sql语句
        db.query(sqlStr, (err, results2) => {
            if (err) return res.cc(err)

            if (results2.length === 0) return res.cc("暂无文章数据！")

            return res.send({
                status: 0,
                message: "获取文章数据成功！",
                data: {
                    articlesList: results,
                    total: results2[0].total,
                    page: parseInt(req.query.page),
                    pageSize: parseInt(req.query.pageSize)
                }
            })
        })

    })
}

//根据id获取文章详情
exports.articleContent = (req, res) => {
    //定义sql语句
    const sqlStr = `select * from ev_articles where id = ?`
    //执行sql语句
    db.query(sqlStr, req.params.id, (err, results) => {
        if(err) return res.cc(err)

        if(results.length === 0) return res.cc("暂无文章内容！")

        return res.send({
            status: 0,
            message: "获取文章内容成功！",
            data: results[0]
        })
    })
}

//根据id更新文章详情
exports.updateArticle = (req, res) => {
    const articleInfo = {
        //标题，内容，状态，分类id，封面图，id
        ...req.body,
        //封面在服务器端的存放路径
        //cover_img: path.join("/upload", req.file.filename), //保存在服务器端
        //cover_img: ress.url, //七牛云链接
        //新增时间
        pub_date: new Date(),
        //作者id
        author_id: req.user.id,
    }
    //定义标记删除的sql语句
    const sqlStr = `update ev_articles set ? where id=?`
    //执行sql语句
    db.query(sqlStr, [articleInfo, req.body.id], (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("更新文章失败!")

        return res.cc("更新文章成功!", 0)
    })
}