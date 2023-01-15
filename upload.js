//导入处理路径的核心模块
const path = require("path")

//导入解析formdata格式表单数据的包
const multer = require("multer")
//创建multer的实例对象，通过dest属性指定文件的存放路径
exports.uploadMiddleWare = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "./upload/"))
        },
        filename: function (req, file, cb) {
            // fieldname是表单的name值，也就是我们设定的“logo”，
            // originalname是文件上传时的名字，可以根据它获取后缀，
            // encoding，mimetype 我就不详细介绍了，可以自行输出查看。
            const { fieldname, originalname, encoding, mimetype } = file
            const before = originalname.split('.')[0]
            const after = originalname.split('.')[1] ? '.' + originalname.split('.')[1] : '.jpg'
            cb(null, before + '-' + Date.now() + after);
        }
    })
})


//文件上传 七牛云
//导入七牛云模块
const qiniu = require("qiniu")

//鉴权
const accessKey = "kaHYhMSfzjEQea_h3t8pKDNwHdY5wPrbznSgPXNX"
const secretKey = "qbyj7LlOuAMELvNolhPeCv7btOJ1PEkxrHVEDu98"
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

exports.uploadFile = (filePath, key = "", bucket = "hou-personal-blog", rewrite = false) => {
    return new Promise((resolve, reject) => {
        //配置传入参数
        const options = {
            //值得一提的是，要覆盖文件的时候，可以在scope参数中在原来存储桶名的结尾加上冒号:和文件的key，即可实现上传覆盖原文件。
            scope: `${bucket}${rewrite ? (":" + key) : ""}` //存储桶名称
        }
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);
    
        //构建文件上传对象
        const config = new qiniu.conf.Config()
    
        //机房	Zone对象
        //华东	qiniu.zone.Zone_z0
        //华北	qiniu.zone.Zone_z1
        //华南	qiniu.zone.Zone_z2
        //北美	qiniu.zone.Zone_na0
    
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_z1;
        // 是否使用https域名
        config.useHttpsDomain = true;
        // 上传是否使用cdn加速
        config.useCdnDomain = true;
    
        const formUploader = new qiniu.form_up.FormUploader(config)
        const putExtra = new qiniu.form_up.PutExtra()  //这个用来设置额外参数，比如mimeType之类的，类似于用form-data方式上传文件
    
        // 文件上传
        formUploader.putFile(uploadToken, key, filePath, putExtra, function (respErr,
            respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                //console.log(respBody);
                resolve({
                    "url": downFile(key)
                })
            } else {
                //console.log(respInfo.statusCode);
                //console.log(respBody); //{ error: 'no such bucket' }
                reject()
            }
        });
    })
}

//文件下载
const downFile = (key) => {
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const privateBucketDomain = 'http://ro4azbn9o.hb-bkt.clouddn.com';
    //const deadline = parseInt(Date.now() / 1000) + 3600; // 1小时过期
    const deadline = parseInt(new Date(2300, 11, 11).getTime())
    const privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);

    //console.log(privateDownloadUrl);
    return privateDownloadUrl

}



