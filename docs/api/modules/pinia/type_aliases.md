# Type Aliases (타입 별칭) %{#type-aliases}%

## PiniaStorePlugin

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](/api/modules/pinia/interfaces/PiniaPlugin.md)

모든 스토어를 확장하는 플러그인.

**`이제 사용되지 않음`**

대신에 PiniaPlugin 사용을 사용하십시오.

## StateTree

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

스토어의 제네릭(Generic) 상태.

## Store

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](/api/modules/pinia/interfaces/_StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & [`_StoreWithGetters`](#storewithgetters)<`G`\> & [`_ActionsTree`](#actionstree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](/api/modules/pinia/interfaces/PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](/api/modules/pinia/interfaces/PiniaCustomStateProperties.md)<`S`\>

스토어를 만들기 위한 스토어의 타입.

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](#statetree) = {} |
| `G` | {} |
| `A` | {} |

## StoreActions

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](#store)<`string`, [`StateTree`](#statetree), [`_GettersTree`](#getterstree)<[`StateTree`](#statetree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](#extractactionsfromsetupstore)<`SS`\>

스토어 유형의 액션을 추출합니다. 셋업 스토어 또는 옵션 스토어 모두에서 작동합니다.

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## StoreGeneric

Ƭ **StoreGeneric**: [`Store`](#store)<`string`, [`StateTree`](#statetree), [`_GettersTree`](#getterstree)<[`StateTree`](#statetree)\>, [`_ActionsTree`](#actionstree)\>

스토어의 제네릭 및 type-unsafe 버전입니다.
문자열 접근에 실패하지 않으므로,
전달되는 스토어의 종류를 신경 쓰지 않는 제네릭 함수를 훨씬 쉽게 작성할 수 있습니다.

## StoreGetters

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](#store)<`string`, [`StateTree`](#statetree), infer G, [`_ActionsTree`](#actionstree)\> ? [`_StoreWithGetters`](#storewithgetters)<`G`\> : [`_ExtractGettersFromSetupStore`](#extractgettersfromsetupstore)<`SS`\>

스토어 유형의 getter를 추출합니다.
셋업 스토어 또는 옵션 스토어 모두에서 작동합니다.

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## StoreOnActionListener

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](#actionstree) : `A`\>) => `void`

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](#statetree) |
| `G` | `G` |
| `A` | `A` |

### Type declaration

▸ (`context`): `void`

Argument of `store.$onAction()`

#### Parameters

| 이름 | 타입 |
| :------ | :------ |
| `context` | [`StoreOnActionListenerContext`](#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](#actionstree) : `A`\> |

#### Returns

`void`

## StoreOnActionListenerContext

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](#actionstree) extends `A` ? [`_StoreOnActionListenerContext`](/api/modules/pinia/interfaces/_StoreOnActionListenerContext.md)<[`StoreGeneric`](#storegeneric), `string`, [`_ActionsTree`](#actionstree)\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](#statetree) |
| `G` | `G` |
| `A` | `A` |

## StoreState

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](#store)<`string`, infer S, [`_GettersTree`](#getterstree)<[`StateTree`](#statetree)\>, [`_ActionsTree`](#actionstree)\> ? `UnwrapRef`<`S`\> : [`_ExtractStateFromSetupStore`](#extractstatefromsetupstore)<`SS`\>

스토어 유형의 상태를 추출합니다.
셋업 스토어 또는 옵션 스토어 모두에서 작동합니다.
이것은 refs를 언래핑합니다.

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## SubscriptionCallback

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

### 타입 파라미터

| 이름 |
| :------ |
| `S` |

### Type declaration

▸ (`mutation`, `state`): `void`

Callback of a subscription

#### Parameters

| 이름 | 타입 |
| :------ | :------ |
| `mutation` | [`SubscriptionCallbackMutation`](#subscriptioncallbackmutation)<`S`\> |
| `state` | `UnwrapRef`<`S`\> |

#### Returns

`void`

## SubscriptionCallbackMutation

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](/api/modules/pinia/interfaces/SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](/api/modules/pinia/interfaces/SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](/api/modules/pinia/interfaces/SubscriptionCallbackMutationPatchFunction.md)

Context object passed to a subscription callback.

### 타입 파라미터

| 이름 |
| :------ |
| `S` |

## \_ActionsTree

Ƭ **\_ActionsTree**: `Record`<`string`, [`_Method`](#method)\>

Type of an object of Actions. For internal usage only.
For internal use **only**

## \_Awaited

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](#awaited)<`V`\> : `never` : `T`

### 타입 파라미터

| 이름 |
| :------ |
| `T` |

## \_DeepPartial

Ƭ **\_DeepPartial**<`T`\>: { [K in keyof T]?: \_DeepPartial<T[K]\> }

Recursive `Partial<T>`. Used by [['$patch']](#store).

For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `T` |

## \_ExtractActionsFromSetupStore

Ƭ **\_ExtractActionsFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](#extractactionsfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractActionsFromSetupStore_Keys`](#extractactionsfromsetupstore_keys)<`SS`\>\> : `never`

For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## \_ExtractActionsFromSetupStore\_Keys

Ƭ **\_ExtractActionsFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## \_ExtractGettersFromSetupStore

Ƭ **\_ExtractGettersFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](#extractgettersfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractGettersFromSetupStore_Keys`](#extractgettersfromsetupstore_keys)<`SS`\>\> : `never`

For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## \_ExtractGettersFromSetupStore\_Keys

Ƭ **\_ExtractGettersFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## \_ExtractStateFromSetupStore

Ƭ **\_ExtractStateFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](#extractstatefromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](#unwrapall)<`Pick`<`SS`, [`_ExtractStateFromSetupStore_Keys`](#extractstatefromsetupstore_keys)<`SS`\>\>\> : `never`

For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## \_ExtractStateFromSetupStore\_Keys

Ƭ **\_ExtractStateFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

Type that enables refactoring through IDE.
For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |

## \_GettersTree

Ƭ **\_GettersTree**<`S`\>: `Record`<`string`, (`state`: `UnwrapRef`<`S`\> & `UnwrapRef`<[`PiniaCustomStateProperties`](/api/modules/pinia/interfaces/PiniaCustomStateProperties.md)<`S`\>\>) => `any` \| () => `any`\>

Type of an object of Getters that infers the argument. For internal usage only.
For internal use **only**

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `S` | extends [`StateTree`](#statetree) |

## \_MapActionsObjectReturn

Ƭ **\_MapActionsObjectReturn**<`A`, `T`\>: { [key in keyof T]: A[T[key]] }

For internal use **only**

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `A`\> |

## \_MapActionsReturn

Ƭ **\_MapActionsReturn**<`A`\>: { [key in keyof A]: A[key] }

For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `A` |

## \_MapStateObjectReturn

Ƭ **\_MapStateObjectReturn**<`Id`, `S`, `G`, `A`, `T`\>: { [key in keyof T]: Function }

For internal use **only**

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](#statetree) |
| `G` | extends [`_GettersTree`](#getterstree)<`S`\> |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](#store)<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

## \_MapStateReturn

Ƭ **\_MapStateReturn**<`S`, `G`, `Keys`\>: { [key in Keys]: Function }

For internal use **only**

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `S` | extends [`StateTree`](#statetree) |
| `G` | extends [`_GettersTree`](#getterstree)<`S`\> |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

## \_MapWritableStateObjectReturn

Ƭ **\_MapWritableStateObjectReturn**<`S`, `T`\>: { [key in keyof T]: Object }

For internal use **only**

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `S` | extends [`StateTree`](#statetree) |
| `T` | extends `Record`<`string`, keyof `S`\> |

## \_MapWritableStateReturn

Ƭ **\_MapWritableStateReturn**<`S`\>: { [key in keyof S]: Object }

For internal use **only**

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `S` | extends [`StateTree`](#statetree) |

## \_Method

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

### Type declaration

▸ (...`args`): `any`

Generic type for a function that can infer arguments and return type

For internal use **only**

#### Parameters

| 이름 | 타입 |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`any`

## \_Spread

Ƭ **\_Spread**<`A`\>: `A` extends [infer L, ...(infer R)] ? [`_StoreObject`](#storeobject)<`L`\> & [`_Spread`](#spread)<`R`\> : `unknown`

For internal use **only**.

### 타입 파라미터

| 이름 | 타입 |
| :------ | :------ |
| `A` | extends readonly `any`[] |

## \_StoreObject

Ƭ **\_StoreObject**<`S`\>: `S` extends [`StoreDefinition`](./interfaces/StoreDefinition.md)<infer Ids, infer State, infer Getters, infer Actions\> ? { [Id in \`${Ids}${MapStoresCustomization extends Record<"suffix", infer Suffix extends string\> ? Suffix : "Store"}\`]: Function } : {}

For internal use **only**.

### 타입 파라미터

| 이름 |
| :------ |
| `S` |

## \_StoreWithActions

Ƭ **\_StoreWithActions**<`A`\>: { [k in keyof A]: A[k] extends Function ? Function : never }

Store augmented for actions. For internal usage only.
For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `A` |

## \_StoreWithGetters

Ƭ **\_StoreWithGetters**<`G`\>: { readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]\> }

Store augmented with getters. For internal usage only.
For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `G` |

## \_UnwrapAll

Ƭ **\_UnwrapAll**<`SS`\>: { [K in keyof SS]: UnwrapRef<SS[K]\> }

Type that enables refactoring through IDE.
For internal use **only**

### 타입 파라미터

| 이름 |
| :------ |
| `SS` |