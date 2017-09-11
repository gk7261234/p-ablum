/**
 * Created by GK on 2017/9/6.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodeExcel = require('excel-export');
// const COMMENTS_FILE = "E:/MyProject/p-ablum/public/note/content.txt";

const noteTpl = require("../views/note/showNote.marko");

//获取绝对路径
var resolve = file => path.resolve(__dirname, file);

//获取 年-月-日 当做文件名
function getNowFormatDate() {
  let date = new Date();
  // let seperator = "-";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = date.getFullYear() + month + strDate;
  return currentdate;
}

//获取 时-分-秒 记录提交数据时间
function getNowTime() {
  let date = new Date();
  let seperator = ":";
  let currentdate = date.getHours() + seperator + date.getMinutes() + seperator + date.getSeconds();
  return currentdate;

}

router.get('/', function (req, res, next) {
  let timeStamp = getNowFormatDate();
  let folder = 'note/'+ timeStamp +'.txt';
  let pathStr = resolve(folder);
  console.log(pathStr);
  let noteList = '';
  if (!fs.existsSync(pathStr)){
    // 创建文件夹
    // fs.mkdirSync(pathStr);
    fs.writeFile(pathStr,'[]',function (err,data) {
      if (err){
        console.log("写入失败");
      }
    })
  }else {
    fs.readFile(pathStr, (err, data) => {
      if(err){
        console.log(err);
        process.exit(1);
      }
      console.log(JSON.parse(data));
      noteList = JSON.parse(data);
    })
  }
  noteTpl.render({noteList},res);
});

router.post('/_save',function (req, res, next) {
  console.log(req.body);
  let timeStamp = getNowFormatDate();
  let folder = 'note/'+ timeStamp +'.txt';
  let pathStr = resolve(folder);

  fs.readFile(pathStr, (err, data) => {
    if(err){
      console.log(err);
      process.exit(1);
    }
    let comments = JSON.parse(data);
    let newComment = {
      id:req.body.id,
      name:req.body.name,
      phone:req.body.phone,
      question:req.body.question,
      answer:req.body.answer,
      time:getNowTime(),
      channel:req.body.channel,
      description:req.body.description,
      progress:req.body.progress,
      kfName:req.body.kfName
    };
    comments.push(newComment);
    fs.writeFile(pathStr, JSON.stringify(comments, null, 4), (err, data) => {
      if(err){
        console.log(err);
        process.exit(1);
      }
      res.json(newComment);
    });
  });
});

/**
 * 下载文件
 */
router.get("/downLoad",function (req, res, next) {

  let comments = "";
  console.log(req.body);
  let timeStamp = getNowFormatDate();
  let folder = 'note/'+ timeStamp +'.txt';
  let pathStr = resolve(folder);
  fs.readFile(pathStr, (err, data) => {
    if(err){
      console.log(err);
      process.exit(1);
    }
    comments = JSON.parse(data);

    let conf ={};
    conf.cols = [
      {caption: '访客ID', type: 'string'},
      {caption: '访客姓名', type: 'string'},
      {caption: '联系方式', type: 'string'},
      {caption: '客服渠道', type: 'string'},
      {caption: '反馈问题', type: 'string'},
      {caption: '问题描述', type: 'string'},
      {caption: '解决方案', type: 'string'},
      {caption: '进展', type: 'string'},
      {caption: '备注', type: 'string'},
      {caption: '提交时间', type: 'string'}
    ];

    let arr = [];
    for (let comment of comments){
      let arrComment = [comment.id,comment.name,comment.phone,comment.channel,comment.question,comment.description,comment.answer,comment.progress,comment.kfName,comment.time];
      arr.push(arrComment);
    }

    console.log(arr);
    conf.rows = arr;
    let result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + timeStamp +".xlsx");

    res.end(result, 'binary');

  });

})

module.exports = router;