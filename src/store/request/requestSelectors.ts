import AppState from 'store/AppState'
import { isAssertRequireAction, TransactionInfo } from 'eos/Transaction'

export const requestEnvelopeSelector = (state: AppState) => state.request.data.requestEnvelope
export const transactionInfoSelector = (state: AppState) => state.request.data.transactionInfo

export const transactionInfoWithoutRequireSelector = (state: AppState): TransactionInfo => {
  const transactionInfo = transactionInfoSelector(state)
  const actionsWithoutAssertRequire = transactionInfo.actions.filter((action) => !isAssertRequireAction(action))
  return { ...transactionInfo, actions: actionsWithoutAssertRequire }
}
