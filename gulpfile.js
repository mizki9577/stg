var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var webserver = require('gulp-webserver');
var notify = require('gulp-notify');

gulp.task('build', ['js', 'html', 'css']);

gulp.task('js', function() {
    browserify('./main.js', {
        debug: true
    })
    .transform(babelify, {
        presets: ['es2015'],
    })
    .bundle()
    .on('error', notify.onError(function(err) {
        return err.message;
    }))
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('html', function() {
    gulp.src('./*.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('css', function() {
    gulp.src('./*.css')
    .pipe(gulp.dest('./build/'));
});

gulp.task('webserver', function() {
    gulp.src('./build')
    .pipe(webserver({
        host: '0.0.0.0',
        port: 8000,
        livereload: true,
    }));
});

gulp.task('watch', ['webserver'], function() {
    gulp.watch(['./*.js'], ['js']);
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./*.css'], ['css']);
});

gulp.task('default', ['build', 'watch']);

// vim: set ts=4 sw=4 et:
