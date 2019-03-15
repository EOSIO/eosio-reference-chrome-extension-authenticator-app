import { sha256 } from 'hash.js'
import { ChainManifest, AppMetadata } from '@blockone/eosjs-signature-provider-interface'

import { AppMetadataInfo, DappInfo } from 'utils/manifest/DappInfo'

const CHAIN_MANIFESTS_FILENAME = 'chain-manifests.json'

export default class ManifestProvider {
  public readonly declaredDomain: string
  private chainManifests: ChainManifest[]
  private appMetadataInfoMap: {
    [chainId: string]: AppMetadataInfo,
  }

  constructor(declaredDomain: string) {
    this.declaredDomain = declaredDomain
    this.appMetadataInfoMap = {}
  }

  /**
   * @description Lazy loads and caches Chain Manifest.
   */
  public async getChainManifest(chainId: string): Promise<ChainManifest> {
    const chainManifests = await this.getChainManifests()
    return chainManifests.find((manifest) => manifest.chainId === chainId)
  }

  /**
   * @description Lazy loads and caches Chain Manifests.
   */
  public async getChainManifests(): Promise<ChainManifest[]> {
    if (!this.chainManifests) {
      this.chainManifests = await this.fetchChainManifests()
    }
    return this.chainManifests
  }

  /**
   * @param {string} [chainId=<First chainManifest's chainId>]
   * @description Lazy loads and caches App Metadata Info.
   * Get's the App Metadata from the first chain manifest if no chainId is provided.
   */
  public async getAppMetadataInfo(chainId?: string): Promise<AppMetadataInfo> {
    if (!chainId) {
      const chainManifests = await this.getChainManifests()

      if (!chainManifests.length) {
        throw new Error(`No chain manifests found in ${CHAIN_MANIFESTS_FILENAME}`)
      }

      chainId = chainManifests[0].chainId
    }

    if (!this.appMetadataInfoMap[chainId]) {
      this.appMetadataInfoMap[chainId] = await this.fetchAppMetadataInfo(chainId)
    }
    return this.appMetadataInfoMap[chainId]
  }

  public async getDappInfo(chainId: string): Promise<DappInfo> {
    const appMetadataInfo = await this.getAppMetadataInfo(chainId)
    const chainManifest = await this.getChainManifest(chainId)
    return {
      appMetadataInfo,
      chainManifest,
      rootUrl: this.rootUrl,
    }
  }

  private async fetchAppMetadataInfo(chainId: string): Promise<AppMetadataInfo> {
    const { manifest: { appmeta } } = await this.getChainManifest(chainId)
    const appMetadataURL = new URL(appmeta)
    const response = await fetch(appMetadataURL.toString(), this.fetchRequestInit)

    if (!response.ok) {
      throw new Error(`Not able to retrieve the app metadata for chainId: ${chainId}.`)
    }

    // clone response since you can't read the response twice - response.json() and response.blob()
    const responseClone = response.clone()
    const appMetadataHash = await this.blobToHash(await responseClone.blob())
    const appMetadata = await response.json() as AppMetadata
    return {
      appMetadata: this.appMetadataWithAbsoluteUrls(appMetadata),
      appMetadataHash,
    }
  }

  private async fetchChainManifests(): Promise<ChainManifest[]> {
    const appManifestUrl = new URL(CHAIN_MANIFESTS_FILENAME, this.rootUrl)
    const response = await fetch(appManifestUrl.toString(), this.fetchRequestInit)
    if (response.ok) {
      return await response.json() as ChainManifest[]
    } else {
      throw new Error(`Not able to retrive the ${CHAIN_MANIFESTS_FILENAME} at the application root`)
    }
  }

  private appMetadataWithAbsoluteUrls(appMetadata: AppMetadata): AppMetadata {
    const icon = this.getAbsoluteUrl(appMetadata.icon)
    const chains = appMetadata.chains.map((chain) => {
      return { ...chain, icon: this.getAbsoluteUrl(chain.icon) }
    })
    return {
      ...appMetadata,
      icon,
      chains,
    }
  }

  // TODO: Copied in Manifest Validator. Need to move both somewhere else...
  private async blobToHash(blob: Blob): Promise<string> {
    const binaryString = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsBinaryString(blob)
    })
    return sha256().update(binaryString).digest('hex')
  }

  private getAbsoluteUrl(url: string): string {
    const fetchURL = new URL(url, this.rootUrl)
    return fetchURL.toString()
  }

  public get rootUrl(): string {
    const urlObject = new URL(this.declaredDomain)
    return urlObject.origin
  }

  private get fetchRequestInit(): RequestInit {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  }
}
