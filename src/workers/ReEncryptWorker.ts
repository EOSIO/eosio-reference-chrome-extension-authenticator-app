// TODO: Remove this once we figure out testing with worker-loader. It doesn't work with `import` for some reason
// tslint:disable-next-line:no-var-requires
/* eslint import/no-webpack-loader-syntax: off */
const ReEncryptWorker = require('worker-loader!workers/reEncrypt.worker') as WebpackWorker
export * from 'workers/reEncrypt.worker'
export default ReEncryptWorker
