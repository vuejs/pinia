import Vue from 'vue'
import { PiniaSsr } from '../../src'
import { mockWarn } from 'jest-mock-warn'

describe('SSR', () => {
  mockWarn()

  it('should warn when installed in the browser', () => {
    const mixinSpy = jest.spyOn(Vue, 'mixin')
    Vue.use(PiniaSsr)
    expect(/seems to be used in the client bundle/i).toHaveBeenWarned()
    expect(mixinSpy).not.toHaveBeenCalled()
    mixinSpy.mockRestore()
  })
})
