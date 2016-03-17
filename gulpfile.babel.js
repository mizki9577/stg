import gulp       from 'gulp';
import browserify from 'browserify';
import source     from 'vinyl-source-stream';
import babelify   from 'babelify';
import webserver  from 'gulp-webserver';
import notify     from 'gulp-notify';
import gutil      from 'gulp-util';
import {argv}     from 'process';
import {spawn}    from 'child_process';
import path       from 'path';

let ws;

gulp.task('default-task', ['build', 'webserver', 'watch']);

gulp.task('build', ['js', 'html', 'css']);

gulp.task('js', () =>
  browserify('./src/main.js', {
    debug: true
  })
  .transform(babelify, {
    presets: ['es2015'],
  })
  .bundle()
  .on('error', notify.onError(err => err.message))
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./build/js/'))
);

gulp.task('html', () =>
  gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest('./build/'))
);

gulp.task('css', () =>
  gulp
    .src('./src/**/*.css')
    .pipe(gulp.dest('./build/css/'))
);

gulp.task('webserver', () =>
  ws = gulp
    .src('./build/')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8000,
      livereload: true,
    }))
);

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.js']  , ['js']);
  gulp.watch(['./src/**/*.html'], ['html']);
  gulp.watch(['./src/**/*.css'] , ['css']);
});

gulp.task('default', () => {
  const gulpfile = path.basename(__filename);
  let p;

  const spawnChild = () => {
    gutil.log(`Reloading gulpfile '${gutil.colors.cyan(gulpfile)}'...`);
    if (p) {
      p.kill();
    }
    if (ws) {
      ws.emit('kill');
    }
    p = spawn(argv[0], [...argv.slice(1), 'default-task'], {stdio: 'inherit'});
  };

  gulp.watch(gulpfile, spawnChild);
  spawnChild();
});

// vim: set ts=2 sw=2 et:
