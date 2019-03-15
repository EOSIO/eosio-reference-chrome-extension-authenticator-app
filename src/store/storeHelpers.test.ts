import { StateToHandlerFunctionsMap, createReducers } from './storeHelpers'

describe('store helpers', () => {
  describe('createReducers', () => {
    it('creates a reducer from initial state and a handler function map', () => {
      const handlerFunctionMap: StateToHandlerFunctionsMap<any> = (state: any) => ({
        ACTION: () => ({
          ...state,
          newKey: 'newValue',
        }),
      })

      const reducer = createReducers({
        oldKey: 'oldValue',
      }, handlerFunctionMap)

      const result = reducer(undefined, { type: 'ACTION' })

      expect(result).toEqual({
        oldKey: 'oldValue',
        newKey: 'newValue',
      })
    })

    it('creates a reducer from initial state and an array of handler function maps', () => {
      const handlerFunctionMap1: StateToHandlerFunctionsMap<any> = (state: any) => ({
        ACTION1: () => ({
          ...state,
          newKey1: 'newValue1',
        }),
      })

      const handlerFunctionMap2: StateToHandlerFunctionsMap<any> = (state: any) => ({
        ACTION2: () => ({
          ...state,
          newKey2: 'newValue2',
        }),
      })

      const reducer = createReducers({
        oldKey: 'oldValue',
      }, [
        handlerFunctionMap1,
        handlerFunctionMap2,
      ])

      const result1 = reducer(undefined, { type: 'ACTION1' })
      const result2 = reducer(undefined, { type: 'ACTION2' })

      expect(result1).toEqual({
        oldKey: 'oldValue',
        newKey1: 'newValue1',
      })
      expect(result2).toEqual({
        oldKey: 'oldValue',
        newKey2: 'newValue2',
      })
    })
  })
})
