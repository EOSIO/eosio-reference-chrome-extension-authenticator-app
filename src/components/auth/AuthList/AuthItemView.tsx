import * as React from 'react'
import { Link } from 'react-router-dom'
import './AuthItemView.css'

import Auth from 'utils/Auth'
import RoutePath from 'constants/routePath'
import authIcon from 'assets/images/auth-icon.svg'
import moreInfoIcon from 'assets/images/chevron-right.svg'

interface Props {
  auth: Auth
}

export const AuthItemView: React.SFC<Props> = ({ auth }) => (
  <div className='auth-item-container'>
    <Link className='auth-item' to={`${RoutePath.AUTH_DETAILS}/${auth.publicKey}`}>
      <img className='auth-icon' src={authIcon} alt='auth-icon'/>
      <h3 className='auth-name'>{auth.nickname}</h3>
      <img className='auth-more-info' src={moreInfoIcon} />
    </Link>
  </div>
)

AuthItemView.displayName = 'AuthItemView'

export default AuthItemView
