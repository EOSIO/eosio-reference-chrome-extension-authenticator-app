import * as React from 'react'
import { shallow, ShallowWrapper } from 'enzyme'
import InsecureModeView from 'components/insecureMode/InsecureModeView'

describe('InsecureMode', () => {
  const onChange = jest.fn()
  const event = {}
  let insecureMode: ShallowWrapper

  beforeEach(() => {
    insecureMode = shallow(<InsecureModeView onChange={onChange} insecureMode />)
  })

  describe('rendering', () => {
    it('renders the InsecureMode title', () => {
      expect(insecureMode.find('.insecure-mode-title')).toHaveLength(1)
    })

    it('renders the InsecureMode info', () => {
      expect(insecureMode.find('.insecure-mode-info')).toHaveLength(1)
    })

    describe('when insecureMode is enabled', () => {
      it('input should be checked', () => {
        expect(insecureMode.find('input').prop('checked')).toBe(true)
      })
    })

    describe('when insecureMode is turned off', () => {
      it('input should be unchecked', () => {
        insecureMode = shallow(<InsecureModeView onChange={onChange} insecureMode={false} />)
        expect(insecureMode.find('input').prop('checked')).toBe(false)
      })
    })
  })

  it('should call the onChange handler when input is toggled', () => {
    insecureMode.find('input').prop('onChange')(event as React.ChangeEvent<HTMLInputElement>)
    expect(onChange).toHaveBeenCalledWith(event)
  })
})
