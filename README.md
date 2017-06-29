{
  "name": "g-xaxis",
  "author": "Bob haslett",
  "version": "0.0.1",
  "description": "{DESCRIPTION}",
  "keywords": [
    "FT",
    "g-chartframe",
    "d3",
    "d3-module"
  ],
    "license": "BSD-3-Clause",
  "main": "build/g-xaxis.js",
  "jsnext:main": "index",
  "homepage": "https://github.com/ft-interactive/g-xaxis",
  "repository": {
    "type": "git",
    "url": "https://github.com/ft-interactive/g-xaxis.git"
  },
  "scripts": {
    "pretest": "rm -rf build && mkdir build && rollup --globals d3:d3 -f umd -n gAxis -o build/g-xaxis.js -- index.js",
    "test": "tape 'test/**/*-test.js'",
    "prepublish": "npm run test && uglifyjs build/g-xaxis.js -c -m -o build/g-xaxis.min.js",
    "postpublish": "zip -j build/g-yaxislinear.zip -- LICENSE README.md build/g-xaxis.js build/g-xaxis.min.js"
  },
  "dependencies": {
    "d3": "^4.9.1"
  },
  "devDependencies": {
    "rollup": "0.27",
    "tape": "4",
    "uglify-js": "2"
  }
}
