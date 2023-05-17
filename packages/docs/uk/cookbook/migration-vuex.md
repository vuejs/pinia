# Міграція з Vuex ≤4 %{#migrating-from-vuex-≤4}%

Хоча структура сховищ Vuex і Pinia відрізняється, багато логіки можна використовувати повторно. Цей посібник допоможе вам у цьому процесі та вкаже на деякі поширені проблеми, які можуть виникнути.

## Підготовка %{#preparation}%

Спочатку дотримуйтеся [Посібника з початку роботи](../getting-started.md), щоб установити Pinia.

## Реструктуризація модулів у сховища %{#restructuring-modules-to-stores}%

Vuex має концепцію єдиного сховища з кількома _модулями_. Ці модулі за бажанням можуть мати простір імен і навіть можуть бути вкладені один в одного.

Найпростіший спосіб перенести цю концепцію на використання з Pinia полягає в тому, що кожен модуль, який ви використовували раніше, тепер є _сховищем_. Для кожного сховища потрібен `id`, подібний до простору імен у Vuex. Це означає, що кожне сховище має простір імен за дизайном. Кожен із вкладених модулів може стати окремим сховищем. Сховища, які залежать один від одного, просто імпортуватимуть інше сховище.

Як ви вирішите реструктуризувати свої модулі Vuex у сховища Pinia, залежить виключно від вас, але ось одна пропозиція:

```bash
# Vuex приклад (припускаючи модулі з простором імен)
src
└── store
    ├── index.js           # Ініціалізує Vuex, імпортує модулі
    └── modules
        ├── module1.js     # простір імен 'module1'
        └── nested
            ├── index.js   # 'nested' простір імен, імпортує module2 і module3
            ├── module2.js # простір імен 'nested/module2'
            └── module3.js # простір імен 'nested/module3'

# Еквівалент Pinia, зауважте, що ids відповідають попереднім просторам імен
src
└── stores
    ├── index.js          # (Опціонально) Ініціалізує Pinia, не імпортує сховища
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nestedModule2' id
    ├── nested-module3.js # 'nestedModule3' id
    └── nested.js         # 'nested' id
```

Це створює плоску структуру для сховищ, але також зберігає попередній простір імен з еквівалентними `id`. Якщо у вас були деякі стани/гетери/дії/мутації в корені сховища (у файлі `store/index.js` Vuex), можливо, ви захочете створити інше сховище під назвою щось на зразок `root`, яке зберігає всю цю інформацію.

Директорія для Pinia зазвичай називається `stores` замість `store`. Це підкреслює, що Pinia використовує кілька сховищ замість одного сховища у Vuex.

Для великих проектів ви можете виконувати це перетворення модуль за модулем, а не перетворювати все відразу. Ви фактично можете змішати Pinia та Vuex разом під час міграції, тому цей підхід також може працювати, і це ще одна причина натомість назвати каталог Pinia `stores`.

## Перетворення одного модуля %{#converting-a-single-module}%

Ось повний приклад до і після перетворення модуля Vuex на сховище Pinia, дивіться нижче покроковий посібник. У прикладі Pinia використовується опційне сховище, оскільки структура найбільш схожа на Vuex:

```ts
// Модуль Vuex у просторі імен 'auth/user'
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // якщо використовується визначення типу Vuex

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
    // поєднання з деяким станом з інших модулів
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // прочитати стан з іншого модуля під назвою `auth`
        ...rootState.auth.preferences,
        // прочитати гетер із модуля простору імен під назвою `email`, вкладеного в `auth`
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
// Pinia сховище
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // для поступового перетворення дивіться fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('authUser', {
  // перетворення на функцію
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // гетер firstName видалено, оскільки він більше не потрібен
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // необхідно визначити тип повернення через використання `this`
    fullUserDetails (state): FullUserDetails {
      // імпорт з інших сховищ
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // інші гетери тепер у `this`
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // альтернатива, якщо інші модулі все ще знаходяться у Vuex
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // немає контексту, як першого аргументу, замість цього використовуйте `this`
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // мутації тепер можуть стати діями, замість `state` як перший аргумент використовуйте `this`
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // легко скинути стан за допомогою `$reset`
    clearUser () {
      this.$reset()
    }
  }
})
```

Давайте розберемо вищезазначене покроково:

