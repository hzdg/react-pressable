import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import browserify from 'gulp-browserify';
import rename from 'gulp-rename';
import connect from 'gulp-connect';
import gbump from 'gulp-bump';


gulp.task('watch', () => {
  gulp.watch('./src/**/*', ['build']);
  gulp.watch('./test/**/*', ['build:tests']);
});

function bump(type) {
  gulp.src(['./bower.json', './package.json'])
    .pipe(gbump({type}))
    .pipe(gulp.dest('./'));
}

gulp.task('bump:major', () => bump('major'));
gulp.task('bump:minor', () => bump('minor'));
gulp.task('bump:patch', () => bump('patch'));

gulp.task('build:node', () => {
  gulp.src('./src/*.?(lit)coffee')
    .pipe(babel().on('error', gutil.log))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:browser', ['build:node'], () => {
  gulp.src('./lib/*.js')
    .pipe(browserify({
      standalone: 'controlfacades',
      transform: ['browserify-shim'],
    }))
    .pipe(rename('react-pressable.js'))
    .pipe(gulp.dest('./standalone/'));
});

gulp.task('build:tests', () => {
  gulp.src('./test/tests.js')
    .pipe(babel().on('error', gutil.log))
    .pipe(browserify({
      transform: ['browserify-shim'],
    }))
    .pipe(rename('tests-compiled.js'))
    .pipe(gulp.dest('./test/'));
});

// A server for the test page
gulp.task('testserver', () => {
  connect.server({
    root: [__dirname],
    port: 1337,
  });
});

gulp.task('test', ['build:browser', 'build:tests', 'testserver']);
gulp.task('build', ['build:node', 'build:browser']);
