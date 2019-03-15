import * as React from 'react'
import './FooterView.css'

export const FooterView: React.SFC = ({ children }) => (
  <div className='footer-container'>
    {children}
  </div>
)

FooterView.displayName = 'FooterView'

export default FooterView
