# Tests des stores

Les stores seront, par conception, utilisés à de nombreux endroits et peuvent rendre les tests beaucoup plus difficiles qu'ils ne devraient l'être. Heureusement, ce n'est pas forcément le cas. Nous devons faire attention à trois choses lorsque nous testons des stores :

- L'instance `pinia` : Les stores ne peuvent pas fonctionner sans elle
- Les `actions` : la plupart du temps, elles contiennent la logique la plus complexe de nos stores. Ne serait-il pas agréable qu'elles soient simulées par défaut ?
- Les plugins : Si vous comptez sur des plugins, vous devrez aussi les installer pour les tests.

En fonction de ce que vous testez et de la manière dont vous le faites, nous devons nous occuper de ces trois éléments différemment :

  - [Test des stores](#testing-stores)
  - [Test unitaire d'un store](#unit-testing-a-store)
  - [Composants de test unitaire](#unit-testing-components)
  - [Tests E2E](#e2e-tests)
  - [Composants de test unitaire (Vue 2)](#unit-test-components-vue-2)

## Test unitaire d'un store

Pour tester un store, la partie la plus importante est de créer une instance `pinia` :

```js
// counterStore.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // crée un nouveau pinia et le rend actif pour qu'il soit automatiquement récupéré automatiquement 
    // par tout appel à useStore() sans avoir à le lui passer :
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounter()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounter()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })
})
```

Si vous avez des plugins de store, il y a une chose importante à savoir : **les plugins ne seront pas utilisés tant que `pinia` n'est pas installé dans une App**. Ceci peut être résolu en créant une application vide ou une fausse application :

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// même code que ci-dessus...

// vous n'avez pas besoin de créer une application par test
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## Composants de test unitaire

Ceci peut être réalisé avec `createTestingPinia()`. Je n'ai pas encore été capable d'écrire une documentation appropriée pour cela, mais son utilisation peut être découverte grâce à l'autocomplétion et à la documentation qui apparaît dans les infobulles.

Commencez par installer `@pinia/testing` :

```sh
npm i -D @pinia/testing
```

Et assurez-vous de créer une pinia de test dans vos tests lorsque vous montez un composant :

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // utilise le pinia de test !

// l'état peut être directement manipulé
store.name = 'my new name'
// peut également être fait par le biais du patch
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// les actions sont stubées par défaut mais peuvent être configurées en
// en passant une option à `createTestingPinia()`.
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

Veuillez noter que si vous utilisez Vue 2, `@vue/test-utils` nécessite une [configuration légèrement différente](#unit-test-components-vue-2).

Vous pouvez trouver plus d'exemples dans [les tests du paquet de test](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts).

## Les Tests E2E

En ce qui concerne pinia, vous n'avez pas besoin de changer quoi que ce soit pour les tests e2e, c'est là tout l'intérêt des tests e2e ! Vous pourriez peut-être tester HTTP requests, but that's way beyond the scope of this guide 😄.

## Composants de test unitaire (Vue 2)

Si vous utilisez [Vue Test Utils 1](https://v1.test-utils.vuejs.org/), installez Pinia sur un `localVue` :

```js
import { PiniaVuePlugin } from 'pinia'
import { createLocalVue, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const localVue = createLocalVue()
localVue.use(PiniaVuePlugin)

const wrapper = mount(Counter, {
  localVue,
  pinia: createTestingPinia(),
})

const store = useSomeStore() // utilise le test pinia !
```
