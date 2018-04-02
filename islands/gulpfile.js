const gulp         = require('gulp');
const sass         = require('gulp-sass');
const browserSync  = require('browser-sync');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglifyjs');
const cssnano      = require('gulp-cssnano');
const rename       = require('gulp-rename');
const del          = require('del');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant');
const cache        = require('gulp-cache');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src(['app/sass/**/*.sass', 'app/sass/**/*.scss'])
	.pipe(sass({output: 'expanded'}).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function() {
	return gulp.src([		
		//'app/libs/OwlCarousel2-2.2.1/dist/owl.carousel.min.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs'], function() {
	gulp.watch(['app/sass/**/*.sass', 'app/sass/**.*.scss'], ['sass']);
	gulp.watch('app/*.html', browserSync.reload)
	gulp.watch('app/js/*.js', browserSync.reload)
});

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	let buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
		])
		.pipe(gulp.dest('dist/css'));

	let buildFonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	let buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	let buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
});
