/**
 * Created by GK on 2017/8/29.
 */
const express = require('express');
const router = express.Router();

const formidable = require('formidable');
const fs = require('fs');
const db = require('./db.js');

const cacheFolder = 'public/images/uploadcache/';

// 导入MySQL模块
const mysql = require('mysql');
const dbConfig = require('../config/mysql');
const userSQL = require('../config/usersql');


const showImgTemplate = require('../views/img/showImg.marko');

// 使用DBConfig.js的配置信息创建一个MySQL连接池
const pool = mysql.createPool( dbConfig.mysql );
// 响应一个JSON数据
var responseJSON = function (res, ret) {
  if(typeof ret === 'undefined') {
    res.json({code: '-200', msg: '操作失败'});
  } else {
    res.json(ret);
  }};

// 图片展示
router.get('/show', (req, res) => {
  showImgTemplate.render({},res);
});

// 获取上传图片
router.get('/_showImg',(req,res)=>{
  pool.getConnection(function (err,connection) {
    connection.query(userSQL.queryAll, function(err, result) {
      //result是数组对象
      console.log(result);
      // 释放连接
      connection.release();
      // showImagTpl.render({data:img_path},res);
      res.send({data:result});
    });

  });
});

// 添加图片操作
router.get('/_add', function(req, res, next){
  // 从连接池获取连接
  pool.getConnection(function(err, connection) {
// 获取前台页面传过来的参数
    var param = req.query || req.params;
// 建立连接 增加一个用户信息
    connection.query(userSQL.insert, [param.name], function(err, result) {
      if(result) {
        result = {
          code: 200,
          msg:'增加成功'
        };
      }
      // 以json形式，把操作结果返回给前台页面
      responseJSON(res, result);
      // 释放连接
      connection.release();
    });
  });
});

router.post('/_upload', (req, res) => {
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = cacheFolder; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小
  form.type = true;
  var displayUrl;
  form.parse(req, function(err, fields, files) {
    if (err) {
      res.send(err);
      return;
    }
    var extName = ''; //后缀名
    switch (files.upload.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }
    if (extName.length === 0) {
      res.send({
        code: 202,
        msg: '只支持png和jpg格式图片'
      });
      return;
    } else {
      var avatarName = Date.now() + '.' + extName;
      var newPath = form.uploadDir + avatarName;
      displayUrl = avatarName;
      fs.renameSync(files.upload.path, newPath); //重命名
      res.send({
        code: 200,
        msg: displayUrl
      });
    }
  });
});

//删除图片
router.get('/delete/:id',function (req, res, next) {
  let id = req.params.id;
  console.log(id);
  let delStr = `delete from user where id=${id}`;
  db.query(delStr, function (err, rows) {
    if (err){
      res.send("删除失败");
    }else{
      res.send("删除成功");
    }
  })

})


module.exports = router;