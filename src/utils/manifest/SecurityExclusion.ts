import { SecurityExclusions } from 'eosjs-signature-provider-interface'

import { InsecureMode } from 'utils/insecureMode/InsecureMode'

export function shouldValidate(
  securityMeasure: keyof SecurityExclusions,
  securityExclusions: SecurityExclusions,
  insecureMode: InsecureMode,
  rootUrl: string,
) {
  const { enabled, whitelist } = insecureMode
  if (!enabled || !whitelist || !securityExclusions) {
    return true
  }
  const matchedIndex = whitelist.findIndex((domain) => {
    const domainURLObject = new URL(domain)
    const rootURLObject = new URL(rootUrl)
    return (rootURLObject.origin === domainURLObject.origin)
  })
  if (matchedIndex === -1) {
    return true
  }
  if (!securityExclusions[securityMeasure]) {
    return true
  }
  return false
}
