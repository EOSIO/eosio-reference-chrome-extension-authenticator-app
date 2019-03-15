import { Dispatch } from 'redux'

import InsecureModeStorage from 'utils/storage/InsecureModeStorage'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'
import { AsyncAction, AsyncActionCreator } from 'store/storeHelpers'
import AppState from 'store/AppState'

const insecureModeStorage = new InsecureModeStorage()

export const INSECURE_MODE_MODIFY = {
  START: 'INSECURE_MODE_MODIFY_START',
  SUCCESS: 'INSECURE_MODE_MODIFY_SUCCESS',
  ERROR: 'INSECURE_MODE_MODIFY_ERROR',
}

export type InsecureModeModifyAction = AsyncAction<{}, {
  insecureMode: InsecureMode,
}, {
  error: Error,
}>

export const insecureModeModifyAsync: AsyncActionCreator = {
  start: (): InsecureModeModifyAction['start'] => ({
    type: INSECURE_MODE_MODIFY.START,
  }),

  success: (insecureMode: InsecureMode): InsecureModeModifyAction['success'] => ({
    type: INSECURE_MODE_MODIFY.SUCCESS,
    insecureMode,
  }),

  error: (error: Error): InsecureModeModifyAction['error'] => ({
    type: INSECURE_MODE_MODIFY.ERROR,
    error,
  }),
}

export const insecureModeFetch = () => async (dispatch: Dispatch) => {
  dispatch(insecureModeModifyAsync.start())
  try {
    const insecureMode = await insecureModeStorage.get()
    dispatch(insecureModeModifyAsync.success(insecureMode))
  } catch (e) {
    dispatch(insecureModeModifyAsync.error(e))
  }
}

export const insecureModeEnabled = (enable: boolean) => async (dispatch: Dispatch, getState: () => AppState) => {
  dispatch(insecureModeModifyAsync.start())
  try {
    const insecureMode = getState().insecureMode.data
    insecureMode.enabled = enable
    await insecureModeStorage.set(insecureMode)
    dispatch(insecureModeModifyAsync.success(insecureMode))
  } catch (e) {
    dispatch(insecureModeModifyAsync.error(e))
  }
}

export const insecureModeWhitelistAdd = (url: string) => async (dispatch: Dispatch, getState: () => AppState) => {
  dispatch(insecureModeModifyAsync.start())
  try {
    const insecureMode = getState().insecureMode.data
    const whitelist = insecureMode.whitelist || []
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL: no protocol specified')
    }

    const { origin } = new URL(url)
    if (whitelist.findIndex((domain) => domain === origin) !== -1) {
      throw new Error('URL already exists in whitelist')
    }

    insecureMode.whitelist = [ ...whitelist, origin ]
    await insecureModeStorage.set(insecureMode)
    dispatch(insecureModeModifyAsync.success(insecureMode))
  } catch (e) {
    dispatch(insecureModeModifyAsync.error(e))
  }
}

export const insecureModeWhitelistDelete = (url: string) => async (dispatch: Dispatch, getState: () => AppState) => {
  dispatch(insecureModeModifyAsync.start())
  try {
    const insecureMode = getState().insecureMode.data
    const whitelist = insecureMode.whitelist || []
    insecureMode.whitelist = whitelist.filter((whitelistedUrl: string) => whitelistedUrl !== url)
    await insecureModeStorage.set(insecureMode)
    dispatch(insecureModeModifyAsync.success(insecureMode))
  } catch (e) {
    dispatch(insecureModeModifyAsync.error(e))
  }
}
