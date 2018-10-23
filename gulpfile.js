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
	reload = browserSync.reload;

var path = {
	build: {
		html: 'public/',
		js: 'public/scripts/',
		style: 'public/styles/'
	},
	src: {
		html: 'src/**/*.html',
		style: 'src/**/*.less', 
		js: 'src/**/*.js'
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
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function(){
	gulp.src(path.src.style)
		.pipe(sourcemaps.init())
		.pipe(less([lessPluginAutoPrefix, cssMin({keepBreaks: false})]))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function(){
	gulp.src(path.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
})

gulp.task('build', [
	'html:build',
	'style:build',
	'js:build'
]);

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
});



gulp.task('clean', function(cb) {
	rimRaf(path.clean, cb);
});


gulp.task('default', ['build', 'webserver', 'watch'])