# [gulp](http://gulpjs.com)-jade-find-affected

> When a change happens in an included file, find the files that are affected by the changes and send their paths through the stream

![alt text](https://raw.githubusercontent.com/teltploek/gulp-jade-find-affected/master/docs/demo.gif "Demo")

Sometimes you want to compile jade files that are affected by a change in another jade file.

Let's say you have an frontpage.jade with an include to includes/an-included-file.jade. You make a change in includes/an-included-file.jade, but also want to have frontpage.jade marked as a subject of change so it can be compiled.

This module takes care of that and should also work well with livereload of the compiled changed files.

## Install

```sh
$ npm install --save-dev gulp-jade-find-affected
```


## Usage

Should be used in conjunction with [gulp-watch](https://www.npmjs.org/package/gulp-watch):

```js
var gulp = require('gulp');
var watch = require('gulp-watch');
var affected = require('gulp-jade-find-affected');

gulp.task('watch-jade', function () {
	watch('jade/**/*.jade')
		.pipe(affected())
		// jade will only get (and compile) the files in your base directory which have been affected by the changed file
		.pipe(jade())
		.pipe(gulp.dest('dist'));
});
```
## Changelog

* 0.2.2 - Added change triggering for extends as requested in issues.
* 0.2.1 - Bumped again, to be able to re-publish with new changelog. Seems important enough though.
* 0.2.0 - Bumped version. Cooperation from here on forward is with newer version of gulp-watch, which could present breaking changes.
* 0.1.5 - Removed instructions to pass deprecated options to gulp-watch
* 0.1.4 - Fixed bug where files found in first iteration would be stored and recompiled on following iterations regardless of whether or not they were actually affected files.
* 0.1.3 - Fixed bug where files in root wouldn't be passed through the stream if they weren't dependencies in other files.
* 0.1.2 - Increased portability of module to several operating systems.
* 0.1.1 - Fixed bug related to file base.
* 0.1.0 - First release

## License

MIT © [Brian Frisch](http://github.com/teltploek)