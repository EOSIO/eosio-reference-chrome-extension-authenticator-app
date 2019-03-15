import * as React from 'react'
import './Layout.css'

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>

const FormLayout: React.SFC<Props> = (props) => (
  <form {...props} className={`layout-container ${props.className || ''}`} />
)

FormLayout.displayName = 'FormLayout'

export default FormLayout
