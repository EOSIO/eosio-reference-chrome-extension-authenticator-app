import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'

import Contract from './Contract'

describe('Contract', () => {
  let contract: ShallowWrapper
  let ricardianContractHTML: string

  beforeEach(() => {
    ricardianContractHTML = '<span>Here is a contract</span>'
  })

  describe('when rendered', () => {
    beforeEach(() => {
      contract = shallow(<Contract ricardianContractHTML={ricardianContractHTML} />)
    })

    it('renders a root div', () => {
      expect(contract.type()).toEqual('div')
    })

    it('renders the ricardian contract', () => {
      expect(contract.find('div').html().includes('<span>Here is a contract</span>')).toBe(true)
    })
  })
})
