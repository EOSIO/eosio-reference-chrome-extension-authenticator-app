import BaseStorageListeners from 'store/baseStorageListeners'
import AuthStorage, { AuthSchema } from 'utils/storage/AuthStorage'
import { authsModifyAsync } from 'store/auths/authsActions'

export default class AuthsListeners extends BaseStorageListeners<AuthSchema> {
  constructor() {
    super(new AuthStorage())
  }

  protected getUpdateAction = (newChanges: Partial<AuthSchema>, storeState: any) => {
    const newAuths = [...newChanges.auths]

    return (authsModifyAsync.success(newAuths))
  }
}
