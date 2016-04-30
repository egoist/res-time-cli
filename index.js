'use strict'
const resTime = require('res-time')
const table = require('text-table')
const chalk = require('chalk')
const logUpdate = require('log-update')
const Ora = require('ora')

const spinner = new Ora({spinner: 'arrow3'})
const timeRegex = /(\d+\.\d+)ms/

function colorful(text) {
  if (!isTime(text)) {
    return chalk.red(text)
  }
  const time = parseFloat(text.match(timeRegex)[1])
  if (time > 200) {
    return chalk.yellow(text)
  }
  return chalk.green(text)
}

function isTime(text) {
  return timeRegex.test(text)
}

function render(domains, ret) {
  logUpdate(
    '\n' +
    table(
      domains.map((domain, index) => {
        const time = ret && ret[index]
          ? colorful(ret[index])
          : null
        return [
          `  ${domain}`,
          time || spinner.frame()
        ]
      })
    ) +
    '\n'
  )
}

module.exports = function* () {
  let domains = this.input
  if (this.input.length === 0) {
    throw new Error('Expected input domains')
  }

  setInterval(() => {
    render(domains)
  }, 80)

  const good = val => `${val}ms`
  const bad = err => {
    if (err.message.indexOf('ETIMEDOUT') !== -1) {
      return 'timeout'
    }
    return err.message
  }

  const times = yield domains.map(domain => {
    domain = domain.split(':')
    return resTime({
      host: domain[0],
      port: domain[1],
      timeout: this.flags.timeout
    }).then(good, bad)
  })

  render(domains, times)
  process.exit()
}
