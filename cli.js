#!/usr/bin/env node
'use strict'
const cac = require('cac')
const main = require('./')

const cli = cac(`
  Usage:
    res-time [host:port] [host:port] ...

  Options:
    -t, --timeout:        Set max timeout
    -v, --version:        Print version
    -h, --help:           Print help (You are here!)
`, {
  alias: {
    t: 'timeout'
  },
  default: {
    timeout: 1000
  }
})

cli.command('*', main)

cli.parse()
