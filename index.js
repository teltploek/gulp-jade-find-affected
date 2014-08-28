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

function findAffectedRecurse(path, filesBase, cb) {
  if (typeof path === 'object') path = path.path;

  var file = new File({
    path: path.replace(/\//g, '\\')
  });

  var changedFile = file.path.replace(filesBase, '').split('.jade')[0];
  changedFile = changedFile.replace('\\', '/');

  glob(filesBase + '/**/*.jade', {}, function (er, files) {
    _.each(files, function(path, i) {
      var jadeFile = fs.readFileSync(path, 'utf8').replace(/\r\n|\r/g, '\n');

      var pattern = new RegExp('include (?:\.\.\/)?('+changedFile+')');
      var res = pattern.test(jadeFile);       

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
    var that = this;

    // now find files that were affected by the change
    findAffectedRecurse(file, file.base, function(affectedFiles) {
      _.each(affectedFiles, function(affectedFile) {
        
        that.push(new File({
          base: file.base,
          path: affectedFile.path.replace(/\//g, '\\'),
          contents: new Buffer(affectedFile.content)
        }));

        // log event to the screen
        logEvent(path.basename(file.path), affectedFile.path.replace(/\//g, '\\').replace(file.base, ''));
      });
    });

    return cb();
  }

  return through.obj(FindAffected);
};
