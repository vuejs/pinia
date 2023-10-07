# Миграция с ≤4 %{#migrating-from-Vuex-≤4}%

Несмотря на различную структуру хранилища в Vuex и Pinia, множество логики может быть использовано повторно. Это руководство призвано помочь вам в этом процессе и указать на некоторые распространенные подводные камни, которые могут возникнуть.

## Подготовка %{#preparation}%

Для начала, выполните инструкции в [руководстве по началу работы](../getting-started.md) для установки Pinia.

## Реструктуризация модулей в хранилища %{#restructuring-modules-to-stores}%

В Vuex реализована концепция единого хранилища с несколькими _модулями_. Эти модули могут быть разделены по именам и даже вложены друг в друга.

Самый простой способ перейти к использованию этой концепции с Pinia заключается в том, что каждый модуль, который вы ранее использовали, теперь является хранилищем. Каждое хранилище требует уникального `id`, который аналогичен пространству имен в Vuex. Это означает, что каждое хранилище по умолчанию находится в своем собственном пространстве имен. Вложенные модули также могут стать своими собственными хранилищами. Хранилища, которые зависят друг от друга, просто импортируют другое хранилище.

Как реструктурировать модули Vuex в хранилища Pinia, зависит только от вас, но вот одно из предложений:

```bash
# Пример Vuex (предполагая модули с пространством имен)
src
└── store
    ├── index.js           # Инициализирует Vuex, импортирует модули
    └── modules
        ├── module1.js     # пространство имен 'module1'
        └── nested
            ├── index.js   # пространство имен 'nested', импортирует module2 и module3
            ├── module2.js # пространство имен 'nested/module2'
            └── module3.js # пространство имен 'nested/module3'

# Эквивалент Pinia, обратите внимание на соответствие ids предыдущим пространствам имен
src
└── stores
    ├── index.js          # (Необязательно) Инициализирует Pinia, не импортирует хранилища
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nestedModule2' id
    ├── nested-module3.js # 'nestedModule3' id
    └── nested.js         # 'nested' id
```

Это создает плоскую структуру для хранилищ, но также сохраняет предыдущие пространства имен c эквивалентными `id`. Если у вас были какое-нибудь состояние/геттеры/действия/мутации в корне хранилища (в файле `store/index.js` в Vuex), вы можете создать другое хранилище с именем, например, `root`, которое будет содержать всю эту информацию.

Каталог для Pinia обычно называется `stores`, а не `store`. Это подчеркивает, что Pinia использует несколько хранилищ вместо одного хранилища в Vuex.

Для больших проектов вы можете мигрировать модуль за модулем, а не конвертировать все сразу. Фактически, вы можете смешивать Pinia и Vuex во время миграции, поэтому этот подход тоже может работать, и это еще одна причина называть директорию Pinia `stores`.

## Преобразование одного модуля %{#converting-a-single-module}%

Вот полный пример до и после преобразования модуля Vuex в храналище Pinia, смотрите ниже пошаговое руководство. В примере Pinia используется option-хранилище, поскольку в нем структура наиболее похожа на Vuex:

```ts
// Модуль Vuex в пространстве имен 'auth/user'
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // если используется определение типа Vuex

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

const storeModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    firstName: '',
    lastName: '',
    userId: null
  },
  getters: {
    firstName: (state) => state.firstName,
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // объединение с состоянием из других модулей
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // чтение состояния из другого модуля с именем `auth`.
        ...rootState.auth.preferences,
        // чтения геттера из модуля с пространством имен `email`, вложенного в `auth`
        ...rootGetters['auth/email'].details
      }
    }
  },
  actions: {
    async loadUser ({ state, commit }, id: number) {
      if (state.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      commit('updateUser', res)
    }
  },
  mutations: {
    updateUser (state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.userId = payload.userId
    },
    clearUser (state) {
      state.firstName = ''
      state.lastName = ''
      state.userId = null
    }
  }
}

export default storeModule
```

```ts
// Хранилище Pinia
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // для постепенного преобразования, см. fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('authUser', {
  // преобразование в функцию
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // firstName геттер удален, так как больше не требуется
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // необходимо определить возвращаемый тип из-за использования `this`
    fullUserDetails(state): FullUserDetails {
      // импорт из других хранилищ
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // другие геттеры теперь доступны в `this`
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // альтернатива, если другие модули все еще находятся в Vuex
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // нет контекста в качестве первого аргумента, используйте `this` вместо него
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // мутации теперь могут становиться действиями, вместо `state` в качестве первого аргумента используется `this`
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // легко сбросить состояние с помощью `$reset`
    clearUser () {
      this.$reset()
    }
  }
})
```

Разделим вышесказанное на этапы:

