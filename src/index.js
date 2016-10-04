var connect = require('connect'),
    serveStatic = require('serve-static'),
    serveIndex = require('serve-index'),
    path = require('path'),
    gaze = require('gaze'),
    open = require('open'),
    tinylr = require('tiny-lr'),
    debounce = require('lodash.debounce'),
    https = require('https'),
    http = require('http'),
    fs = require('fs');

function lrListen(err, livereloadPort, absoluteWatchFiles) {
  if(err) {
    console.error("Livereload not started", err);
    return;
  }

  console.log('Livereload listening on port %s', livereloadPort);

  console.log("Watching files:");
  for(var f in absoluteWatchFiles) {
    console.log('  ' + absoluteWatchFiles[f]);
  }
}

module.exports = function(port, dir, url, livereloadPort, watchFiles, openBrowser,
  extensions, debounceDelay, key, cert) {

  port = port || 8080;
  dir = dir || '.';
  url = url || '';
  key = key || '';
  cert = cert || '';
  var options = {};
  if ((key === '' && cert !== '') ||
      (key !== '' && cert === ''))
      {

        console.log("You have to specify both a certificate and a key");
        return;
      }
      else {
        options = {
            key:    fs.readFileSync(key),
            cert:   fs.readFileSync(cert),
        };
      }

  if(livereloadPort === 'false' || livereloadPort === false)
    livereloadPort = false;
  else
    livereloadPort = livereloadPort || 35729;

  watchFiles = watchFiles || [ '**/*.html', '**/*.js', '**/*.css', '**/*.xml' ];

  extensions = (extensions && extensions.length > 0) ? extensions : false;

  absoluteDir = path.resolve(dir);

  var absoluteWatchFiles = watchFiles.map(function(relativePath) {
    return path.join(absoluteDir, relativePath);
  });


  var server = connect();


  if(livereloadPort) {
    server.use(require('connect-livereload')({ port: livereloadPort }));
    var livereloadServer = null;
    if (key !== '' && cert !== '')
    {
      var o = {
          key:    key,
          cert:   cert
      };
      livereloadServer = tinylr(options);
      livereloadServer.listen(livereloadPort,
        function(err) {lrListen(err, livereloadPort, absoluteWatchFiles);});
    } else {
      livereloadServer = tinylr();
      livereloadServer.listen(livereloadPort,
        function(err) {lrListen(err, livereloadPort, absoluteWatchFiles);});
    }
    // livereloadServer.listen(livereloadPort, function(err) {
    //   if(err) {
    //     console.error("Livereload not started", err);
    //     return;
    //   }
    //
    //   console.log('Livereload listening on port %s', livereloadPort);
    //
    //   console.log("Watching files:");
    //   for(var f in absoluteWatchFiles) {
    //     console.log('  ' + absoluteWatchFiles[f]);
    //   }
    // });

    gaze(watchFiles, {cwd: absoluteDir}, function(err, watcher) {
      if(err) {
        console.error("Unable to watch files", err);
      }
      var files = [];
      var changed = debounce(function() {
        console.log("Sending changes:\n\t%s", files.join("\n\t"));
        livereloadServer.changed({body:{files:files}});
        files = [];
      }, debounceDelay);
      this.on('all', function(event, filepath) {
        console.log("Watch: " + filepath + ' was ' + event);
        files.push(filepath);
        changed();
      });
    });
  }

  server.use(serveStatic(absoluteDir, { extensions: extensions }))
        .use(serveIndex(absoluteDir));
        //.listen(port);

  if (key !== '' && cert !== '')
  {
    console.log("HTTPS server listening on port " + port + "\nServing " + absoluteDir);
    https.createServer(options, server).listen(port);
  } else {
    console.log("HTTP server listening on port " + port + "\nServing " + absoluteDir);
    http.createServer(server).listen(port);
  }




  if(openBrowser) { open("https://127.0.0.1:" + port + url); }

};
