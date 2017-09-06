/**
 * Created by GK on 2017/9/6.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const COMMENTS_FILE = "E:/MyProject/p-ablum/public/note/content.txt";

const noteTpl = require("../views/note/showNote.marko");

var resolve = file => path.resolve(__dirname, file);

function getNowFormatDate() {
  var date = new Date();
  // var seperator1 = "-";
  // var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + month + strDate;
  return currentdate;
}

router.get('/', function (req, res, next) {
  noteTpl.render({},res);
});

router.post('/_save',function (req, res, next) {
  console.log(req.body);
  let timeStamp = getNowFormatDate();
  console.log(timeStamp);
  var folder = 'note/test.txt';
  console.log(resolve(folder));
  var pathStr = resolve(folder);
  if (!fs.existsSync(pathStr)){
    fs.mkdirSync(pathStr);
  }
  fs.readFile(pathStr,function (err,data) {
    if (err){
      console.log(err);
      return console.log("读取文件失败");
    }else {
      fs.writeFile(pathStr,"nihao",function (err,data) {
        if (err){
          return console.log("写入失败");
        }
      })
    }
  })
  fs.readFile(COMMENTS_FILE, (err, data) => {
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
      time:req.body.time
    };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), (err, data) => {
      if(err){
        console.log(err);
        process.exit(1);
      }
      res.json(newComment);
    });
  });
});


module.exports = router;