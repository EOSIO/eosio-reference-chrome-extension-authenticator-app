import { decrypt } from 'workers/utils/encryption'

export interface DecryptMessage {
  encryptedValue: string
  passphrase: string
}

const worker: Worker = self as any

worker.addEventListener('message', (event) => {
  const request = event.data as DecryptMessage
  let response: any

  if (!request) { return }

  if (!instanceOfDecryptMessage(request)) {
    response = { error: 'Invalid message' }
  }

  try {
    response = decrypt(request.encryptedValue, request.passphrase)
  } catch (e) {
    response = { error: 'Unable to decrypt value' }
  }

  worker.postMessage(response)
})

const instanceOfDecryptMessage = (data: any): data is DecryptMessage => {
  return data
    && data.encryptedValue
    && data.passphrase
}

export default worker
