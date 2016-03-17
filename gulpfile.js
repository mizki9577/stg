var gulp       = require('gulp');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var babelify   = require('babelify');
var webserver  = require('gulp-webserver');
var notify     = require('gulp-notify');

gulp.task('build', ['js', 'html', 'css']);

gulp.task('js', function() {
    browserify('./src/main.js', {
        debug: true
    })
    .transform(babelify, {
        presets: ['es2015'],
    })
    .bundle()
    .on('error', notify.onError(function(err) {
        return err.message;
    }))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('html', function() {
    gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('css', function() {
    gulp.src('./src/**/*.css')
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('webserver', function() {
    gulp.src('./build/')
    .pipe(webserver({
        host: '0.0.0.0',
        port: 8000,
        livereload: true,
    }));
});

gulp.task('watch', function() {
    gulp.watch(['./src/**/*.js']  , ['js']);
    gulp.watch(['./src/**/*.html'], ['html']);
    gulp.watch(['./src/**/*.css'] , ['css']);
});

gulp.task('default', ['build', 'webserver', 'watch']);

// vim: set ts=4 sw=4 et:
