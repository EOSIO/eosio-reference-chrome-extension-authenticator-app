import * as React from 'react'
import './Checkbox.css'

interface Props extends Omit<HTMLFormElement, 'type'> {}

const Checkbox: React.SFC<Props> = (props) => {
  const { children, ...inputProps } = props
  return (
    <span className='checkbox'>
      <input {...inputProps} type='checkbox' />
      <label htmlFor={props.id}>
        {children}
      </label>
    </span>
  )
}

Checkbox.displayName = 'Checkbox'
export default Checkbox
