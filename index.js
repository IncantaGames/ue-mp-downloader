#!/usr/bin/env node
"use strict";
const argv = require('yargs').argv;

if (argv.manifests) {
  require('./manifests.js');
} else {
  require('./downloader.js');
}
