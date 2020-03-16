// TODO: Remove this once we figure out testing with worker-loader. It doesn't work with `import` for some reason
/* eslint import/no-webpack-loader-syntax: 0 */
const EncryptWorker = require('worker-loader!workers/encrypt.worker') as WebpackWorker
export * from 'workers/encrypt.worker'
export default EncryptWorker