1. Добавьте обязательный `id` для хранилища. Возможно вам захочется оставить его таким же, как и пространство имен ранее. Также рекомендуется убедиться, что `id` написан в _camelCase_, так как это упростит его использование с `mapStores()`.
2. Преобразуйте `state` в функцию, если она еще не была таковой
3. Преобразуйте `getters`
   1. Удалите все геттеры, возвращающие состояние под одним и тем же именем (например, `firstName: (state) => state.firstName`), они не нужны, так как доступ к любому состоянию можно получить напрямую из экземпляра магазина
   2. Если необходимо обратиться к другим геттерам, то они находятся на `this` вместо использования второго аргумента. Помните, что если вы используете `this`, то вам придется использовать обычную функцию, а не стрелочную. Также обратите внимание, что из-за ограничений TS необходимо указывать возвращаемый тип, подробнее см. в [здесь](../core-concepts/getters.md#accessing-other-getters)
   3. Если используются аргументы `rootState` или `rootGetters`, замените их, импортировав другой магазин напрямую, или, если они все еще существуют в Vuex, обратитесь к ним напрямую из Vuex
4. Преобразуйте `actions`
   1. Удалите первый аргумент `context` из каждого действия. Вместо этого все должно быть доступно из `this`
   2. При использовании других хранилищ либо импортируйте их напрямую, либо обращайтесь к ним через Vuex, как и в случае с геттерами
5. Преобразуйте `mutations`
   1. Мутации больше не существуют. Вместо этого их можно преобразовать в `actions`, либо просто присваивать значеня в компонентах напрямую в хранилище (например, `userStore.firstName = 'First'`)
   2. Если вы преобразовываете мутации в действия, удалите первый аргумент `state` и замените все присваивания на `this`.
   3. Распространенной мутацией является сброс состояния в исходное. Для этого в хранилище встроен метод `$reset`. Обратите внимание, что такая функциональность существует только для option-хранилищ.

Как видите, большая часть вашего кода может быть переиспользована. Безопасность типов также должна помочь вам определить, что нужно изменить, если что-то упущено.

## Использование внутри компонентов %{#usage-inside-components}%

Теперь, когда ваш модуль Vuex преобразован в магазин Pinia, все компоненты и другие файлы, использующие этот модуль, также должны быть обновлены.

Если вы ранее использовали `map`-помощники из Vuex, то стоит обратить внимание на [руководство по использованию без setup()](./options-api.md), так как большинство этих вспомогательных функций можно переиспользовать.

Если вы использовали `useStore`, то вместо этого импортируйте новое хранилище напрямую и получайте доступ к состоянию через него. Например:

```ts
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters['auth/user/fullName'])

    return {
      firstName,
      fullName
    }
  }
})
```

```ts
// Pinia
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
  setup () {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // Вы также можете получить доступ ко всему хранилищу в своем компоненте, вернув его
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## Использование вне компонентов %{#usage-outside-components}%

Обновление использования вне компонентов должно быть простым при условии, что вы будете осторожны и _не будете использовать хранилище за пределами функций_. Приведем пример использования хранилища в навигационном хуке Vue Router:

```ts
// Vuex
import vuexStore from '@/store'

router.beforeEach((to, from, next) => {
  if (vuexStore.getters['auth/user/loggedIn']) next()
  else next('/login')
})
```

```ts
// Pinia
import { useAuthUserStore } from '@/stores/auth-user'

router.beforeEach((to, from, next) => {
  // Должно использоваться внутри функции!
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

Более подробную информацию можно найти [здесь](../core-concepts/outside-component-usage.md).

## Расширенное использование Vuex %{#advanced-vuex-usage}%

Если ваш хранилище Vuex использует более сложные функции, то вот рекомендации о том, как достичь того же самого в Pinia. Некоторые из этих моментов уже описаны в [этом сравнительном обзоре](../introduction.md#Comparison-with-Vuex-3-x-4-x).

### Динамические модули %{#dynamic-modules}%

В Pinia нет необходимости динамически регистрировать модули. Хранилища фактически являются динамическими и регистрируются только тогда, когда они необходимы. Если хранилище никогда не используется, он никогда не будет "зарегистрировано".

### Горячая замена модулей (HMR) %{#hot-module-replacement}%

HMR поддерживается, но потребует изменений, см. [руководство по HMR](./hot-module-replacement.md).

### Плагины %{#plugins}%

Если вы используете публичный плагин Vuex, то проверьте, есть ли его альтернатива Pinia. Если нет, то необходимо написать свой собственный или оценить необходимость использования плагина.

Если вы написали свой собственный плагин, то скорее всего его можно обновить для работы с Pinia. См. [руководство по плагинам](../core-concepts/plugins.md).
