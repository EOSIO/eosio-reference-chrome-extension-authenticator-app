import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import AccordionTabHeader from './AccordionTabHeader'
import Checkbox from 'components/shared/Checkbox'

describe('AccordionTabHeader', () => {
  let accordionTabHeader: ShallowWrapper
  let tabId: string
  let ricardianContract: any
  let action: any
  let toggleChecked: (actionId: string) => void
  let toggleOpen: (actionId: string) => void

  beforeEach(() => {
    tabId = 'accordion-test'
    action = {
      account: 'testeostoken',
      name: 'transfer',
      authorization: [
        {
          actor: 'thegazelle',
          permission: 'active',
        },
      ],
      data: {
        from: 'thegazelle',
        to: 'remasteryoda',
        quantity: '1.0000 EOS',
        memo: 'For the future of chains around the world',
      },
    }
    ricardianContract = {
      getHtml: jest.fn().mockReturnValue('HTML'),
      getMetadata: jest.fn().mockReturnValue({
        title: 'Title',
        summary: 'Summary',
        icon: 'Icon',
      }),
    }
    toggleChecked = jest.fn()
    toggleOpen = jest.fn()
  })

  describe('rendering', () => {
    describe('when toggling is enabled', () => {
      beforeEach(() => {
        accordionTabHeader = shallow(
          <AccordionTabHeader
            id={tabId}
            ricardianContract={ricardianContract}
            action={action}
            isOpen
            toggleOpen={toggleOpen}
            isChecked={false}
            toggleChecked={toggleChecked}
          />,
        )
      })

      describe('clicking on the tab label', () => {
        it('calls the toggleOpen function with tabId', () => {
          accordionTabHeader.find('.accordion-content-toggle').simulate('change')
          expect(toggleOpen).toHaveBeenCalledWith(tabId)
        })
      })

      describe('clicking on the checkbox', () => {
        it('calls the toggleChecked function with tabId', () => {
          accordionTabHeader.find('#checkbox-accordion-test').simulate('change')
          expect(toggleChecked).toHaveBeenCalledWith(tabId)
        })
      })
    })

    describe('when toggling is disabled', () => {
      beforeEach(() => {
        accordionTabHeader = shallow(
          <AccordionTabHeader
            id={tabId}
            ricardianContract={ricardianContract}
            action={action}
            disableToggle
            isOpen
            toggleOpen={toggleOpen}
            isChecked
            toggleChecked={toggleChecked}
          />,
        )
      })

      describe('clicking on the tab label', () => {
        it('does not call the toggleOpen function', () => {
          accordionTabHeader.find('.accordion-content-toggle').simulate('change')
          expect(toggleOpen).not.toHaveBeenCalled()
        })
      })

      it('does not render the arrow', () => {
        expect(accordionTabHeader.find('.accordion-arrow').length).toBe(0)
      })

      it('does not render the checkbox', () => {
        expect(accordionTabHeader.find(Checkbox).length).toBe(0)
      })
    })
  })
})
