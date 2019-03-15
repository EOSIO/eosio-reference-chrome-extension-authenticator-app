import * as React from 'react'
import './Layout.css'

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const PageLayout: React.SFC<Props> = (props) => (
  <div {...props} className={`layout-container ${props.className || ''}`} />
)

PageLayout.displayName = 'PageLayout'

export default PageLayout
