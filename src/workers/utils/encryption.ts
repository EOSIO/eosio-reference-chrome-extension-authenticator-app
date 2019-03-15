import * as bip38 from 'bip38'
import * as wif from 'wif'

const progressCallback: () => {} = undefined
const scryptParams = { N: 512, r: 8, p: 8 }

export const encrypt = (decryptedValue: string, passphrase: string): string => {
  const decoded = wif.decode(decryptedValue)

  return bip38.encrypt(
    decoded.privateKey,
    decoded.compressed,
    passphrase,
    progressCallback,
    scryptParams,
  )
}

export const decrypt = (encryptedValue: string, passphrase: string): string => {
  const decryptedKey = bip38.decrypt(
    encryptedValue,
    passphrase,
    progressCallback,
    scryptParams,
  )

  return wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed)
}

export const reEncrypt = (encryptedValue: string, currentPassphrase: string, newPassphrase: string): string => {
  return encrypt(decrypt(encryptedValue, currentPassphrase), newPassphrase)
}
