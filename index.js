'use strict';

var vfs = require('vinyl-fs');
var fs = require('fs');
var glob = require('glob');
var gs = require('glob-stream');
var gutil = require('gulp-util');
var _ = require('lodash');
var path = require('path');
var through = require('through2');
var map = require('map-stream');
var File = require('vinyl');

var foundFiles = [];

function findAffectedRecurse(filePath, filesBase, cb) {
  if (typeof filePath === 'object') filePath = filePath.path;

  var file = new File({
    path: filePath
  });

  var changedFile = path.relative(filesBase, file.path).split('.jade')[0];
  var filesPath = path.join(filesBase, '**/*.jade');

  glob(filesPath , {}, function (er, files) {
    _.each(files, function(path, i) {
      var jadeFile = fs.readFileSync(path, 'utf8').replace(/\r\n|\r/g, '\n');

      var testfile = changedFile.replace(/\\/g, '/');
      var patterns = [];

      patterns.push(new RegExp('include (?:\.\.\/)?('+testfile+')'));
      patterns.push(new RegExp('extends (?:\.\.\/)?('+testfile+')'));


      var res = patterns[0].test(jadeFile) || patterns[1].test(jadeFile);

      // let's map out the paths we've found in where the changed file will affect changes
      var foundPaths = _.map(foundFiles, 'path');

      if (res && _.indexOf(foundPaths, path) === -1) {
        foundFiles.unshift({
          path : path,
          content : jadeFile
        });

        findAffectedRecurse(foundFiles[0].path, filesBase, cb);
      }
    });
  });

  cb(foundFiles);
}

function logEvent(filepathAffected, filePathChanged) {
  var msg = [gutil.colors.magenta(filePathChanged), 'was affected by the change of', gutil.colors.magenta(filepathAffected), 'and will be compiled.'];
  gutil.log.apply(gutil, msg);
}

module.exports = function(){

  function FindAffected(file, enc, cb){
    foundFiles = [];
    
    var base = path.resolve(file.cwd, file.base);
    var that = this;

    // now find files that were affected by the change
    findAffectedRecurse(file, base, function(affectedFiles) {
      _.each(affectedFiles, function(affectedFile) {
        that.push(new File({
          base: base,
          path: affectedFile.path,
          contents: new Buffer(affectedFile.content)
        }));

        // log event to the screen
        logEvent(path.basename(file.path), path.relative(base, affectedFile.path));
      });
    });

    // also compile yourself a long with the affected files
    this.push(new File({
      base: base,
      path: file.path,
      contents: file._contents
    }))

    return cb();
  }

  return through.obj(FindAffected);
};