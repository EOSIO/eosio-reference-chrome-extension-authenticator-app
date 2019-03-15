import * as React from 'react'
import './InsecureModeView.css'

interface Props {
  insecureMode: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const InsecureModeView: React.SFC<Props> = ({ insecureMode, onChange }) => (
  <div className='insecure-mode-container'>
    <h2 className='insecure-mode-title'>Insecure Mode</h2>
    <label className='switch'>
      <input type='checkbox' checked={insecureMode} onChange={onChange} />
      <span className='slider round' />
    </label>
    <p className='insecure-mode-info'>
      By turning this on, you’ll be bypassing all security measures which could lead to disastrous results.
      Please use with caution.
    </p>
  </div>
)

export default InsecureModeView
