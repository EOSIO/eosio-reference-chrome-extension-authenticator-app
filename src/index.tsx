import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'assets/styles/core.css'

import Root from './Root'
import store from 'store/store'

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('app') as HTMLElement,
)
