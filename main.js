const core = require('@actions/core');
const github = require('@actions/github');

const toc = require('markdown-toc');
const Vinyl = require('vinyl');

const mdFilePath = core.getInput('markdown-file-path');
console.log(`target markdown file is ${mdFilePath}.`);


const file = new Vinyl({
  path: mdFilePath,

});

    var tocIndex = new File({path: index});
    tocIndex.contents = new Buffer(output.join('\n'));

    if (typeof opts.index === 'function') {
      prepareDest(tocIndex, opts.index, opts);
    }

    this.push(tocIndex);
    cb();



    try {
      var str = file.contents.toString();
      file.toc = toc(str, opts);
      file.contents = new Buffer(toc.insert(str, opts));
    } catch (err) {
      var errorOpts = {fileName: file.path, showStack: true};
      this.emit('error', new PluginError('gulp-markdown-toc', err, errorOpts));
      return;
    }




function render(str, options) {
  return new Remarkable()
    .use(toc.plugin(options)) // <= register the plugin
    .render(str);
}


try {


  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}



const path = require('path');
const File = require('vinyl');
const PluginError = require('plugin-error');
const through = require('through2');

module.exports = function(options) {
  var opts = Object.assign({}, options);
  var files = [];

  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    if (typeof opts.filterFiles === 'function' && !opts.filterFiles(file)) {
      next();
      return;
    }

    try {
      var str = file.contents.toString();
      file.toc = toc(str, opts);
      file.contents = new Buffer(toc.insert(str, opts));
    } catch (err) {
      var errorOpts = {fileName: file.path, showStack: true};
      this.emit('error', new PluginError('gulp-markdown-toc', err, errorOpts));
      return;
    }

    files.push(file);
    next(null, file);
  }, function(cb) {
    if (!opts.index) {
      cb();
      return;
    }

    var index = 'toc.md';
    if (typeof opts.index === 'string') {
      index = opts.index;
    }

    var len = files.length;
    var output = ['# Table of contents', ''];

    if (typeof opts.sortFiles === 'function') {
      files.sort(opts.sortFiles);
    }

    if (len > 1) {
      for (var i = 0; i < len; i++) {
        var file = files[i];
        var name = headingName(file, opts);
        var link = headingLink(file, opts);
        output.push('## [' + name + '](' + link + ')', '');
        output.push(prefixPath(file.toc.content, file.relative), '');
      }
    }

    var tocIndex = new File({path: index});
    tocIndex.contents = new Buffer(output.join('\n'));

    if (typeof opts.index === 'function') {
      prepareDest(tocIndex, opts.index, opts);
    }

    this.push(tocIndex);
    cb();
  });
};

function headingName(file, options) {
  if (typeof options.headingName === 'function') {
    return options.headingName(file);
  }
  return file.relative;
}

function headingLink(file, options) {
  if (typeof options.headingLink === 'function') {
    return options.headingLink(file);
  }
  return file.relative;
}

function prefixPath(toc, relative) {
  return toc.split('](').join('](' + relative);
}

function prepareDest(file, dest, options) {
  var opts = Object.assign({cwd: process.cwd()}, options);
  var cwd = path.resolve(opts.cwd);

  var destDir = typeof dest === 'function' ? dest(file) : dest;
  if (typeof destDir !== 'string') {
    throw new TypeError('expected destination directory to be a string');
  }

  var baseDir = typeof opts.base === 'function'
    ? opts.base(file)
    : path.resolve(cwd, destDir);

  if (typeof baseDir !== 'string') {
    throw new TypeError('expected base directory to be a string');
  }

  var cloned = file.clone({contents: false});
  var writePath = path.resolve(baseDir, file.relative);
  cloned.cwd = cwd;
  cloned.base = cwd;
  cloned.path = writePath;
  file.path = path.join(file.base, cloned.relative);
}
