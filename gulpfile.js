var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var webserver = require('gulp-webserver');

gulp.task('build', ['js', 'html', 'css']);

gulp.task('js', function() {
    browserify({
        entries: ['./js/main.js'],
        debug: true,
    })
    .transform(babelify, {
        presets: ['es2015'],
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/js/'));
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
        host: 'localhost',
        port: 8989,
        livereload: true,
    }));
});

gulp.task('watch', ['webserver'], function() {
    gulp.watch(['./js/**/*.js'], ['js']);
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./*.css'], ['css']);
});

gulp.task('default', ['build', 'watch']);

// vim: set ts=4 sw=4 et:
