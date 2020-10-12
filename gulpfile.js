const { src, dest, watch, parallel, series } = require('gulp');

const pug = require('gulp-pug'),
swig = require('gulp-swig'),
data = require('gulp-data'),
sync = require('browser-sync').create(),
fs = require('fs'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
autoprefixer = require('gulp-autoprefixer');

var sassOptions = {
  outputStyle: 'expanded',
};

var prefixerOptions = {
  browserlist: ['last 3 versions']
};
 
function  buildHTML(cb) {
  src('views/*.pug')
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync('./data/data.json'))
    }))
    .pipe(swig())
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(dest('public/'))
    .pipe(sync.stream());
  cb();
}

function generateCSS(cb) {
  src('./scss/*.scss')
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer(prefixerOptions))
      .pipe(concat('index.css'))
      .pipe(dest('public/stylesheets'))
      .pipe(sync.stream());
  cb();
}

function browserSync(cb) {
  sync.init({
      server: {
          baseDir: './public'
      }
  });

  watch('views/**.pug', buildHTML);
  watch('views/partials/**.pug', buildHTML);
  watch('./public/**.html').on('change', sync.reload);
}

function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.default = defaultTask;
exports.pug = buildHTML;
exports.sync = browserSync;
exports.css = generateCSS;
