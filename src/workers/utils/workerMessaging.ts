interface WorkerError {
  error: string
}

export const postMessage = async <TMessage, TResponse extends any | WorkerError>(
  worker: Worker,
  message: TMessage,
): Promise<TResponse> => {
  return new Promise<TResponse>((resolve, reject) => {
    worker.postMessage(message)

    const onMessage = (event: MessageEvent) => {
      const response = event.data as TResponse

      worker.removeEventListener('message', onMessage)
      worker.terminate()

      if (instanceOfWorkerError(response)) {
        reject(new Error(response.error))
      } else {
        resolve(response)
      }
    }

    worker.addEventListener('message', onMessage)
  })
}

const instanceOfWorkerError = (response: any): response is WorkerError => {
  return response && response.error
}
