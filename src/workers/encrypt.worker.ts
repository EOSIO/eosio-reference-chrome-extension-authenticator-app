import { encrypt } from 'workers/utils/encryption'

export interface EncryptMessage {
  decryptedValue: string
  passphrase: string
}

const worker: Worker = self as any

worker.addEventListener('message', (event) => {
  const request = event.data as EncryptMessage
  let response: any

  if (!request) { return }

  if (!instanceOfEncryptMessage(request)) {
    response = { error: 'Invalid message' }
  }

  try {
    response = encrypt(request.decryptedValue, request.passphrase)
  } catch (e) {
    response = { error: 'Unable to encrypt value' }
  }

  worker.postMessage(response)
})

const instanceOfEncryptMessage = (data: any): data is EncryptMessage => {
  return data
    && data.decryptedValue
    && data.passphrase
}

export default worker
