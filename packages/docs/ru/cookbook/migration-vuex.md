# Миграция с Vuex ≤4

Хотя структура хранилищ Vuex и Pinia отличается, многие логические элементы могут быть использованы повторно. Это руководство поможет вам пройти этот процесс и укажет на некоторые распространенные проблемы, которые могут возникнуть.

## Подготовка

Во-первых, следуйте инструкциям [Руководство по началу работы](../getting-started.md) для установки Pinia.

## Реструктуризация модулей в хранилища

В Vuex есть концепция одного хранилища с несколькими _модулями_. Эти модули могут быть разнесены по именам и даже вложены друг в друга.

Самый простой способ перенести эту концепцию на Pinia заключается в том, что каждый модуль, который вы использовали ранее, теперь является _хранилищем_. Каждому хранилищу требуется `id`, который аналогичен пространству имен в Vuex. Это означает, что каждое хранилище имеет пространство имен. Вложенные модули также могут стать собственными хранилищами. Хранилища, которые зависят друг от друга, будут просто импортировать другой магазин.

Как вы решите реструктурировать свои модули Vuex в магазины Pinia, зависит только от вас, но вот одно предложение:

```bash
# Пример Vuex (предполагающий использование модулей с разнесенными именами)
src
└── store
    ├── index.js           # Инициализация Vuex, импорт модулей
    └── modules
        ├── module1.js     # пространство имен 'module1'
        └── nested
            ├── index.js   # # "nested" пространство имен, импортирует module2 и module3
            ├── module2.js # пространство имен 'nested/module2'
            └── module3.js # пространство имен 'nested/module3'

# Эквивалент Pinia, обратите внимание, что идентификаторы соответствуют предыдущим пространствам имен
src
└── stores
    ├── index.js          # (Необязательно) Инициализирует Pinia, не импортирует хранилища
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nestedModule2' id
    ├── nested-module3.js # 'nestedModule3' id
    └── nested.js         # 'nested' id
```

Это создает плоскую структуру для хранилищ, но также сохраняет предыдущее пространство имен с эквивалентными идентификаторами. Если у вас были какие-то состояния/геттеры/действия/мутации в корне хранилища (в `store/index.js` файл Vuex) возможно, вы захотите создать другое хранилище под названием что-то вроде `root`, в котором хранится вся эта информация.

Каталог для Pinia обычно называется "stores" вместо `store`. Это делается для того, чтобы подчеркнуть, что Pinia использует несколько хранилищ, а не одно хранилище в Vuex.

Для крупных проектов вы можете захотеть выполнить это преобразование модуль за модулем, а не преобразовывать все сразу. На самом деле вы можете смешать Pinia и Vuex вместе во время миграции, так что этот подход также может сработать и является еще одной причиной для присвоения каталогу Pinia названия "stores" вместо этого.

## Преобразование одного модуля

Ниже приведен полный пример до и после преобразования модуля Vuex в магазин Pinia, смотрите ниже пошаговое руководство. В примере Pinia используется хранилище опций, так как его структура наиболее похожа на Vuex:

```ts
// Модуль Vuex в пространстве имен 'auth/user'.
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
        userId: null,
    },
    getters: {
        firstName: (state) => state.firstName,
        fullName: (state) => `${state.firstName} ${state.lastName}`,
        loggedIn: (state) => state.userId !== null,
        // объединение с некоторым состоянием из других модулей
        fullUserDetails: (state, getters, rootState, rootGetters) => {
            return {
                ...state,
                fullName: getters.fullName,
                // считываем состояние из другого модуля с именем `auth`.
                ...rootState.auth.preferences,
                // считываем геттер из модуля с разграниченными именами `email`, вложенного в `auth`.
                ...rootGetters['auth/email'].details,
            }
        },
    },
    actions: {
        async loadUser({ state, commit }, id: number) {
            if (state.userId !== null) throw new Error('Already logged in')
            const res = await api.user.load(id)
            commit('updateUser', res)
        },
    },
    mutations: {
        updateUser(state, payload) {
            state.firstName = payload.firstName
            state.lastName = payload.lastName
            state.userId = payload.userId
        },
        clearUser(state) {
            state.firstName = ''
            state.lastName = ''
            state.userId = null
        },
    },
}

export default storeModule
```

```ts
// Pinia Store
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
        userId: null,
    }),
    getters: {
        // геттер firstName удален, больше не нужен
        fullName: (state) => `${state.firstName} ${state.lastName}`,
        loggedIn: (state) => state.userId !== null,
        // необходимо определить тип возврата из-за использования `this`.
        fullUserDetails(state): FullUserDetails {
            // импорт из других хранилищ
            const authPreferencesStore = useAuthPreferencesStore()
            const authEmailStore = useAuthEmailStore()
            return {
                ...state,
                // другие геттеры теперь на `this`.
                fullName: this.fullName,
                ...authPreferencesStore.$state,
                ...authEmailStore.details,
            }

            // альтернатива, если другие модули все еще находятся в Vuex
            // return {
            //   ...state,
            //   fullName: this.fullName,
            //   ...vuexStore.state.auth.preferences,
            //   ...vuexStore.getters['auth/email'].details
            // }
        },
    },
    actions: {
        // нет контекста в качестве первого аргумента, используйте `this` вместо него
        async loadUser(id: number) {
            if (this.userId !== null) throw new Error('Already logged in')
            const res = await api.user.load(id)
            this.updateUser(res)
        },
        // Мутации теперь могут стать экшенами, вместо `state` в качестве первого аргумента используйте `this`.
        updateUser(payload) {
            this.firstName = payload.firstName
            this.lastName = payload.lastName
            this.userId = payload.userId
        },
        // легко сбросить состояние с помощью `$reset`.
        clearUser() {
            this.$reset()
        },
    },
})
```

