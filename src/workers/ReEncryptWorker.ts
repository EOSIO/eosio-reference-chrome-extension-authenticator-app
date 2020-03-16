// TODO: Remove this once we figure out testing with worker-loader. It doesn't work with `import` for some reason
/* eslint import/no-webpack-loader-syntax: 0 */
const ReEncryptWorker = require('worker-loader!workers/reEncrypt.worker') as WebpackWorker
export * from 'workers/reEncrypt.worker'
export default ReEncryptWorker
