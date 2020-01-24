// TODO: Remove this once we figure out testing with worker-loader. It doesn't work with `import` for some reason
// tslint:disable-next-line:no-var-requires
/* eslint import/no-webpack-loader-syntax: off */
const DecryptWorker = require('worker-loader!workers/decrypt.worker') as WebpackWorker
export * from 'workers/decrypt.worker'
export default DecryptWorker