1. Додайте обов'язковий `id` для сховища, можливо, ви захочете залишити його таким самим, як і простір імен раніше. Також рекомендується переконатися, що `id` має _camelCase_ оскільки це полегшує використання `mapStores()`.
2. Перетворіть `state` на функцію, якщо це ще не було зроблено
3. Перетворіть `getters`
    1. Видаліть усі геттери, які повертають стан під тим самим іменем (наприклад, `firstName: (state) => state.firstName`), вони не є необхідними, оскільки ви можете отримати доступ до будь-якого стану безпосередньо з примірника сховища
    2. Якщо вам потрібно отримати доступ до інших гетерів, вони знаходяться у `this` замість використання другого аргументу. Пам'ятайте, що якщо ви використовуєте `this`, вам доведеться використовувати звичайну функцію замість функції зі стрілкою. Також зауважте, що вам потрібно буде вказати тип повернення через обмеження TS, дивіться [тут](../core-concepts/getters.md#accessing-other-getters) для отримання додаткової інформації
    3. Якщо ви використовуєте аргументи `rootState` або `rootGetters`, замініть їх, безпосередньо імпортувавши інше сховище, або, якщо вони все ще існують у Vuex, отримуйте доступ до них безпосередньо з Vuex
4. Перетворіть `actions`
    1. Видаліть перший аргумент `context` з кожної дії. Натомість усе має бути доступним із `this`
    2. Якщо ви використовуєте інші сховища, імпортуючи їх безпосередньо, або через отримання доступ до них у Vuex, так само, як і для гетерів
5. Перетворіть `mutations`
    1. Мутацій більше не існує. Натомість їх можна перетворити на `actions`, або ви можете просто призначити безпосередньо до сховища у своїх компонентах (наприклад, `userStore.firstName = 'First'`)
    2. У разі перетворення на дії видаліть перший аргумент `state` і замініть усі призначення на `this`
    3. Поширеною мутацією є повернення стану до початкового стану. Це вбудована функція за допомогою методу сховища `$reset`. Зауважте, що ця функція доступна лише для опційних сховищ.

Як бачите, більшість вашого коду можна використовувати повторно. Безпека типів також має допомогти вам визначити, що потрібно змінити, якщо щось упущено.

## Використання всередині компонентів %{#usage-inside-components}%

Тепер, коли ваш модуль Vuex перетворено на сховище Pinia, будь-який компонент або інший файл, який використовує цей модуль, також потрібно оновити.

Якщо ви раніше користувалися помічниками `map` від Vuex, варто переглянути [Посібник із використання без setup()](./options-api.md) оскільки більшість цих помічників можна використовувати повторно.

Якщо ви використовували `useStore`, натомість імпортуйте нове сховище безпосередньо та отримайте доступ до його стану. Наприклад:

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
      // ви також можете отримати доступ до всього сховища у своєму компоненті, повернувши його
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## Використання за межами компонентів %{#usage-outside-components}%

Оновлення використання поза компонентами має бути простим, якщо ви обережні, щоб _не використовувати сховище поза функціями_. Ось приклад використання сховища в навігаційній системі Vue Router:

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
  // Необхідно використовувати в межах функції!
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

Більш детальну інформацію можна знайти [тут](../core-concepts/outside-component-usage.md).

## Розширене використання Vuex %{#advanced-vuex-usage}%

У випадку, якщо ваше сховище Vuex використовує деякі з розширених функцій, які воно пропонує, ось деякі вказівки щодо того, як зробити те саме в Pinia. Деякі з цих моментів уже розглянуто в [цьому порівняльному підсумку](../introduction.md#comparison-with-vuex-3-x-4-x).

### Динамічні модулі %{#dynamic-modules}%

Немає необхідності динамічно реєструвати модулі в Pinia. Сховища динамічні за дизайном і реєструються лише тоді, коли вони потрібні. Якщо сховище ніколи не використовується, воно ніколи не буде "зареєстрований".

### Гаряча заміна модулів %{#hot-module-replacement}%

HMR також підтримується, але його потрібно буде замінити, дивіться [Посібник HMR](./hot-module-replacement.md).

### Плагіни %{#plugins}%

Якщо ви використовуєте загальнодоступний плагін Vuex, перевірте, чи є альтернатива Pinia. Якщо ні, вам потрібно буде написати власний або оцінити, чи потрібен плагін.

Якщо ви написали власний плагін, його, ймовірно, можна оновити для роботи з Pinia. Перегляньте [Посібник із плагінів](../core-concepts/plugins.md).
