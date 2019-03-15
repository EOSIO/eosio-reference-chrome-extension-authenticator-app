import { reEncrypt } from 'workers/utils/encryption'
import Auth from 'utils/Auth'

export interface ReEncryptAuthsMessage {
  auths: Auth[]
  currentPassphrase: string
  newPassphrase: string
}

const worker: Worker = self as any

worker.addEventListener('message', (event) => {
  const request = event.data as ReEncryptAuthsMessage
  let response: any

  if (!request) { return }

  if (!instanceOfReEncryptAuthsMessage(request)) {
    response = { error: 'Invalid message' }
  }

  try {
    response = reEncryptAuths(request)
  } catch (e) {
    response = { error: 'Unable to re-encrypt auths' }
  }

  worker.postMessage(response)
})

const reEncryptAuths = ({
  auths,
  currentPassphrase,
  newPassphrase,
}: ReEncryptAuthsMessage): Auth[] => {
  return auths.map((auth) => ({
    ...auth,
    encryptedPrivateKey: reEncrypt(auth.encryptedPrivateKey, currentPassphrase, newPassphrase),
  }))
}

const instanceOfReEncryptAuthsMessage = (data: any): data is ReEncryptAuthsMessage => {
  return data
    && data.auths
    && data.currentPassphrase
    && data.newPassphrase
}

export default worker
