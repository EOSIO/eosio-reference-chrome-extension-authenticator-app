import * as React from 'react'
import { RicardianContract } from 'ricardian-template-toolkit'
import { Action } from 'eos/Transaction'
import './AccordionTabHeader.css'

import Checkbox from 'components/shared/Checkbox'
import caretImage from 'assets/images/caret.svg'

interface Props {
  ricardianContract: RicardianContract
  action: Action
  isOpen: boolean
  toggleOpen: (actionId: string) => void
  disableToggle?: boolean
  isChecked: boolean
  toggleChecked: (actionId: string) => void
  id: string
}

const AccordionTabHeader: React.SFC<Props> = ({
  ricardianContract,
  action,
  isOpen,
  toggleOpen,
  isChecked,
  toggleChecked,
  disableToggle,
  id,
}) => (
  <React.Fragment>
    <input
      className='accordion-content-toggle'
      id={id}
      type='checkbox'
      checked={isOpen}
      onChange={() => toggleAccordion(disableToggle, id, toggleOpen)}
    />

    <label htmlFor={id} className='accordion-header'>
      <div className='accordion-header-icon-container'>
        {renderCheckbox(disableToggle, isChecked, id, toggleChecked)}
        <img className='accordion-header-icon' src={ricardianContract.getMetadata().icon} />
      </div>

      <h2 className='accordion-header-title'>{ricardianContract.getMetadata().title}</h2>
      <span className='accordion-header-account'>{action.account}</span>

      <div className='accordion-header-summary'>
        {ricardianContract.getMetadata().summary}
      </div>

      {renderCaretImage(disableToggle, isOpen)}
    </label>
  </React.Fragment>
)

const renderCheckbox = (
  disableToggle: boolean,
  isChecked: boolean,
  id: string,
  toggleChecked: (actionId: string) => void,
) => {
  if (disableToggle) {
    return null
  }

  return (
    <Checkbox
      id={`checkbox-${id}`}
      checked={isChecked}
      onChange={() => toggleChecked(id)}
    />
  )
}

const renderCaretImage = (disableToggle: boolean, isOpen: boolean) => {
  if (disableToggle) {
    return null
  }

  return <img src={caretImage} className={`accordion-chevron ${isOpen && 'is-open'}`} alt='' />
}

const toggleAccordion = (disableToggleOpen: boolean, id: string, toggleOpen: (id: string) => void) => {
  if (!disableToggleOpen) {
    toggleOpen(id)
  }
}

AccordionTabHeader.displayName = 'AccordionTabHeader'

export default AccordionTabHeader
