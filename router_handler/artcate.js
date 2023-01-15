//文章分类处理函数

//导入数据库操作模块
const db = require("../db/index")

//获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    //定义查询分类列表数据的SQL语句
    let sql = `select * from ev_article_cate order by id asc limit ?, ?`
    if (req.query.status == 0 || req.query.status == 1) {
        sql = `select * from ev_article_cate where is_delete=${parseInt(req.query.status)} order by id asc limit ?, ?`
    }
    //调用db.query()执行sql语句
    db.query(sql, [parseInt((req.query.page - 1) * req.query.pageSize), parseInt(req.query.pageSize)], (err, results) => {
        if (err) return res.cc(err)

        if (results.length === 0) return res.cc("暂无用户数据")

        //统计文章分类数据
        const sqlStr = `select count(id) as total from ev_article_cate`
        db.query(sqlStr, (err, results2) => {
            if (err) return res.cc(err)

            if (results2.length === 0) return res.cc("暂无用户数据")

            return res.send({
                status: 0,
                message: "获取文章分类成功!",
                data: {
                    artcateList: results,
                    total: results2[0].total,
                    page: parseInt(req.query.page),
                    pageSize: parseInt(req.query.pageSize)
                }
            })
        })
    })
}

//新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    //定义查询文章分类sql语句
    const sqlStr = `select * from ev_article_cate where name=? or alias=?`
    //执行sql语句
    db.query(sqlStr, [req.body.name, req.body.alias], (err, results) => {
        //判断是否执行失败
        if (err) return res.cc(err)

        //判断数据的length
        if (results.length === 2) return res.cc("分类名称或别名被占用，请更换后重试！")
        //length 等于1的三种情况
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc("分类名称或别名被占用，请更换后重试！")
        if (results.length === 1 && results[0].name === req.body.name) return res.cc("分类名称被占用，请更换后重试！")
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc("分类别名被占用，请更换后重试！")

        //分类名称和分类别名都可以，执行添加的sql语句
        //定义文章分类插入的sql语句
        const insertSql = `insert into ev_article_cate set ?`
        //执行sql语句
        db.query(insertSql, req.body, (err, results) => {
            //判断是否执行失败
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc("新增文章分类失败！")

            res.cc("新增文章分类成功！", 0)
        })
    })
}

//根据id删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    //定义标记删除的sql语句
    const sqlStr = `update ev_article_cate set is_delete=? where id=?`
    //执行sql语句
    db.query(sqlStr, [req.query.status, req.params.id], (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("删除文章分类失败!")

        return res.cc("删除文章分类成功!", 0)
    })
}

//根据id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    //定义根据id获取文章分类的sql语句
    const sqlStr = `select * from ev_article_cate where id=?`

    //执行sql语句
    db.query(sqlStr, req.params.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc("获取文章分类数据失败!")

        return res.send({
            status: 0,
            message: "获取文章分类数据成功!",
            data: results[0]
        })
    })
}

//根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    //定义查询 分类名称 和 分类别名 是否被占用的sql语句  查重
    const sqlStr = `select * from ev_article_cate where id != ? and (name=? or alias=?)`
    db.query(sqlStr, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        //判断是否执行失败
        if (err) return res.cc(err)

        //判断名称和别名被占用的4中情况
        //1. 判断数据的length
        if (results.length === 2) return res.cc("分类名称和别名被占用，请更换后重试！")
        //length 等于1的三种情况
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc("分类名称和别名被占用，请更换后重试！")
        if (results.length === 1 && results[0].name === req.body.name) return res.cc("分类名称被占用，请更换后重试！")
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc("分类别名被占用，请更换后重试！")

        //分类名称和分类别名都可以，执行更新的sql语句
        //执行根据id更新文章分类的sql语句
        const sqlStr = `update ev_article_cate set ? where id=?`
        //执行sql语句
        db.query(sqlStr, [req.body, req.body.id], (err, results) => {
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc("更新文章分类失败!")

            return res.cc("更新文章分类成功!", 0)
        })
    })

}