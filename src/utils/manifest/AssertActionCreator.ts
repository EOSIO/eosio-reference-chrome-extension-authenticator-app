import { sha256 } from 'hash.js'
import { Api as EosApi, JsonRpc, Serialize } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import {
  SignatureProviderRequestEnvelope,
  ChainManifest,
  hexToArray,
} from 'eosjs-signature-provider-interface'

import { TransactionInfo, Action, PermissionLevel } from 'eos/Transaction'
import getAssertAbiHex from 'contracts/eosio.assert.abi.hex'
import { DappInfo } from 'utils/manifest/DappInfo'
import { clone } from 'utils/helpers'
// tslint:disable-next-line:no-var-requires
const assertAbi = require('../../contracts/eosio.assert.abi.json')

export interface TransactionBundle {
  transactionInfo: TransactionInfo
  requestEnvelope: SignatureProviderRequestEnvelope
}

interface AssertActionParams {
  transactionBundle: TransactionBundle
  dappInfo: DappInfo
}

const ACCOUNT_NAME = 'eosio.assert'
const ACTION_NAME = 'require'

export default class AssertActionCreator {
  private api: EosApi

  constructor() {
    const rpc = new JsonRpc(null)
    const signatureProvider = new JsSignatureProvider([])
    this.api = new EosApi({
      rpc,
      signatureProvider,
      chainId: null,
    })

    this.api.transactionTypes = Serialize.getTypesFromAbi(Serialize.createInitialTypes(), assertAbi)
  }

  public transactionWithAssertAction(params: AssertActionParams): TransactionBundle {
    params = clone(params)
    const { transactionBundle: { transactionInfo, requestEnvelope } } = params
    const { chainHash, manifestHash, abiHashes } = this.generateHashes(params)
    const assertAction = this.generateAssertAction(chainHash, manifestHash, abiHashes, transactionInfo)

    transactionInfo.actions.push(assertAction)
    requestEnvelope.request.transactionSignature.abis.push({
      accountName: ACCOUNT_NAME,
      abi: getAssertAbiHex(),
    })

    return {
      transactionInfo,
      requestEnvelope,
    }
  }

  private generateAssertAction(
    chainHash: string,
    manifestHash: string,
    abiHashes: string[],
    transaction: TransactionInfo,
  ): Action {
    const { actions } = transaction
    const authorizations: PermissionLevel[] = this.generateUnionOfAuthorizations(actions)
    const updatedActions: any[] = this.formatActionsAsWhitelist(actions)

    const assertAction: Action = {
      account: ACCOUNT_NAME,
      name: ACTION_NAME,
      authorization: authorizations,
      data: {
        chain_params_hash: chainHash,
        manifest_id: manifestHash,
        actions: updatedActions,
        abi_hashes: abiHashes,
      },
    }

    return assertAction
  }

  private generateUnionOfAuthorizations(actions: Action[]) {
    const authorizations: PermissionLevel[] = []
    actions.forEach((action) =>
      action.authorization.forEach((authorization) => {
        if (!authorizations.some((auth) =>
            auth.actor === authorization.actor && auth.permission === authorization.permission)) {
          authorizations.push(authorization)
        }
      }),
    )

    return authorizations
  }

  private formatActionsAsWhitelist(actions: Action[]) {
    // format actions as { contract: string, action: string }
    return actions.map((action) =>
      ({ contract: action.account, action: action.name }),
    )
  }

  private generateHashes(params: AssertActionParams) {
    const { dappInfo: { chainManifest }, transactionBundle: { requestEnvelope, transactionInfo } } = params
    const chainHash = this.getChainHash(params)
    const manifestHash = this.getAppManifestHash(chainManifest)
    const abiHashes = this.getAbiHashes(transactionInfo, requestEnvelope)
    return { chainHash, manifestHash, abiHashes }
  }

  private getChainHash(params: AssertActionParams): string {
    const { dappInfo: { appMetadataInfo: { appMetadata } }, transactionBundle: { requestEnvelope } } = params
    const { chainId } = requestEnvelope.request.transactionSignature
    const chainInfo = appMetadata.chains.find((chain) => chain.chainId === chainId)
    const [, hash] = this.splitHashFromURL(chainInfo.icon)
    const chainInfoUp = {
      icon: hash,
      chain_id: chainInfo.chainId,
      chain_name: chainInfo.chainName,
    }

    const buffer = new Serialize.SerialBuffer({ textEncoder: new TextEncoder(), textDecoder: new TextDecoder() })
    const chainKey = 'setchain'
    this.api.serialize(buffer, chainKey, chainInfoUp)
    const serializedChainInfo = buffer.asUint8Array()

    const chainHash = sha256().update(serializedChainInfo).digest('hex')

    return chainHash
  }

  private getAppManifestHash(chainManifest: ChainManifest): string {
    const buffer = new Serialize.SerialBuffer({ textEncoder: new TextEncoder(), textDecoder: new TextDecoder() })
    const manifestTypeKey = 'add_manifest'
    this.api.serialize(buffer, manifestTypeKey, chainManifest.manifest)
    const serializedAppManifest = buffer.asUint8Array()

    const manifestHash = sha256().update(serializedAppManifest).digest('hex')

    return manifestHash
  }

  private getAbiHashes(transaction: TransactionInfo, requestEnvelope: SignatureProviderRequestEnvelope): string[] {
    const { abis } = requestEnvelope.request.transactionSignature

    const uniqueContracts: Action[] = []
    transaction.actions.forEach((action) => {
      if (!uniqueContracts.some((uniqueAction) => uniqueAction.account === action.account)) {
        uniqueContracts.push(action)
      }
    })

    const serializedAbis = uniqueContracts.map((action) => {
      return hexToArray(abis.find((abi) => abi.accountName === action.account).abi)
    })

    const abiHashes = serializedAbis.map((abi) => sha256().update(abi).digest('hex'))

    return abiHashes
  }

  private splitHashFromURL(urlWithHash: string) {
    return urlWithHash.split('#')
  }
}
