import Auth from 'utils/Auth'
import EncryptWorker, { EncryptMessage } from 'workers/EncryptWorker'
import DecryptWorker, { DecryptMessage } from 'workers/DecryptWorker'
import ReEncryptWorker, { ReEncryptAuthsMessage } from 'workers/ReEncryptWorker'
import { postMessage } from 'workers/utils/workerMessaging'

export const encrypt = async (decryptedValue: string, passphrase: string): Promise<string> => {
  const worker = new EncryptWorker()

  const message: EncryptMessage = {
    decryptedValue,
    passphrase,
  }

  return postMessage<EncryptMessage, string>(worker, message)
}

export const decrypt = async (encryptedValue: string, passphrase: string): Promise<string> => {
  const worker = new DecryptWorker()

  const message: DecryptMessage = {
    encryptedValue,
    passphrase,
  }

  return postMessage<DecryptMessage, string>(worker, message)
}

export const reEncryptAuths = async (
  auths: Auth[],
  currentPassphrase: string,
  newPassphrase: string,
): Promise<Auth[]> => {
  const worker = new ReEncryptWorker()

  const message: ReEncryptAuthsMessage = {
    auths,
    currentPassphrase,
    newPassphrase,
  }

  return postMessage<ReEncryptAuthsMessage, Auth[]>(worker, message)
}
