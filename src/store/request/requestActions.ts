import { AsyncAction, AsyncActionCreator, Dispatch } from 'store/storeHelpers'
import RequestStorage from 'utils/storage/RequestStorage'
import AppState from 'store/AppState'
import DappRequest from 'utils/requests/DappRequest'

const requestStorage = new RequestStorage()

export const REQUEST_MODIFY = {
  START: 'REQUEST_MODIFY_START',
  SUCCESS: 'REQUEST_MODIFY_SUCCESS',
  ERROR: 'REQUEST_MODIFY_ERROR',
}

export type RequestModifyAction = AsyncAction<{}, {
  request: DappRequest,
}, {
  error: Error,
}>

export const requestModifyAsync: AsyncActionCreator = {
  start: (): RequestModifyAction['start'] => ({
    type: REQUEST_MODIFY.START,
  }),

  success: (request: DappRequest): RequestModifyAction['success'] => ({
    type: REQUEST_MODIFY.SUCCESS,
    request,
  }),

  error: (error: Error): RequestModifyAction['error'] => ({
    type: REQUEST_MODIFY.ERROR,
    error,
  }),
}

export const requestFetch = () => async (dispatch: Dispatch, getState: () => AppState) => {
  // Check if the request has already been fetched from storage.
  let request = getState().request.data
  if (request) {
    dispatch(requestModifyAsync.success(request))
    return
  }

  dispatch(requestModifyAsync.start())
  try {
    request = await requestStorage.get()
    await requestStorage.clear()
    dispatch(requestModifyAsync.success(request))
  } catch (e) {
    dispatch(requestModifyAsync.error(e))
  }
}
