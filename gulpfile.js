var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var webpack = require('webpack-stream')

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./docs"
        },
        notify: false
    })
})

gulp.task('watch',['browser-sync'], function() {
    gulp.watch("docs/js/**/*.js", ['webpack', 'reload'])
    gulp.watch("docs/index.html", function(){
        browserSync.reload()
    })
})

gulp.task('webpack', function() {
    return gulp.src('docs/js/Apps.js')
        .pipe(webpack( require('./webpack.config.js')))
        .on('error', function (){
            console.error.bind(console)
            this.emit('end')
        })
        .pipe(gulp.dest('docs/temp/js/'))
})

gulp.task('reload',['webpack'], function() {
    browserSync.reload()
})