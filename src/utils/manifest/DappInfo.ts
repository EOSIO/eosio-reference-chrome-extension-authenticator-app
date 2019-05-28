import { ChainManifest, AppMetadata } from 'eosjs-signature-provider-interface'

export interface AppMetadataInfo {
  appMetadata: AppMetadata
  appMetadataHash: string
}

export interface DappInfo {
  appMetadataInfo: AppMetadataInfo
  chainManifest: ChainManifest
  rootUrl: string
}
