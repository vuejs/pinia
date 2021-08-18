import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import kebabcase from 'lodash.kebabcase'

const viewModules = import.meta.glob('./views/*.vue')

const nameFromPath = (path: string) => path.replace(/^.*\/(\w+)\.vue$/, '$1')

const pages: RouteRecordRaw[] = Object.keys(viewModules).map((path) => {
  const name = nameFromPath(path)
  return {
    name,
    path: name === '404' ? '/:patchMatch(.*)*' : '/' + kebabcase(name),
    component: viewModules[path],
    meta: {
      hide: name === '404',
    },
  }
})

export const router = createRouter({
  history: createWebHistory(),
  routes: [...pages],
})
