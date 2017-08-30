/**
 * Created by GK on 2017/5/31.
 */
var router = require('express').Router();
var registerTpl = require('./../views/register.marko');


router.get('/',function (req,res) {
  registerTpl.render({},res);
});


module.exports = router;
