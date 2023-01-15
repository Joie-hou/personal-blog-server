//导入数据库操作模块
const db = require("../db/index")

//导入bcryptjs模块
const bcrypt = require("bcryptjs")

//导入jsonwebtoken
const jwt = require("jsonwebtoken")

//导入全局的配置文件
const config = require("../config")

//注册新用户的处理函数
exports.reguser = (req, res) => {
    //获取客户端提交的数据
    const userinfo = req.body

    //定义sql语句，查询用户名是否被占用
    const sqlStr = "select * from ev_users where username=?"
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        //判断用户名是否被占用
        if (results.length > 0) {
            return res.cc("用户名被占用，请更换其他用户名！")
        }
        //用户名可以使用
        //调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        //插入新用户
        //定义插入用户的sql语句
        const insertSql = "insert into ev_users set ?"
        //调用 db.query() 执行sql语句
        db.query(insertSql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            //判断sql语句是否执行成功
            if (err) {
                return res.cc(err)
            }
            //判断影响行数是否为1
            if (results.affectedRows !== 1) {
                return res.cc("注册用户失败，请稍后重试！")
            }
            return res.cc("注册成功！", 0)
        })
    })
}

//用户登录的处理函数
exports.login = (req, res) => {
    //获取客户端提交的数据
    const userinfo = req.body

    //定义sql语句，查询用户名是否被占用
    const sqlStr = "select * from ev_users where username=?"
    //执行sql语句，根据用户名查询用户信息
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行sql语句失败
        if(err) return res.cc(err)
        //执行sql语句成功，但获取到的数据条数不等于1
        if(results.length !== 1) return res.cc("登录失败！")

        //判断密码是否正确
        //bcrypt.compareSync(用户提交的密码，数据库中保存的密码)
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if(!compareResult) return res.cc("密码错误！")

        //在服务器端生成token
        const user = {...results[0], password: "", user_pic: ""}
        //对用户的信息进行加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        //将token响应给客户端
        res.send({
            status: 0,
            message: "登录成功！",
            data: {
                token: "Bearer " + tokenStr
            }
        })
    })
}

exports.getUsersList = (req, res) => {
    //定义查询用户列表sql语句
    const sqlStr = `select id, username, nickname, email, user_pic from ev_users limit ?, ?`
    //执行sql语句
    db.query(sqlStr, [parseInt((req.query.page - 1) * req.query.pageSize), parseInt(req.query.pageSize)], (err, results) => {
        if(err) return res.cc(err)

        if(results.length === 0) return res.cc("暂无用户数据")

        //统计用户数据
        const sqlStr = `select count(id) as total from ev_users`
        db.query(sqlStr, (err, results2) => {
            if(err) return res.cc(err)

            if(results2.length === 0) return res.cc("暂无用户数据")

            return res.send({
                status: 0,
                message: "请求用户列表数据成功!",
                data: {
                    usersList: results,
                    total: results2[0].total,
                    page: parseInt(req.query.page),
                    pageSize: parseInt(req.query.pageSize)
                }
            })
        })

    })
}
