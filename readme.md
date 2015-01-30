# [gulp](http://gulpjs.com)-jade-find-affected

> Run through jade files to compile files that depend on a changed included file.

Sometimes you want to compile jade files that are affected by a change in another jade file.

Let's say you have an index.jade with an include to includes/includefile.jade. You make a change in includes/includefile.jade, but also want to have index.jade marked as a subject of change so it can be compiled.

This module takes care of that and should also work well with livereload of the compiled changed files.

## Install

```sh
$ npm install --save-dev gulp-jade-find-affected
```


## Usage

Should be used in conjunction with [gulp-watch](https://www.npmjs.org/package/gulp-watch) where ```{ glob : src, emitOnGlob : false }``` is set in options:

```js
var gulp = require('gulp');
var watch = require('gulp-watch');
var affected = require('gulp-jade-find-affected');

var src = 'jade/**/*.jade';
var dest = 'dist';

gulp.task('watch-jade', function () {
	watch({ glob : src, emitOnGlob: false })
		.pipe(affected())
		// jade will only get (and compile) the files in your base directory which have been affected by the changed file
		.pipe(jade())
		.pipe(gulp.dest(dest));
});
```
## Changelog

* 0.1.3 - Fixed bug where files in root wouldn't be passed through the stream if they weren't dependencies in other files.
* 0.1.2 - Increased portability of module to several operating systems.
* 0.1.1 - Fixed bug related to file base.
* 0.1.0 - First release

## License

MIT © [Brian Frisch](http://github.com/teltploek)