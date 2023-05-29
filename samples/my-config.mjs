import path from 'path';

const entry = 'src/index.js'
module.exports = {
  entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
  plugins: [
    'my-build-test'
  ]
}