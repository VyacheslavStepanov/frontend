'use strict';
var gulp = require('gulp'),
	watch = require('gulp-watch'),
	less = require('gulp-less'),
	lessPluginCleanCSS = require('less-plugin-clean-css'),
	lessPluginAutoPrefix = require('less-plugin-autoprefix'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssMin = require('gulp-minify-css'),
	rimRaf = require('rimraf'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	inject = require('gulp-inject'),
	gulpif = require('gulp-if'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'public/',
		htmlIndex: 'public/index.html',
		js: 'public/scripts/',
		jsMain: 'public/scripts/main.min.js',
		style: 'public/styles/'
	},
	src: {
		html: 'src/pages/*.html',
		styleCommon: ['src/styles/common/*.less', 'src/styles/components/*.less'], 
		stylePage: 'src/styles/pages/*.less',
		js: ['src/**/*.js', 'node_modules/scrollmagic/scrollmagic/minified/*js']
	},
	watch: {
		html: 'src/**/*.html',
		style: 'src/**/*.less',
		js: 'src/**/*.js'
	},
	clean: './public'
};

var config  = {
	server: {
		baseDir: "./public"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend"
};

gulp.task('webserver', function(){
	browserSync(config)
});

gulp.task('html:build', function(){
	gulp.src(path.src.html)
		.pipe(rigger())
		//.pipe(inject(gulp.src(path.build.jsMain, {read: false}), {relative:true}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('style-common:build', function(){
	gulp.src(path.src.styleCommon)
		.pipe(sourcemaps.init())
		.pipe(less([lessPluginAutoPrefix, cssMin({keepBreaks: false})]))
		.pipe(concat('common.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});

gulp.task('style-page:build', function(){
	gulp.src(path.src.stylePage)
		.pipe(sourcemaps.init())
		.pipe(less([lessPluginAutoPrefix, cssMin({keepBreaks: false})]))
		.pipe(rename(function(path) {
			path.basename+='-styles';
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function(){
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
})

gulp.task('inject:build', function() {
	gulp.src(path.build.htmlIndex)
		.pipe(inject(gulp.src(path.build.jsMain, {read: false}), {relative:true}))
		.pipe(gulp.dest(path.build.html));
})

gulp.task('build', [
	'style-common:build',
	'style-page:build',
	'js:build',
	'html:build',
	'inject:build'
]);

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style-common:build');
		gulp.start('style-page:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
});

gulp.task('clean', function(cb) {
	rimRaf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch'])