/**
 * Created by GK on 2017/8/30.
 */
const express = require('express');
const router = express.Router();
const db = require('./db.js');

const videoTpl = require('../views/video/showVideo.marko');

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


module.exports = router;