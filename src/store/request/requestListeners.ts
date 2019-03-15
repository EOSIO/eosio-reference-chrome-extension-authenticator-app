import BaseStorageListeners from 'store/baseStorageListeners'
import RequestStorage from 'utils/storage/RequestStorage'
import DappRequest from 'utils/requests/DappRequest'
import { requestModifyAsync } from 'store/request/requestActions'

export default class RequestListeners extends BaseStorageListeners<DappRequest> {
  constructor() {
    super(new RequestStorage())
  }

  protected getUpdateAction = (newChanges: Partial<DappRequest>, storeState: any) => {
    const request = {
      ...storeState.request.data,
      newRequest: newChanges.newRequest,
    }

    return (requestModifyAsync.success(request))
  }
}
