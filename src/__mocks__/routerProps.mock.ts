import { RouteComponentProps } from 'react-router'
import { UnregisterCallback, Href } from 'history'

export function getMockRouterProps() {

  const location = {
    hash: '',
    key: '',
    pathname: '',
    search: '',
    state: {},
  }

  const props: RouteComponentProps<any> = {
    match: {
      isExact: true,
      params: {},
      path: '',
      url: '',
    },
    location,
    history: {
      length: 2,
      action: 'POP',
      location,
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      block: (t) => {
        const temp: UnregisterCallback = null
        return temp
      },
      createHref: (t) => {
        const temp: Href = ''
        return temp
      },
      listen: (t) => {
        const temp: UnregisterCallback = null
        return temp
      },
    },
    staticContext: {},
  }
  return props
}
