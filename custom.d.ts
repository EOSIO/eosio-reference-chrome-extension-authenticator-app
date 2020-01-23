///<reference types="chrome"/>

type Extend<TType extends Object, TExtension extends Object> = { [K in keyof TType]: TType[K] } & TExtension

declare module "*.svg" {
  const content: any
  export default content
}

declare module "*.gif" {
  const content: any
  export default content
}

declare module "eosjs-ecc"

declare module "bip38"
declare module "wif"

interface WebpackWorker extends Worker {
  new(): Worker
}

declare module "*.worker" {
  export default WebpackWorker
}
