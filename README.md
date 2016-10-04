# lr-http-https

An HTTP(S) server with livereload included. If a file inside the folder being served is changed, added or deleted, the browser will automatically reload. To create a HTTPS server, you have to provide the path to both a *.key and a *.cert file.

This program is based on lr-http-server available at:
https://github.com/digisfera/lr-http-server


## Installing

    npm install -g lr-http-https

## Usage

    lr-http-https [-p <port>] [-d <dir>] [-l livereloadport] [-w < watchPaths || false >] [-b] [-k <path>] [-c <path>]

**port** (default *8080*): Port to listen on

**dir** (default *.*): Folder to serve

**url** (default *empty*): Path to open the specific page. *e.g.* `/#/main` 

**livereloadport** (default *35729*): Port for the livereload server. If `false` the livereload is disabled.

**watchPaths**: Comma-separated list of glob patterns for the files to watch. *e.g.* `**/*.js,**/*.css,**/*.html,**/*.xml`

**b**: disable browser open

**k**: path to a key file; required for the https server

**c**: path to a certificate file; required for the https server

## Examples

Default usage

    > lr-http-https

    HTTP server listening on port 8080
    Serving <path>
    Livereload listening on port 35729
    Watching files:
      '<path>/**/*.html'
      '<path>/**/*.js'
      '<path>/**/*.css'
      '<path>/**/*.xml'

All options

    > lr-http-https -p 80 -d src/ -u /#/main -l 30000 -w **/*.css,*.html 

    HTTP server listening on port 80
    Serving <path>/src
    Open page in browser <path>/src/#/main
    Livereload listening on port 30000
    Watching files:
      <path>/src/**/*.css
      <path>/src/*.html

