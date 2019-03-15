import BaseStorageListeners from 'store/baseStorageListeners'
import PassphraseHashStorage, { PassphraseHashSchema } from 'utils/storage/PassphraseHashStorage'
import { passphraseModifyAsync } from 'store/passphrase/passphraseActions'

export default class PassphraseListeners extends BaseStorageListeners<PassphraseHashSchema> {
  constructor() {
    super(new PassphraseHashStorage())
  }

  protected getUpdateAction = (newChanges: Partial<PassphraseHashSchema>, storeState: any) => {
    return (passphraseModifyAsync.success(newChanges.hash))
  }
}
