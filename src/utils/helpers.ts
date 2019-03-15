import * as bs58 from 'bs58'
import * as RIPEMD160 from 'ripemd160'

export const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T

export const convertToLegacyPubKey = (publicKey: string): string => {
  const K1_PREFIX = 'PUB_K1_'
  const LEGACY_PREFIX = 'EOS'

  if (publicKey.substr(0, K1_PREFIX.length) !== K1_PREFIX) {
    return publicKey
  }

  const nonPrefixPublicKey = publicKey.substr(K1_PREFIX.length)
  const bytesWithChecksum = bs58.decode(nonPrefixPublicKey)
  const bytes = bytesWithChecksum.slice(0, bytesWithChecksum.length - 4)
  const suffixBytes = Buffer.from(new RIPEMD160().update(bytes).digest()).slice(0, 4)
  const binaryPublicKey = Buffer.from([...bytes, ...suffixBytes])
  return `${LEGACY_PREFIX}${bs58.encode(binaryPublicKey)}`
}
