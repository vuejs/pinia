import { defineComponent, computed } from 'vue'
import { useStore } from './store'

export default defineComponent({
  setup() {
    const store = useStore()

    const doubleCount = computed(() => store.state.counter * 2)
    function increment() {
      store.state.counter++
    }

    return {
      doubleCount,
      increment,
      state: store.state,
    }
  },

  template: `
  <div>
    <h2>Hi {{ state.name }}</h2>
    <p>Count: {{ state.counter }} x 2 = {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
  `,
})
