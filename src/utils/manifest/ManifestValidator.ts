import { sha256 } from 'hash.js'
import {
  SecurityExclusions,
  SignatureProviderRequestEnvelope,
  instanceOfAppMetadata,
  instanceOfAppManifest,
  ChainInfo,
  ContractAction,
} from 'eosjs-signature-provider-interface'

import { TransactionInfo, Action } from 'eos/Transaction'
import { shouldValidate } from 'utils/manifest/SecurityExclusion'
import ManifestProvider from 'utils/manifest/ManifestProvider'
import AssertActionCreator, { TransactionBundle } from 'utils/manifest/AssertActionCreator'
import InsecureModeStorage from 'utils/storage/InsecureModeStorage'

export const ERROR_MESSAGES = {
  INVALID_APP_METADATA_SCHEMA: 'Application Metadata schema is not valid.',
  INVALID_CHAIN_MANIFEST_SCHEMA: 'Chain manifest does not have a valid Manifest Specification schema.',
  INVALID_DOMAIN_MATCH: 'Manifest domain does not match the request domain.',
  INVALID_ACTIONS: (actions: string) => `Actions '${actions}' not present in the whitelist.`,
  INVALID_FILE_URL: (urlName: string) => `Provided URL for ${urlName} is invalid.`,
  MISSING_FILE_HASH: (urlName: string) => `The ${urlName} file is missing its SHA256 hash.`,
  MISMATCHED_FILE_HASH: (urlName: string) => `The ${urlName} checksum hashes do not match.`,
  UNABLE_TO_FETCH: (fileURL: string, error: Error) => `Unable to fetch ${fileURL}: ${error.message}`,
}

export const FETCH_RESPONSE_ERROR = (response: Response) => new Error(`${response.status}: ${response.statusText}`)

export interface ManifestValidatorParams {
  manifestProvider: ManifestProvider
  securityExclusions?: SecurityExclusions
}

export default class ManifestValidator {
  private securityExclusions: SecurityExclusions
  private manifestProvider: ManifestProvider
  private insecureModeStorage: InsecureModeStorage
  private assertActionCreator: AssertActionCreator

  constructor({ manifestProvider, securityExclusions }: ManifestValidatorParams) {
    this.manifestProvider = manifestProvider
    this.securityExclusions = securityExclusions
    this.insecureModeStorage = new InsecureModeStorage()
    this.assertActionCreator = new AssertActionCreator()
  }

  public async validateAppMetadata(): Promise<void> {
    const { appMetadata } = await this.manifestProvider.getAppMetadataInfo()
    const insecureMode = await this.insecureModeStorage.get()

    if (shouldValidate('appMetadataIntegrity', this.securityExclusions, insecureMode, this.rootUrl)
    && !instanceOfAppMetadata(appMetadata)) {
      throw new Error(ERROR_MESSAGES.INVALID_APP_METADATA_SCHEMA)
    }

    if (shouldValidate('iconIntegrity', this.securityExclusions, insecureMode, this.rootUrl)) {
      await this.validateFileHash('icon', appMetadata.icon)
      await this.validateChainIcons(appMetadata.chains)
    }
  }

  public async validateAppManifest(chainId: string): Promise<void> {
    const appManifest = await this.manifestProvider.getAppManifest()
    const chainManifest = await this.manifestProvider.getChainManifest(chainId)
    const { appMetadataHash } = await this.manifestProvider.getAppMetadataInfo(chainId)
    const insecureMode = await this.insecureModeStorage.get()

    if (shouldValidate('appMetadataIntegrity', this.securityExclusions, insecureMode, this.rootUrl)
    && !instanceOfAppManifest(appManifest)) {
      throw new Error(ERROR_MESSAGES.INVALID_CHAIN_MANIFEST_SCHEMA)
    }

    if (shouldValidate('appMetadataIntegrity', this.securityExclusions, insecureMode, this.rootUrl)) {
      const { appmeta } = chainManifest.manifest
      await this.validateFileHash('appmeta', appmeta, appMetadataHash)
    }

    if (shouldValidate('domainMatch', this.securityExclusions, insecureMode, this.rootUrl)) {
      this.validateDomainMatch(chainManifest.manifest.domain, this.rootUrl)
    }
  }

