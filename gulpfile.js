const gulp = require('gulp');

const browserSync = require('browser-sync');
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const swPrecache = require('sw-precache') ;

const htmlSource = '*.html';
const imgSource = 'src/web/img/*.*';
const cssSource = 'src/web/css/**.css';
const jsSource = './src/web/js';

function handleErrors(...args) {
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

gulp.task('html', () => {
	gulp.src(htmlSource)
		.pipe(reload({stream:true}))
});

gulp.task('images', () => {
	gulp.src(imgSource)
		.pipe(gulp.dest('build/img'))
});

gulp.task('styles', () => {
	gulp.src(cssSource)
		.pipe(autoprefixer())
		.on('error', handleErrors)
		.pipe(gulp.dest('build/css'))
		.pipe(buffer())
		.pipe(cleanCSS())
		.on('error', handleErrors)
		.pipe(rename({
      suffix: '.min'
    }))
		.pipe(gulp.dest('build/css'))
		.pipe(reload({stream: true}))
});

gulp.task('scripts', () => {
	const bundler = browserify(jsSource + '/main.js')
		.transform('babelify', {presets: ['es2015']})
	const stream = bundler.bundle();
	return stream
		.on('error', handleErrors)
		.pipe(source('main.min.js'))
		.pipe(gulp.dest('build'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./build'))
		.pipe(reload({stream:true}))
});

gulp.task('browser-sync', function() {
	browserSync({
			server : {},
			ghostMode: false
	});
});

gulp.task('default', ['html', 'images', 'styles', 'scripts', 'browser-sync'], () => {
	gulp.watch(htmlSource, ['html']);
	gulp.watch(cssSource, ['styles']);
	gulp.watch(jsSource + '/*.js', ['scripts']);
	gulp.watch(imgSource, ['images']);
});
