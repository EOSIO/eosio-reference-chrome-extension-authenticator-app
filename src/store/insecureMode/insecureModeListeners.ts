import BaseStorageListeners from 'store/baseStorageListeners'
import InsecureModeStorage from 'utils/storage/InsecureModeStorage'
import { InsecureMode } from 'utils/insecureMode/InsecureMode'
import { insecureModeModifyAsync } from 'store/insecureMode/insecureModeActions'

export default class InsecureModeListeners extends BaseStorageListeners<InsecureMode> {
  constructor() {
    super(new InsecureModeStorage())
  }

  protected getUpdateAction = (newChanges: Partial<InsecureMode>, storeState: any) => {
    const insecureMode = {
      ...storeState.insecureMode.data,
      ...newChanges,
    }

    return (insecureModeModifyAsync.success(insecureMode))
  }
}
