var router = require('express').Router();
var template = require('./../views/index.marko');
var selectTpl = require('./../views/select.marko');
var showImagTpl = require('./../views/showImg.marko');
var registerTpl = require('./../views/register.marko');


  router.get('/', (req, res) => {
    template.render({},res);
  });

  router.get('/register', (req, res) => {
    registerTpl.render({},res);
  });

  // 内容选择页
  router.get('/select',(req,res)=>{
    selectTpl.render({},res);
  });


// 图片展示页
router.get('/showImg',(req,res)=>{
  showImagTpl.render({},res);
});


module.exports = router;