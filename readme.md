# [gulp](http://gulpjs.com)-jade-find-affected

> Run through jade files to find files that depend on changed file.

Sometimes you want to find jade files that are affected by a change in another jade file.

Let's say you have an index.jade with an include to includes/includefile.jade. You make a change in includes/includefile.jade, but also want to have index.jade marked as a subject of change so it can be compiled.

This module takes care of that and should also work well with livereload of the compiled changed files.

## Install

```sh
$ npm install --save-dev gulp-jade-find-affected
```


## Usage

Should be used in conjunction with [gulp-watch](https://www.npmjs.org/package/gulp-watch) where ```{ emit : 'one' }``` is set in options:

```js
var gulp = require('gulp');
var watch = require('gulp-watch');
var affected = require('gulp-jade-find-affected');

var SRC = 'jade/**/*.jade';
var DEST = 'dist';

gulp.task('watch-jade', function () {
	return gulp.src(SRC)
		.pipe(watch({ emit : 'one' }))
		.pipe(affected())
		// jade will only get (and compile) the files in your base directory which have been affected by the changed file
		.pipe(jade())
		.pipe(gulp.dest(DEST));
});
```

## License

MIT © [Brian Frisch](http://github.com/teltploek)