Давайте разберем вышесказанное на этапы:

1. Добавьте обязательный `id` для хранилища, возможно, вы захотите сохранить его таким же, как и пространство имен ранее. Также рекомендуется убедиться, что `id` находится в _camelCase_, поскольку это упрощает использование с `mapStores()`.
2. Преобразуйте `state` в функцию, если она еще не была таковой
3. Преобразуйте `getters`
    1. Удалите все средства получения, которые возвращают состояние под тем же именем (например, `FirstName: (state) => state.FirstName`), в этом нет необходимости, поскольку вы можете получить доступ к любому состоянию непосредственно из экземпляра хранилища
    2. Если вам нужно получить доступ к другим геттерам, они находятся на `this` вместо использования второго аргумента. Помните, что если вы используете `this`, то вам придется использовать обычную функцию вместо функции со стрелкой. Также обратите внимание, что вам нужно будет указать возвращаемый тип из-за ограничений TS, см. [здесь](../core-concepts/getters.md#accessing-other-getters к другим получателям) для получения более подробной информации
    3. При использовании аргументов `rootState` или `rootGetters` замените их прямым импортом другого хранилища или, если они все еще существуют в Vuex, получите к ним доступ непосредственно из Vuex
4. Преобразуйте `actions`
    1. Удалите первый аргумент `context` из каждого действия. Вместо этого все должно быть доступно из `this`
    2. При использовании других хранилищ либо импортируйте их напрямую, либо получите к ним доступ через Vuex, так же, как для геттеров
5. Преобразуйте `mutations`
    1. Мутаций больше не существует. Вместо этого они могут быть преобразованы в `actions`, или вы можете просто назначить непосредственно хранилищу внутри ваших компонентов (например. `UserStore.FirstName = 'First'`)
    2. При преобразовании в действия удалите первый аргумент `state` и замените все назначения на `this` вместо этого
    3. Распространенная мутация заключается в возврате состояния обратно в исходное состояние. Это встроенная функциональность с помощью метода магазина `$reset`. Обратите внимание, что эта функциональность существует только для магазинов опций.

Как вы можете видеть, большая часть вашего кода может быть использована повторно. Безопасность типов также должна помочь вам определить, что необходимо изменить, если что-то пропущено.

## Использование внутри компонентов

Теперь, когда ваш модуль Vuex преобразован в Pinia store, любой компонент или другой файл, использующий этот модуль, также необходимо обновить.

Если вы раньше использовали хелперы `map` из Vuex, стоит ознакомиться с руководством [Использование без setup()](./options-api.md ), поскольку большинство из этих хелперов можно использовать повторно.

Если вы использовали `useStore`, они вместо этого импортируют новое хранилище напрямую и получают доступ к его состоянию. Например:

```ts
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    setup() {
        const store = useStore()

        const firstName = computed(() => store.state.auth.user.firstName)
        const fullName = computed(() => store.getters['auth/user/fullName'])

        return {
            firstName,
            fullName,
        }
    },
})
```

```ts
// Pinia
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
    setup() {
        const authUserStore = useAuthUserStore()

        const firstName = computed(() => authUserStore.firstName)
        const fullName = computed(() => authUserStore.fullName)

        return {
            // вы также можете получить доступ ко всему хранилищу в своем компоненте, возвращая его
            authUserStore,
            firstName,
            fullName,
        }
    },
})
```

## Использование вне компонентов

Обновление использования вне компонентов должно быть простым, если вы будете осторожны, чтобы _не использовать хранилище вне функций_. Вот пример использования хранилища в навигационной защите Vue Router:

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
    // Должен использоваться внутри функции!
    const authUserStore = useAuthUserStore()
    if (authUserStore.loggedIn) next()
    else next('/login')
})
```

Более подробную информацию можно найти [здесь](../core-concepts/outside-component-usage.md).

## Расширенное использование Vuex

В случае, если ваше хранилище Vuex использует некоторые из более продвинутых возможностей, которые он предлагает, вот некоторые рекомендации о том, как сделать то же самое в Pinia. Некоторые из этих моментов уже рассмотрены в [этом сравнительном обзоре](../introduction.md#comparison-with-vuex-3-x-4-x).

### Динамические модули

В Pinia нет необходимости динамически регистрировать модули. Хранилище динамичны по своей природе и регистрируются только тогда, когда они необходимы. Если магазин никогда не используется, он никогда не будет "зарегистрирован".

### Горячая замена модулей

HMR также поддерживается, но его необходимо заменить, см. раздел [HMR Руководство](./hot-module-replacement.md).

### Плагины

Если вы используете публичный плагин Vuex, проверьте, есть ли альтернатива Pinia. Если нет, то вам нужно будет написать свой собственный или оценить, нужен ли еще этот плагин.

Если вы написали собственный плагин, то, скорее всего, его можно обновить для работы с Pinia. Смотрите [Руководство по плагинам](.../core-concepts/plugins.md).
