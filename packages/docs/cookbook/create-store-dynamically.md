# Create Store Dynamically

Store can be created dynamically using factory pattern. Which will greatly help reduce boilerplate and structure your application.

## Example

An usecase of multiple tables that require pagination and filter. And all need to have separate stores to keep track of the result and pagings.

We can have a creator function like this

```js
export const createPagingStore = (endpoint) => {
  const currentPage = ref(0)
  const totalPage = ref(0)
  const tableContent = ref()
  const fetchData = async (page) => {
    const data = await api.get(`https://example.com/${endpoint}?page=${page}`)
    currentPage.value = page
    totalPage.value = data.totalPage
    tableContent = data.content
  }

  return {currentPage, totalPage, tableContent, fetchData}
}
```

Inside the `defineStore` option function you will have access to all the state and actions, and extra logic as needed.

```js

export const usePagingWeather = defineStore('pagingWeather, () => {
  const pagingStore = createPagingStore('weather')
  
  // Extra logics for this store
  const sundays = computed(() => {
    return pagingStore.tableContent.days.filter(day === 'sunday')
  })

  return {
    ...pagingStore,
    sundays,
  }
})
```

Don't worry about the same `ref`'s inside multiple store to be the same. They are handled by `pinia` as separate states in the stores.
