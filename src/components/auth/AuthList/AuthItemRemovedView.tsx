import * as React from 'react'

import Auth from 'utils/Auth'

interface Props {
  auth: Auth
  onAuthRemoveUndo: (publicKey: string) => void
}

export const AuthItemRemovedView: React.SFC<Props> = ({ auth, onAuthRemoveUndo }) => {
  const onClick = () => onAuthRemoveUndo(auth.publicKey)

  return (
    <div className='auth-item-container'>
      <div className='auth-removed'>
        <span>{auth.nickname} deleted.</span>
        <a onClick={onClick}>Undo</a>
      </div>
    </div>
  )
}

AuthItemRemovedView.displayName = 'AuthItemRemovedView'

export default AuthItemRemovedView
