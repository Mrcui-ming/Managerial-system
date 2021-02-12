/*
处理文件上传的路由
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dirPath = path.join(__dirname, '..', 'public/upload')


//确定存储上传的文件位置
const storage = multer.diskStorage({
  // destination: 'upload', //string时,服务启动将会自动创建文件夹
  destination: function (req, file, cb) { //函数需手动创建文件夹
    //判断路径(文件夹)是否存在
    if (!fs.existsSync(dirPath)) {
      //不存在的话就创建
      fs.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err)
        } else {
          //回调时用来确定文件上传应该存储的路径.
          cb(null, dirPath)
        }
      })
    } else {
      cb(null, dirPath)
    }
  },
  filename: function (req, file, cb) {
    // console.log('filename()', file)
    var ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})
//将文件存储到上面的位置
const upload = multer({storage:storage});
//接收请求参数名称为image的图片文件
const uploadSingle = upload.single('image')
module.exports = function fileUpload(router) {

  // 上传图片
  router.post('/manage/img/upload', (req, res) => {
    
    uploadSingle(req, res, function (err) { 
      //错误处理
      if (err) {
        return res.send({
          status: 1,
          msg: '上传文件失败'
        })
      }
      var file = req.file
      res.send({
        status: 0,
        data: {
          //filename是上传的图片文件的名称
          name: file.filename,
          //url为express公开文件夹 
          url: 'http://localhost:5000/upload/' + file.filename
        }
      })

    })
  })

  // 删除图片
  router.post('/manage/img/delete', (req, res) => {
    const {name} = req.body
    fs.unlink(path.join(dirPath, name), (err) => {
      if (err) {
        console.log(err)
        res.send({
          status: 1,
          msg: '删除文件失败'
        })
      } else {
        res.send({
          status: 0
        })
      }
    })
  })
}
