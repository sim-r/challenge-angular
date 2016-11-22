var gulp = require('gulp')
var browserSync = require('browser-sync').create()

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: '../'
    },
    host: '127.0.0.1',
    open: true
  })

  // js
  gulp.watch(['../app/app.module.js', '../app/**/*.js'], function () {
    browserSync.reload()
  })

  // html
  gulp.watch(['../index.html', '../app/**/*.html'], function () {
    browserSync.reload()
  })

  // css
  gulp.watch(['../styles/styles.css'], function () {
    browserSync.reload()
  })
})

