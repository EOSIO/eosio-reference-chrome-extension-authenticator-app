import {
  SignatureProviderRequestEnvelope,
  SignatureProviderResponseEnvelope,
  SelectiveDisclosureType,
  SecurityExclusions,
  HexAbi,
  Transaction as SignedTransaction,
} from 'eosjs-signature-provider-interface'

import {
  SignatureProviderRequestWithInstallationCheck,
  SignatureProviderRequestEnvelopeWithInstallationCheck,
  SignatureProviderResponseEnvelopeWithInstallationCheck,
} from 'utils/requests/installationCheckRequestHelpers'
import { TransactionInfo, Action } from 'eos/Transaction'

export const actions: Action[] = [
  {
    account: 'account.one',
    name: 'action1',
    authorization: [
      {
        actor: 'actor1',
        permission: 'active',
      },
    ],
    data: {
      from: 'actor1',
      to: 'actor2',
      quantity: '1.0000 EOS',
      memo: 'Memo 1',
    },
  },
  {
    account: 'account.one',
    name: 'action2',
    authorization: [
      {
        actor: 'actor1',
        permission: 'active',
      },
    ],
    data: {
      from: 'actor1',
      to: 'actor2',
      quantity: '2.0000 EOS',
      memo: 'Memo 2',
    },
  },
]

export const requireAction: Action = {
  account: 'eosio.assert',
  name: 'require',
  authorization: [
    {
      actor: 'thegazelle',
      permission: 'active',
    },
  ],
  data: {},
}

export const transactionWithSingleAction: TransactionInfo = {
  actions: [actions[0]],
}

export const transactionWithSingleActionAndAssertRequire: TransactionInfo = {
  actions: [actions[0], requireAction],
}

export const transactionWithMultipleActions: TransactionInfo = {
  actions,
}

export const transactionWithMultipleActionsAndAssertRequire: TransactionInfo = {
  actions: [...actions, requireAction],
}

export const abis = [{
  abi: {
    actions: [{
      name: 'action1',
    },
      {
        name: 'action2',
      }],
  },
  account_name: 'account.one',
}]

export const hexAbis: HexAbi[] = [{
  abi: 'hex',
  accountName: 'account.one',
}, {
  abi: 'hex2',
  accountName: 'account.one',
}]

export const packedTransactionHex = 'hex'

export const signedTransaction: SignedTransaction = {
  signatures: [
    'SIG_K1_ThisIsATestSignature',
  ],
  packedTrx: '',
  compression: 0,
  packedContextFreeData: '',
}

export const securityExclusions: SecurityExclusions = {
  addAssertToTransactions: false,
  appMetadataIntegrity: false,
  domainMatch: false,
  whitelistedActions: false,
  iconIntegrity: false,
  relaxedContractParsing: false,
}

export const transactionSignatureRequest: SignatureProviderRequestEnvelope = {
  version: 'version',
  id: 'requestId',
  declaredDomain: 'http://domain.one',
  returnUrl: '',
  securityExclusions,
  request: {
    transactionSignature: {
      chainId: 'chainId1',
      abis: [{
        abi: 'hex',
        accountName: 'account.one',
      }, {
        abi: 'hex2',
        accountName: 'account.one',
      }],
      publicKeys: [
        'publicKey1',
        'publicKey2',
      ],
      transaction: {
        signatures: [],
        compression: 0,
        packedContextFreeData: '',
        packedTrx: '',
      },
    },
  },
}

export const transactionSignatureResponse: SignatureProviderResponseEnvelope = {
  id: 'requestId',
  response: {
    transactionSignature: {
      signedTransaction: {
        signatures: [],
        compression: 0,
        packedContextFreeData: '',
        packedTrx: '',
      },
    },
  },
}

export const selectiveDisclosureRequest: SignatureProviderRequestEnvelope = {
  version: 'version',
  id: 'requestId',
  declaredDomain: '',
  returnUrl: '',
  securityExclusions,
  request: {
    selectiveDisclosure: {
      disclosures: [{
        type: SelectiveDisclosureType.AUTHORIZERS,
      }],
    },
  },
}

export const installationCheckRequest: SignatureProviderRequestEnvelopeWithInstallationCheck = {
  version: 'version',
  id: 'requestId',
  declaredDomain: '',
  returnUrl: '',
  securityExclusions,
  request: {
    installationCheck: {},
  } as SignatureProviderRequestWithInstallationCheck,
}

export const installationCheckResponse: SignatureProviderResponseEnvelopeWithInstallationCheck = {
  id: 'requestId',
  deviceKey: '',
  response: {
    installationCheck: {},
  } as SignatureProviderRequestWithInstallationCheck,
}

export const invalidRequest = {
  id: 'requestId',
  declaredDomain: '',
  returnUrl: '',
  securityExclusions,
  request: {
  },
}
