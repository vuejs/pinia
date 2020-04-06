import Vue from 'vue'
import { PiniaSsr } from '../../src'

it('should warn when installed in the browser', () => {
  const mixinSpy = jest.spyOn(Vue, 'mixin')
  const warnSpy = jest.spyOn(console, 'warn')
  Vue.use(PiniaSsr)
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringMatching(/seems to be used in the browser bundle/i)
  )
  expect(mixinSpy).not.toHaveBeenCalled()
})
