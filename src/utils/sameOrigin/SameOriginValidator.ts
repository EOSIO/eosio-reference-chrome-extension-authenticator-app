import {
  SignatureProviderRequestEnvelope,
  Manifest,
  SecurityExclusions,
} from 'eosjs-signature-provider-interface'

import ManifestProvider from 'utils/manifest/ManifestProvider'
import { shouldValidate } from 'utils/manifest/SecurityExclusion'
import InsecureModeStorage from 'utils/storage/InsecureModeStorage'

export const ERROR_MESSAGES = {
  NO_DECLARED_DOMAIN: 'No declared domain provided in request envelope.',
  INVALID_DECLARED_DOMAIN: (senderUrl: string, declaredDomain: string) => (
    `Declared domain (${declaredDomain}) is not the same host as the sender URL (${senderUrl}).`
  ),
  INVALID_RETURN_URL: (returnUrl: string, declaredDomain: string) => (
    `Return URL (${returnUrl}) is not a path of the declared domain (${declaredDomain}).`
  ),
  INVALID_CALLBACK_URL: (returnUrl: string, declaredDomain: string) => (
    `Callback URL (${returnUrl}) is not a path of the declared domain (${declaredDomain}).`
  ),
  MISMATCHED_APP_MANIFEST_DOMAINS: 'One or more manifest domains do not match the declared domain.',
  MISMATCHED_APPMETA_HASHES: 'Appmeta hashes do not all match each other.',
}

export interface SameOriginValidatorParams {
  manifestProvider: ManifestProvider
  securityExclusions?: SecurityExclusions
}

export default class SameOriginValidator {
  private securityExclusions: SecurityExclusions
  private manifestProvider: ManifestProvider
  private insecureModeStorage: InsecureModeStorage

  constructor({ manifestProvider, securityExclusions }: SameOriginValidatorParams) {
    this.manifestProvider = manifestProvider
    this.securityExclusions = securityExclusions
    this.insecureModeStorage = new InsecureModeStorage()
  }

  public async validateSameOriginPolicy(
    requestEnvelope: SignatureProviderRequestEnvelope,
    senderUrl: string,
  ): Promise<void> {
    const insecureMode = await this.insecureModeStorage.get()
    if (!shouldValidate('domainMatch', this.securityExclusions, insecureMode, this.rootUrl)) { return }

    await this.validateUrlPaths(requestEnvelope, senderUrl)
    await this.validateManifestDomains(requestEnvelope.declaredDomain)
    await this.validateAppmetaHashes()
  }

  private async validateUrlPaths(requestEnvelope: SignatureProviderRequestEnvelope, senderUrl: string): Promise<void> {
    const { declaredDomain, callbackUrl, returnUrl } = requestEnvelope

    if (!declaredDomain.length) {
      throw new Error(ERROR_MESSAGES.NO_DECLARED_DOMAIN)
    }

    if (!this.isSameHost(senderUrl, declaredDomain)) {
      throw new Error(ERROR_MESSAGES.INVALID_DECLARED_DOMAIN(senderUrl, declaredDomain))
    }

    if (returnUrl && returnUrl.length && !this.isSameHost(returnUrl, declaredDomain)) {
      throw new Error(ERROR_MESSAGES.INVALID_RETURN_URL(returnUrl, declaredDomain))
    }

    if (callbackUrl && callbackUrl.length && !this.isSameHost(callbackUrl, declaredDomain)) {
      throw new Error(ERROR_MESSAGES.INVALID_CALLBACK_URL(callbackUrl, declaredDomain))
    }
  }

  private async validateManifestDomains(declaredDomain: string): Promise<void> {
    const appManifest = await this.manifestProvider.getAppManifest()
    const chainManifests = appManifest.manifests.map((chainManifest) => chainManifest.manifest)

    const urlsMatch = chainManifests.every((manifest: Manifest) => {
      const manifestDomainUrl = new URL(manifest.domain)
      const declaredDomainUrl = new URL(declaredDomain)
      return manifestDomainUrl.origin === declaredDomainUrl.origin
    })

    if (!urlsMatch) {
      throw new Error(ERROR_MESSAGES.MISMATCHED_APP_MANIFEST_DOMAINS)
    }
  }

  private async validateAppmetaHashes(): Promise<void> {
    const appManifest = await this.manifestProvider.getAppManifest()
    const appmetaHashes = appManifest.manifests.map((chainManifest) => {
      return chainManifest.manifest.appmeta.split('#')[1]
    })

    if (!appmetaHashes.every((appmetaHash: string, index: number) => {
      return index === 0 ? true : appmetaHash === appmetaHashes[index - 1]
    })) {
      throw new Error(ERROR_MESSAGES.MISMATCHED_APPMETA_HASHES)
    }
  }

  private isSameHost(url1: string, url2: string): boolean {
    return new URL(url1).hostname === new URL(url2).hostname
  }

  private get rootUrl(): string {
    return this.manifestProvider.rootUrl
  }
}
