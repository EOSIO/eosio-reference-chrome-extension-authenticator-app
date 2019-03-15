import * as React from 'react'
import './BodyView.css'

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const BodyView: React.SFC<Props> = (props) => (
  <div {...props} className={`body-container ${props.className || ''}`} />
)

BodyView.displayName = 'BodyView'

export default BodyView
