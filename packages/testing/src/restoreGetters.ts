import { Store, StateTree, _ExtractGettersFromSetupStore_Keys } from 'pinia'

export function restoreGetter<G>(
  store: Store<string, StateTree, G, any>,
  getter: keyof G
): void
export function restoreGetter<SS>(
  store: SS,
  getter: _ExtractGettersFromSetupStore_Keys<SS>
): void
export function restoreGetter<G>(store: Store, getter: any): void {
  // @ts-expect-error: private api
  store[getter] = undefined
}
