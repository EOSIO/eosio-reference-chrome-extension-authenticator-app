import '__mocks__/chrome.mock'
import 'utils/__mocks__/encrypter.mock'

import * as React from 'react'
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme'
import { MemoryRouter as Router, NavLink } from 'react-router-dom'

import SettingsView from './SettingsView'
import * as DeveloperSettingsViewImport from 'components/settings/developer/DeveloperSettingsView'
import * as GeneralSettingsViewImport from 'components/settings/general/GeneralSettingsView'
import RoutePath from 'constants/routePath'

describe('SettingsView', () => {
  let router: ReactWrapper
  let settings: ShallowWrapper

  let DeveloperSettingsView: any
  let GeneralSettingsView: any

  beforeEach(() => {
    DeveloperSettingsView = <div id='DeveloperSettingsView' />
    jest.spyOn(DeveloperSettingsViewImport, 'default').mockImplementation(jest.fn(() => DeveloperSettingsView))
    GeneralSettingsView = <div id='GeneralSettingsView' />
    jest.spyOn(GeneralSettingsViewImport, 'default').mockImplementation(jest.fn(() => GeneralSettingsView))

    settings = shallow(<SettingsView />)
  })

  describe('rendering', () => {
    describe('the nav list', () => {
      let navList: ShallowWrapper

      beforeEach(() => {
        navList = settings.find('ul')
      })

      it('gets rendered', () => {
        expect(navList).toHaveLength(1)
      })

      it('contains two NavLinks', () => {
        expect(navList.find(NavLink)).toHaveLength(2)
      })

      describe('the first navlink', () => {
        let firstNavLink: ShallowWrapper

        beforeEach(() => {
          firstNavLink = navList.find(NavLink).at(0)
        })

        it('links to the developer route', () => {
          expect(firstNavLink.prop('to')).toBe('/generalSettings')
        })

        it('has the correct active class name', () => {
          expect(firstNavLink.prop('activeClassName')).toBe('active')
        })

        it('has the correct label', () => {
          expect(firstNavLink.childAt(0).text()).toBe('General')
        })
      })

      describe('the second navlink', () => {
        let secondNavLink: ShallowWrapper

        beforeEach(() => {
          secondNavLink = navList.find(NavLink).at(1)
        })

        it('links to the developer route', () => {
          expect(secondNavLink.prop('to')).toBe('/developerSettings')
        })

        it('has the correct active class name', () => {
          expect(secondNavLink.prop('activeClassName')).toBe('active')
        })

        it('has the correct label', () => {
          expect(secondNavLink.childAt(0).text()).toBe('Developer')
        })
      })
    })

    describe(`when the path is: ${RoutePath.GENERAL_SETTINGS}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.GENERAL_SETTINGS]}>
            <SettingsView />
          </Router>,
        )

        router.find(SettingsView)
      })

      it('renders the General Settings View', () => {
        expect(router.find('#GeneralSettingsView')).toHaveLength(1)
      })

      it('renders the General tab active', () => {
        expect(router.find('a').at(0).hasClass('active')).toBe(true)
      })

      it('does not render the Developer tab active', () => {
        expect(router.find('a').at(1).hasClass('active')).toBe(false)
      })
    })

    describe(`when the path is: ${RoutePath.DEVELOPER_SETTINGS}`, () => {
      beforeEach(() => {
        router = mount(
          <Router initialEntries={[RoutePath.DEVELOPER_SETTINGS]}>
            <SettingsView />
          </Router>,
        )

        router.find(SettingsView)
      })

      it('renders the Developer Settings View', () => {
        expect(router.find('#DeveloperSettingsView')).toHaveLength(1)
      })

      it('does not render the General tab active', () => {
        expect(router.find('a').at(0).hasClass('active')).toBe(false)
      })

      it('renders the Developer tab active', () => {
        expect(router.find('a').at(1).hasClass('active')).toBe(true)
      })
    })
  })
})
