//根据不同的env环境设置不同的host
console.log('env',process.env.NODE_ENV);

//获取本机IP
var ip = require('ip');
//console.log(ip.address());

let mysql_host = ip.address() || 'localhost'
let mysql_port = 33069
if(process.env.NODE_ENV === 'production') {
    mysql_host = 'mysql_8'
    mysql_port = 3306
}

//导入mysql模块
const mysql = require("mysql")
///127.0.0.1
//创建数据库链接对象
const db = mysql.createPool({
    host: mysql_host,
    port: mysql_port,
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