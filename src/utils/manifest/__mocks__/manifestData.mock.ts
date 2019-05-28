import { AppManifest, ChainManifest, AppMetadata } from 'eosjs-signature-provider-interface'

import { DappInfo } from 'utils/manifest/DappInfo'

export const appMetadata: AppMetadata = {
  spec_version: '0.7.0',
  name: 'App Name',
  shortname: 'App Short Name',
  scope: '/',
  apphome: '/',
  icon: 'http://domain.one/app-icon.png#SHA256Hash',
  description: 'App description',
  sslfingerprint: 'SLL Fingerprint',
  chains: [
    {
      chainId: 'chainId1',
      chainName: 'Chain One',
      icon: 'http://domain.one/chain-icon1.png#SHA256Hash',
    },
    {
      chainId: 'chainId2',
      chainName: 'Chain Two',
      icon: 'http://domain.one/chain-icon2.png#SHA256Hash',
    },
  ],
}

const chainManifests: ChainManifest[] = [{
  chainId: 'chainId1',
  manifest: {
    account: 'account',
    domain: 'http://domain.one',
    appmeta: 'http://domain.one/app-metadata.json#SHA256Hash',
    whitelist: [{
      contract: 'account.one',
      action: 'action1',
    },
      {
        contract: 'account.one',
        action: 'action2',
      },
      {
        contract: 'account.one',
        action: 'action3',
      }],
  },
},
  {
    chainId: 'chainId2',
    manifest: {
      account: 'account',
      domain: 'http://domain.one',
      appmeta: 'http://domain.one/app-metadata.json#SHA256Hash',
      whitelist: [{
        contract: 'account.one',
        action: 'action4',
      },
        {
          contract: 'account.one',
          action: 'action5',
        },
        {
          contract: 'account.one',
          action: 'action6',
        }],
    },
  },
]

export const appManifest: AppManifest = {
  spec_version: '0.7.0',
  manifests: chainManifests
}

export const dappInfo: DappInfo = {
  chainManifest: chainManifests[0],
  appMetadataInfo: {
    appMetadata,
    appMetadataHash: 'SHA256Hash',
  },
  rootUrl: 'http://domain.one',
}
