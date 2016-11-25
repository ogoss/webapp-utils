'use strict';

var fs = require('fs');
var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');

var dist = './dist/';

var sourceJS = './app/scripts/utils.js';
var sourceCSS = './app/styles/orient.css';
var outPutJS = 'utils.min.js';
var outSourceMap = 'utils.min.js.map';
var outPutCSS = 'orient.min.css';

var resultJS = UglifyJS.minify(sourceJS, {
  outSourceMap: outSourceMap
});
var resultCSS = new CleanCSS().minify([sourceCSS]);

fs.access(dist, fs.F_OK, function(err) {
  if (err) {
    fs.mkdirSync(dist);
  }

  fs.writeFile(dist + outPutJS, resultJS.code, 'utf8', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('JS-min Build Success!');
    }
  });
  fs.writeFile(dist + outSourceMap, resultJS.map, 'utf8', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('JS-map Build Success!');
    }
  });

  fs.writeFile(dist + outPutCSS, resultCSS.styles, 'utf8', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('CSS-min Build Success!');
    }
  });
});
