# HMR (Гаряча заміна модулів) %{#hmr-hot-module-replacement}%

Pinia підтримує гарячу заміна модулів, тож ви можете відредагувати свої сховища та взаємодіяти з ними безпосередньо у своєму застосунку, не перезавантажуючи сторінку, що дозволяє зберегти наявний стан, додавати або навіть видаляти стан, дії та гетери.

На даний момент офіційно підтримується лише [Vite](https://vitejs.dev/), але будь-який збірник, що реалізує специфікацію `import.meta.hot`, повинен працювати (наприклад, [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot), здається, використовується `import.meta.webpackHot` замість `import.meta.hot`).
Вам потрібно додати цей фрагмент коду до будь-якого оголошення сховища. Припустимо, у вас є три сховища: `auth.js`, `cart.js`, і `chat.js`, , вам доведеться додати (та адаптувати) це після створення _визначення сховища_:

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // параметри...
})

// переконайтеся, що передано правильне визначення сховища, у цьому випадку `useAuth`.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
