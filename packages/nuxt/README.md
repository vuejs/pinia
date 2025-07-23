# `@pinia/nuxt`

> Nuxt module for Pinia

## Automatic Installation

Use `nuxi` to automatically add this module to your Nuxt project:

```shell
npx nuxi@latest module add pinia
```

## Manual Installation

Add dependencies to your Nuxt project:

```shell
npm i pinia @pinia/nuxt
```

Enable the `@pinia/nuxt` module in `nuxt.config.ts`:

```js
export default defineNuxtConfig({
    modules: ['@pinia/nuxt'],
})
```

## Configuring the Module

By default, this module adds `stores` folder to auto imports, in which you can organize code related to Pinia stores in one place.
> [!TIP]
> In the new directory structure introduced since Nuxt 4, this directory is `app/stores`.

You can customize this behaviour using the `pinia` property in `nuxt.config.ts`:

```js
export default defineNuxtConfig({
    modules: ['@pinia/nuxt'],
    // configure the module using `pinia` property
    pinia: {
      /**
       * Automatically add stores dirs to the auto imports. This is the same as
       * directly adding the dirs to the `imports.dirs` option. If you want to
       * also import nested stores, you can use the glob pattern `./stores/**`
       * (on Nuxt 3) or `app/stores/**` (on Nuxt 4+)
       *
       * @default `['stores']`
       */
        storesDirs: []
    }
})
```

## License

[MIT](http://opensource.org/licenses/MIT)