  public async validateTransaction(transactionInfo: TransactionInfo, chainId: string): Promise<void> {
    const { manifest } = await this.manifestProvider.getChainManifest(chainId)
    const insecureMode = await this.insecureModeStorage.get()

    if (shouldValidate('whitelistedActions', this.securityExclusions, insecureMode, this.rootUrl)) {
      this.validateWhitelistedActions(manifest.whitelist, transactionInfo.actions)
    }
  }

  public async transactionWithAssertAction(
    transactionInfo: TransactionInfo,
    chainId: string,
    requestEnvelope: SignatureProviderRequestEnvelope,
  ): Promise<TransactionBundle> {
    const dappInfo = await this.manifestProvider.getDappInfo(chainId)
    const insecureMode = await this.insecureModeStorage.get()

    if (shouldValidate('addAssertToTransactions', this.securityExclusions, insecureMode, this.rootUrl)) {
      return this.assertActionCreator.transactionWithAssertAction({
        transactionBundle: {
          transactionInfo,
          requestEnvelope,
        },
        dappInfo,
      })
    }

    return {
      transactionInfo,
      requestEnvelope,
    }
  }

  private async validateChainIcons(chains: ChainInfo[]) {
    for (const chain of chains) {
      await this.validateFileHash(`${chain.chainName} icon`, chain.icon)
    }
  }

  private validateWhitelistedActions(whitelist: ContractAction[], actions: Action[]) {
    const invalidActions = actions.filter((action) => (
      !whitelist.some((whitelistedAction) => (
        (whitelistedAction.action === action.name || whitelistedAction.action === '')
        && (whitelistedAction.contract === action.account || whitelistedAction.contract === '')
      ))
    ))

    if (invalidActions.length > 0) {
      const formattedActions = invalidActions.map((action) => `${action.account}::${action.name}`).join(', ')
      throw new Error(ERROR_MESSAGES.INVALID_ACTIONS(formattedActions))
    }
  }

  private async validateFileHash(displayName: string, urlWithHash: string, fileHash?: any) {
    let url
    try {
      url = new URL(urlWithHash)
    } catch (err) {
      throw new Error(ERROR_MESSAGES.INVALID_FILE_URL(displayName))
    }

    if (!url.hash || url.hash === '') {
      throw new Error(ERROR_MESSAGES.MISSING_FILE_HASH(displayName))
    }

    const [urlWithoutHash, hash] = this.splitHashFromURL(url)
    const actualFileHash = fileHash ? fileHash : await this.fileToHash(urlWithoutHash)
    if (actualFileHash !== hash) {
      throw new Error(ERROR_MESSAGES.MISMATCHED_FILE_HASH(displayName))
    }
  }

  private validateDomainMatch(manifestDomain: string, requestDomain: string) {
    const manifestDomainURL = new URL(manifestDomain)
    const requestDomainURL = new URL(requestDomain)
    if (manifestDomainURL.origin !== requestDomainURL.origin) {
      throw new Error(ERROR_MESSAGES.INVALID_DOMAIN_MATCH)
    }
  }

  private splitHashFromURL(urlWithHash: URL) {
    return urlWithHash.toString().split('#')
  }

  private async fileToHash(fileURL: string): Promise<string> {
    const response = await this.fetchFile(fileURL)
    const blob = await response.blob()
    return this.blobToHash(blob)
  }

  private async fetchFile(fileURL: string): Promise<Response> {
    try {
      const response = await fetch(fileURL)
      if (!response.ok) {
        throw FETCH_RESPONSE_ERROR(response)
      }
      return response
    } catch (error) {
      throw new Error(ERROR_MESSAGES.UNABLE_TO_FETCH(fileURL, error))
    }
  }

  // TODO: Copied in Manifest Provider. Need to move both somewhere else...
  private async blobToHash(blob: Blob) {
    const binaryString = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsBinaryString(blob)
    })
    return sha256().update(binaryString).digest('hex')
  }

  private get rootUrl(): string {
    return this.manifestProvider.rootUrl
  }
}
