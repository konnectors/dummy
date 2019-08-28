const entry = require('./package.json').main

module.exports = {
  entry,
  target: 'node',
  mode: 'none',
  output: {
    filename: 'index.js'
  }
}
