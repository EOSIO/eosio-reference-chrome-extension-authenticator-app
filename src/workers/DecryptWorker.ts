// TODO: Remove this once we figure out testing with worker-loader. It doesn't work with `import` for some reason
/* eslint import/no-webpack-loader-syntax: 0 */
const DecryptWorker = require('worker-loader!workers/decrypt.worker') as WebpackWorker
export * from 'workers/decrypt.worker'
export default DecryptWorker
