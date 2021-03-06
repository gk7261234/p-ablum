/**
 * Created by GK on 2017/8/30.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


const db = require('./db.js');

//获取绝对路径
var resolve = file => path.resolve(__dirname, file);

const videoTpl = require('../views/video/showVideo.marko');
const videoMenuTpl = require('../views/video/menuVideo.marko');

/**
 * 查询列表
 */
router.get('/', function (req, res, next) {
  let selectStr = 'select * from img';
  db.query(selectStr,function (err, rows) {
    console.log(rows);
    if (err){
      videoTpl.render({},res);
    }else {
      videoTpl.render({rows},res);
    }
  })

});

router.get("/del/:id",function (req, res) {
  let id = req.params.id;
  console.log(id);
  let delStr = `delete from img where id=${id}`;
  db.query(delStr, function (err, rows) {
    if (err){
      res.send("删除失败");
    }else{
      res.send("删除成功");
    }
  })
});

//显示项目
router.get("/menu",function (req, res) {
  let fileName = resolve('video');
  let imageName = resolve('screenshots');
  var len='',pathFile='',imagePath='';
  //读取该文件夹下面的所有文件
  fs.readdir(fileName,function (err,filse) {
    if (err){
      console.log(err);
    }else {
      console.log(filse);
      console.log(filse.length);
      len = filse.length;
      pathFile = fileName+"\\"+filse[0];
      console.log(pathFile);
      ffmpeg(pathFile)
        .screenshots({
          timestamps: ['50%'],
          // filename: 'thumbnail-at-%s-seconds.png',
          filename: 'mov.png',
          size: '320x240',
          folder: imageName
        });
         imagePath = imageName +'\\'+ 'mov.png';
         console.log(imagePath);
      videoMenuTpl.render({len,pathFile,imagePath},res);
    }
  });
});


module.exports = router;