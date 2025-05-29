import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SimpleGreeting from './SimpleGreeting.vue'

describe('SimpleGreeting.vue', () => {
  it('renders the greeting with the provided name', () => {
    const name = 'TestUser'
    const wrapper = mount(SimpleGreeting, {
      props: { name },
    })
    expect(wrapper.text()).toContain(`Hello, ${name}!`)
  })

  it('renders "Hello, !" if no name is somehow passed (though TS should prevent)', () => {
    // This test is more about ensuring the component mounts and renders default-ish states
    // @ts-expect-error testing a scenario that TS would ideally prevent
    const wrapper = mount(SimpleGreeting, { props: { name: undefined } })
    // Depending on how Vue handles undefined string props, it might be "undefined!" or just " !"
    // Let's assume it coerces to empty string or "undefined"
    expect(wrapper.text()).toMatch(/Hello, (undefined)?!/)
  })
})
