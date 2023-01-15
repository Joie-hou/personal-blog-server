//导入处理文件的核心模块
const fs = require("fs")

//导入数据库操作模块
const db = require("../db/index")

//导入处理密码的模块
const bcrypt = require("bcryptjs")

//导入上传文件处理函数
const { uploadFile } = require("../upload")

//获取用户信息的处理函数
exports.getUserinfo = (req, res) => {
    //定义sql语句，查询用户的基本信息
    const sql = "select id, username, nickname, user_pic, email from ev_users where id=?"
    db.query(sql, req.user.id, (err, results) => {
        //执行sql语句失败
        if (err) return res.cc(err)
        //执行sql语句成功，但是查询结果为空
        if(results.length !== 1) return res.cc("获取用户信息失败！")
        res.send({
            status: 0,
            message: "获取用户信息成功！",
            data: results[0]
        })
    })
}

//更新用户信息的处理函数
exports.updateUserinfo = (req, res) => {
    //定义sql语句，更新用户的基本信息
    const sql = "update ev_users set ? where id=?"
    db.query(sql, [req.body, req.user.id], (err, results) => {
        //执行sql语句失败
        if (err) return res.cc(err)
        //执行sql语句成功，但是影响行数不等于1
        if(results.affectedRows !== 1) return res.cc("更新用户信息失败！")
        return res.cc("更新用户信息成功！", 0)
    })
}

//更新用户密码的处理函数
exports.updatePassword = (req, res) => {
    //根据id查询用户信息
    const sqlStr = "select * from ev_users where id=?"
    //执行根据id查询用户的信息的sql语句
    db.query(sqlStr, parseInt(req.body.id), (err, results) => {
        //执行sql语句失败
        if (err) return res.cc(err)
        //判断结果是否存在
        if(results.length !== 1) return res.cc("用户不存在！")

        //判断用户输入的密码是否与数据库存储的密码是否一致
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if(!compareResult) return res.cc("旧密码错误！")

        //更新数据库中的密码
        //定义更新密码的sql语句
        const sqlStr = "update ev_users set password=? where id=?"
        //对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        //调用db.query()执行sql语句
        db.query(sqlStr, [newPwd, parseInt(req.body.id)], (err, results) => {
            //执行sql语句失败
            if (err) return res.cc(err)
            //执行sql语句成功，但是影响行数不等于1
            if(results.affectedRows !== 1) return res.cc("更新用户密码失败！")

            return res.cc("更新密码成功！", 0)
        })
    })
}

//更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    console.log(req.file);
    //手动判断是否上传了头像
    if (!req.file || req.file.fieldname !== "avatar") return res.cc("用户头像为必选参数")
    uploadFile(req.file.path, "avatar/" + req.file.filename).then(ress => {
        //ress.url 七牛云保存的图片地址
        //定义更新用户头像的sql语句
        const sqlStr = "update ev_users set user_pic=? where id=?"
        db.query(sqlStr, [ress.url, req.user.id], (err, results) => {
            //执行sql语句失败
            if (err) return res.cc(err)
            //执行sql语句成功，但是影响行数不等于1
            if(results.affectedRows !== 1) return res.cc("更新用户信息失败！")
            
            fs.unlink(req.file.path, (err) => {
                if(err) return res.cc("用户头像更新失败！")
                return res.cc("用户头像更新成功！", 0)
            })
        })

    }).catch(err => {
        console.error(err);
        return res.cc(err)
    })
}