# 0.x (v1)에서 v2로 마이그레이션하기 %{#migrating-from-0-x-v1-to-v2}%

`2.0.0-rc.4` 버전부터 pinia는 Vue 2와 Vue 3 모두를 지원합니다! 이는 새로운 업데이트가 이 버전 2에 적용되어 Vue 2 및 Vue 3 사용자 모두가 혜택을 받을 수 있게 됨을 의미합니다. Vue 3을 사용하는 경우, 이미 rc를 사용하고 있기 때문에 변경 사항이 없습니다. 변경 내역에 대한 자세한 설명은 [CHANGELOG](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)를 확인하십시오. 그렇지 않은 경우, **이 가이드가 필요합니다**!

## 폐지된 기능 %{#deprecations}%

먼저, 모든 폐지된 사용 사례를 확인하기 위해 이미 최신 0.x 버전을 실행 중인지 확인하십시오:

```shell
npm i 'pinia@^0.x.x'
# 또는 yarn을 사용하는 경우
yarn add 'pinia@^0.x.x'
```

ESLint를 사용하고 있다면, [이 플러그인](https://github.com/gund/eslint-plugin-deprecation)을 사용하여 모든 폐지된 사용 사례를 찾을 수 있습니다. 그렇지 않으면, 그것들이 취소선으로 표시되어 나타날 수 있어야 합니다. 삭제된 이 API들은 다음과 같습니다:

- `createStore()`이 `defineStore()`로 변경되었습니다.
- 구독에서 `storeName`이 `storeId`로 변경되었습니다.
- `PiniaPlugin`이 `PiniaVuePlugin`으로 이름이 변경되었습니다 (Vue 2용 Pinia 플러그인).
- `$subscribe()`가 더 이상 불리언을 두 번째 매개변수로 받지 않으며, 대신 `detached: true`로 구성된 객체를 전달하십시오.
- Pinia 플러그인은 더 이상 스토어의 `id`를 직접 전달받지 않습니다. 대신 `store.$id`를 사용하십시오.

## 주요 변경 사항 %{#breaking-changes}%

이러한 변경 사항들을 제거한 후에는 다음과 같이 v2로 업그레이드할 수 있습니다:

```shell
npm i 'pinia@^2.x.x'
# 또는 yarn을 사용하는 경우
yarn add 'pinia@^2.x.x'
```

그런 다음 코드를 업데이트하세요.

### Generic Store 유형 %{#generic-store-type}%

[2.0.0-rc.0](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md#200-rc0-2021-07-28)에서 추가되었습니다.

`GenericStore` 유형 사용을 `StoreGeneric`으로 바꾸세요. 이것은 어떤 유형의 스토어든지 허용하는 새로운 일반 스토어 유형입니다. `Store<Id, State, Getters, Actions>`와 같이 제네릭을 전달하지 않고 `Store` 유형을 사용하는 함수를 작성하고 있다면, `Store` 유형 대신에 빈 스토어 유형을 생성하는 `StoreGeneric`을 사용해야 합니다.

```ts
function takeAnyStore(store: Store) {} // [!code --]
function takeAnyStore(store: StoreGeneric) {} // [!code ++]

function takeAnyStore(store: GenericStore) {} // [!code --]
function takeAnyStore(store: StoreGeneric) {} // [!code ++]
```

## 플러그인용 `DefineStoreOptions` %{#definestoreoptions-for-plugins}%

TypeScript를 사용하여 플러그인을 작성하고 `DefineStoreOptions` 유형을 확장하여 사용자 정의 옵션을 추가하는 경우, 이를 `DefineStoreOptionsBase`로 이름을 바꿔야 합니다. 이 유형은 설정 및 옵션 스토어에 모두 적용됩니다.

```ts
declare module 'pinia' {
  export interface DefineStoreOptions<S, Store> { // [!code --]
  export interface DefineStoreOptionsBase<S, Store> { // [!code ++]
    debounce?: {
      [k in keyof StoreActions<Store>]?: number
    }
  }
}
```

## `PiniaStorePlugin` 이름 변경 %{#piniastoreplugin-was-renamed}%

`PiniaStorePlugin` 유형이 `PiniaPlugin`으로 이름이 변경되었습니다.

```ts
import { PiniaStorePlugin } from 'pinia' // [!code --]
import { PiniaPlugin } from 'pinia' // [!code ++]

const piniaPlugin: PiniaStorePlugin = () => { // [!code --]
const piniaPlugin: PiniaPlugin = () => { // [!code ++]
  // ...
}
```

**이 변경 사항은 폐기되지 않은 Pinia의 최신 버전으로 업그레이드 한 후에만 수행할 수 있습니다**.

## `@vue/composition-api` 버전 %{#vue-composition-api-version}%

pinia는 이제 `effectScope()`에 의존하므로 적어도 `1.1.0` 버전의 `@vue/composition-api`를 사용해야 합니다.

```shell
npm i @vue/composition-api@latest
# 또는 yarn을 사용하는 경우
yarn add @vue/composition-api@latest
```

## webpack 4 지원 %{#webpack-4-support}%

webpack 4를 사용하는 경우 (Vue CLI는 webpack 4를 사용합니다), 다음과 같은 오류가 발생할 수 있습니다:

```
ERROR  Failed to compile with 18 errors

 error  in ./node_modules/pinia/dist/pinia.mjs

Can't import the named export 'computed' from non EcmaScript module (only default export is available)
```

이는 Node.js에서 네이티브 ESM 모듈을 지원하기 위해 dist 파일을 모던화하는 결과입니다. 파일은 이제 `.mjs` 및 `.cjs` 확장자를 사용하여 Node가 이를 활용할 수 있도록 합니다. 이 문제를 해결하려면 두 가지 방법이 있습니다:

- Vue CLI 4.x를 사용하는 경우 의존성을 업그레이드하세요. 이것은 아래의 수정 사항을 포함해야 합니다.
  - 업그레이드가 불가능한 경우, `vue.config.js`에 다음을 추가하세요:

    ```js
    // vue.config.js
    module.exports = {
      configureWebpack: {
        module: {
          rules: [
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: 'javascript/auto',
            },
          ],
        },
      },
    }
    ```

- 수동으로 webpack을 처리하고 있다면, `.mjs` 파일을 처리하는 방법을 webpack에 알려줘야 합니다:

  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  }
  ```

## 개발 도구 %{#devtools}%

Pinia v2는 더 이상 Vue Devtools v5를 사용하지 않으며, Vue Devtools v6을 필요로 합니다. 확장 프로그램의 **beta 채널**에 대한 다운로드 링크는 [Vue Devtools 문서](https://devtools.vuejs.org/guide/installation.html#chrome)에서 찾을 수 있습니다.

## Nuxt %{#nuxt}%

Nuxt를 사용하는 경우, pinia는 이제 고유한 Nuxt 패키지를 가지고 있습니다. 다음과 같이 설치하세요:

```bash
npm i @pinia/nuxt
# 또는 yarn을 사용하는 경우
yarn add @pinia/nuxt
```

또한 **`@nuxtjs/composition-api` 패키지를 업데이트**해야 합니다.

그런 다음, `nuxt.config.js` 및 TypeScript를 사용하는 경우 `tsconfig.json`을 수정하세요:

```js
// nuxt.config.js
module.exports {
  buildModules: [
    '@nuxtjs/composition-api/module',
    'pinia/nuxt', // [!code --]
    '@pinia/nuxt', // [!code ++]
  ],
}
```

```json
// tsconfig.json
{
  "types": [
    // ...
    "pinia/nuxt/types" // [!code --]
    "@pinia/nuxt" // [!code ++]
  ]
}
```

또한 [전용 Nuxt 섹션](../ssr/nuxt.md)을 읽는 것을 권장합니다.
