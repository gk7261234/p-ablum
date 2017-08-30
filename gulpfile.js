/**
 * Created by GK on 2017/8/29.
 */
  // 添加引用
const gulp = require('gulp');
const gls = require('gulp-live-server');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');

//这个可以让express启动
gulp.task("node", function () {
  nodemon({
    script: './bin/www',
    ext: 'js marko',
    env: {
      'NODE_ENV': 'development'
    }
  })
});


gulp.task('server', ["node"], function () {
  var files = [
    'views/**/*.marko',
    'routes/**/*.js',
    'public/**/*.*'
  ];

  //gulp.run(["node"]);
  // browserSync.init(files, {
  //   proxy: 'http://localhost:3001',
  //   browser: 'chrome',
  //   notify: false,
  //   port: 3001
  // });

  gulp.watch(files).on("change", reload);
});

gulp.task('server1',function () {
  var server = gls.new(
    ['--harmony', 'bin/www'],
    {env: {NODE_ENV: 'development'}}
  );
  server.start();

  gulp.watch(['public/**/*.css'], function () {
    server.notify.apply(server);
  });
  gulp.watch(['public/**/*.html', 'public/**/*.js'], function (file) {
    server.notify.apply(server, [file]);
  });
  gulp.watch(['app.js', 'routes/**/*.js', 'components/**/*.js', 'views/**/*.marko'], function() {
    console.log('gulp check code has been changed, restart server......');
    server.start.bind(server)().then(function(){
      console.log("server restarted!!!");
    }).catch(function(err){
      console.error("server restarted failed:" + err);
    });
  }); //restart my server
});