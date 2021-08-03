/* eslint-disable no-undef */
'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');
const { dest } = require('gulp');

gulp.task('css', () => gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(csso())
  .pipe(rename('style.min.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream()));

gulp.task('js', () => gulp.src('source/js/*.js')
  .pipe(dest('build/js/'))
  .pipe(server.stream()));

gulp.task('server', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('js'));
});

gulp.task('refresh', (done) => {
  server.reload();
  done();
});

gulp.task('images', () => gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.jpegtran({ progressive: true }),
    imagemin.svgo(),
  ]))

  .pipe(gulp.dest('source/img')));

gulp.task('webp', () => gulp.src([
  'source/img/**/*.{png,jpg}',
  '!source/img/backgrounds/**',
])
  .pipe(webp({ quality: 90 }))
  .pipe(gulp.dest('build/img')));

gulp.task('sprite', () => gulp.src('source/img/sprite/*.svg')
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img')));

gulp.task('html', () => gulp.src('source/*.html')
  .pipe(posthtml([
    include(),
  ]))
  .pipe(gulp.dest('build')));

gulp.task('copy', () => gulp.src([
  'source/fonts/**/*.{woff,woff2}',
  'source/img/**',
  '!source/img/sprite/**',
  'source/js/**',
  'source//*.ico',
], {
  base: 'source',
})
  .pipe(gulp.dest('build')));

gulp.task('clean', () => del('build'));

gulp.task('build', gulp.series('clean', 'copy', 'webp', 'css', 'sprite', 'html'));
gulp.task('start', gulp.series('build', 'server'));
