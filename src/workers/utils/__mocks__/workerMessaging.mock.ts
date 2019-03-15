import * as workerMessaging from 'workers/utils/workerMessaging'

export const postMessage = jest.spyOn(workerMessaging, 'postMessage')
