var gulp = require('gulp');
var gutil = require('gulp-util');
var scss = require('gulp-dart-scss');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");


gulp.task('scss-lint', function (done) {
  if (process.env.NODE_ENV === 'development') {
    var scsslint = require('gulp-scss-lint');

    if (!cFlags.test) {
      gutil.log(gutil.colors.cyan('scss-lint'), 'Disabling linting');
      return done();
    }

    return gulp.src('./assets/styles/**/*.scss')
      .pipe(scsslint({
        config: './.scss-lint.yml',
      }))
      .pipe(scsslint.failReporter());
  }
  return done();

});

gulp.task('styles', gulp.series('scss-lint', function () {

  gutil.log(gutil.colors.cyan('styles'), 'Compiling Sass assets');

  var scssStream = scss();
  var stream = gulp.src('./assets/styles/main.scss');

  if (cFlags.production) {
    gutil.log(gutil.colors.cyan('styles'), 'Compressing styles');
    scssStream = scss({ outputStyle: 'compressed' });
  }

  stream = stream.pipe(sourcemaps.init())
    .pipe(scssStream)
    .pipe(postcss([autoprefixer()]))
    .on('error', function (error) {
      gutil.log(
        gutil.colors.yellow('styles'),
        gutil.colors.red('error'),
        '\n',
        error.messageFormatted
      );

      if (cFlags.production) {
        process.exit(1);
      }

      this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./static/assets/styles'));

  return stream;


}));
