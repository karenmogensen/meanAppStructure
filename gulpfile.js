var gulp        = require('gulp');
var browserSync = require('browser-sync');
var nodemon		= require('nodemon');
var git 		= require('gulp-git');

var config 		= require("./gulp.config")();

gulp.task("nodemon", function(){
	var options = {
		script: config.nodeApp,
		watch: config.server
	};

	return nodemon(options)
		.on("start", function(){
			console.log("nodemon started");
			startBrowserSync();
		})
		.on("restart", function(){
			console.log("nodemon restarted");
		})
})

gulp.task("default", ["nodemon"]);

function startBrowserSync(){
	if(browserSync.active){
		return;
	}
	console.log("browserSync starting");

	var options = {
		proxy: 'localhost:' + config.nodePort,
        port: config.browserSyncPort,
		ghostMode: {
			scroll: true
		},
		browser: ["firefox"],
		files: config.browserSyncFiles
	}
	browserSync(options);		
}
//Git tasks
/*
gulp.task('fgitLocal:{message}', function(){
  return gulp.src('./')
    .pipe(git.add());
    .pipe(git.commit(params.message));
});
*/
gulp.task('bump', ['build-shim'], function () {
  return gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('gitLocal', function () {
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src('./')
  	.pipe(git.add())
    .pipe(git.commit(message))
    .pipe(gulp.dest('./'));
});

gulp.task('gitRemote', function () {
  return gulp.src('./')
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});