import * as React from 'react'

import { PassphraseRequirements } from 'utils/passphrase/PassphraseValidator'
import UpdatePassphraseForm, {
  UpdatePassphraseFormInputs,
} from 'components/passphrase/updatePassphrase/UpdatePassphraseForm'

interface Props {
  currentPassphrase: string
  newPassphrase: string
  confirmPassphrase: string
  onFormSubmit: () => Promise<boolean>
  onFormInputChange: (formInputs: Partial<UpdatePassphraseFormInputs>) => void
  resetForm: () => void
  passphraseRequirements: PassphraseRequirements
  error: string
}

export const UpdatePassphraseView: React.SFC<Props> = ({
  currentPassphrase,
  newPassphrase,
  confirmPassphrase,
  onFormSubmit,
  passphraseRequirements,
  onFormInputChange,
  resetForm,
  error,
}) => (
    <React.Fragment>
      <h2 className='update-passphrase-title'>Update Passphrase</h2>
      <UpdatePassphraseForm
        currentPassphrase={currentPassphrase}
        newPassphrase={newPassphrase}
        confirmPassphrase={confirmPassphrase}
        onFormSubmit={onFormSubmit}
        onFormInputChange={onFormInputChange}
        resetForm={resetForm}
        passphraseRequirements={passphraseRequirements}
        error={error}
      />
    </React.Fragment >
  )

UpdatePassphraseView.displayName = 'UpdatePassphraseView'

export default UpdatePassphraseView
