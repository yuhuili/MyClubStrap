/**
 * Created by Gabriel Alacchi on 9/13/16.
 */

var DEBUG = true;

var gulp = require('gulp');
var imageMin = require('gulp-imagemin');
var webpack = require('webpack-stream');
var scss = require('gulp-sass');
var browserSync = require('browser-sync').create();

const src = {
  "js": "./web/src/**/*.js",
  "scss": "./web/scss/**/*.scss",
  "images": "./web/images/**/*",
  "html": "./web/pages/**/*.html"
};

const dest = {
  "js": "./build/src",
  "scss": "./build/css",
  "images": "./build/img",
  "html": "./build"
};

function onError(error) {
  console.error(error);
  this.end();
}

gulp.task('bundle', function () {
  return gulp.src(src.js)
    .pipe(webpack( require('./webpack.config.js')
      .getWithDebugFlag(DEBUG) // Get's the webpack config with a debug flag
    ))
    .on('error', onError)
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.stream())
    .on('error', onError);
});

gulp.task('style', function() {
  return gulp.src(src.scss)
    .pipe(scss({
      outputStyle: DEBUG ? 'expanded' : 'compressed'
    })).on('error', scss.logError)
    .pipe(gulp.dest(dest.scss))
    .pipe(browserSync.stream())
    .on('error', onError);
});

gulp.task('images', function () {
  return gulp.src(src.images)
    .pipe(imageMin())
    .on('error', onError)
    .pipe(gulp.dest(dest.images))
    .pipe(browserSync.stream())
    .on('error', onError);
});

gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(gulp.dest(dest.html))
    .pipe(browserSync.stream())
    .on('error', onError);
});

gulp.task('watch', function () {

  browserSync.init({
    proxy: 'localhost:3000'
  });

  gulp.watch([src.js], ['bundle']);
  gulp.watch([src.images], ['images']);
  gulp.watch([src.scss], ['style']);
  gulp.watch([src.html], ['html']);

});

gulp.task('as-prod', function() {
  DEBUG = false;
});

gulp.task('build', ['style', 'bundle', 'images', 'html']);

gulp.task('production', ['as-prod', 'build']);

gulp.task('build-if-dev', function() {
  if (process.env.NODE_ENV != 'production') {
    // We are not on a production server, proceed to build
    gulp.run('build');
  } else {
    console.log("Production Deployment... Gulp won't run build");
  }
});

gulp.task('default', ['style', 'bundle', 'images', 'html', 'watch']);
