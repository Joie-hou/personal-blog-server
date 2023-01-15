//导入mysql模块
const mysql = require("mysql")

//创建数据库链接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'my_db_01'
})

//测试mysql模块能否正常工作
//db.query("select 1", (err, results) => {
//    if (err) return console.log(err.message);
//    console.log(results);
//})

//向外共享 db 数据库连接对象
module.exports = db