import * as React from 'react'
import { RicardianContract } from 'ricardian-template-toolkit'
import { Action } from 'eos/Transaction'
import './AccordionTab.css'

import AccordionTabHeader from 'components/transaction/ActionAccordion/AccordionTab/AccordionTabHeader'

interface Props {
  ricardianContract: RicardianContract
  action: Action
  isOpen: boolean
  toggleOpen: (actionId: string) => void
  disableToggle?: boolean
  isChecked: boolean
  toggleChecked: (actionId: string) => void
  id: string
  children: any
}

const AccordionTab: React.SFC<Props> = ({ children, ...headerProps }) => (
  <div className='accordion-tab'>
    <AccordionTabHeader {...headerProps} />
    {renderAccordionContent(headerProps.isOpen, children)}
  </div>
)

const renderAccordionContent = (isOpen: boolean, children: any) => (
  isOpen && (
    <div className='accordion-content'>
      {children}
    </div>
  )
)

AccordionTab.displayName = 'AccordionTab'

export default AccordionTab
