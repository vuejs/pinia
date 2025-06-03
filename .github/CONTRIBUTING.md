# Contributing

Contributions are welcome and will be fully credited!

We accept contributions via Pull Requests on [Github](https://github.com/vuejs/pinia).

## Pull Requests

Here are some guidelines to make the process smoother:

- **Add a test** - New features and bugfixes need tests. If you find it difficult to test, please tell us in the pull request and we will try to help you!
- **Document any change in behaviour** - Make sure the `README.md` and any other relevant documentation are kept up-to-date.
- **Run `npm test` locally** - This will allow you to go faster
- **One pull request per feature** - If you want to do more than one thing, send multiple pull requests.
- **Send coherent history** - Make sure your commits message means something
- **Consider our release cycle** - We try to follow [SemVer v2.0.0](http://semver.org/). Randomly breaking public APIs is not an option.

## Creating issues

### Bug reports

Always try to provide as much information as possible. If you are reporting a bug, try to provide a repro on [this playground](https://play.pinia.vuejs.org) (or anything else) or a stacktrace at the very least. This will help us check the problem quicker.

### Feature requests

Lay out the reasoning behind it and propose an API for it. Ideally, you should have a practical example to prove the utility of the feature you're requesting.

## Contributing Docs

All the documentation files can be found in `packages/docs`. It contains the English markdown files while translation(s) are stored in their corresponding `<lang>` sub-folder(s):

- [`zh`](https://github.com/vuejs/pinia/tree/v2/packages/docs/zh): Chinese translation.

Besides that, the `.vitepress` sub-folder contains the config and theme, including the i18n information.

Contributing to the English docs is the same as contributing to the source code. You can create a pull request to our GitHub repo. However, if you would like to contribute to the translations, there are two options and some extra steps to follow:

### Translate in a `<lang>` sub-folder and host it on our official repo

If you want to start translating the docs in a _new_ language:

1. Create the corresponding `<lang>` sub-folder for your translation.
2. Modify the i18n configuration in the `.vitepress` sub-folder.
3. Translate the docs and run the doc site to self-test locally.
4. Create a checkpoint for your language by running `pnpm run docs:translation:update <lang> [<commit>]`. A checkpoint is the hash and date of the latest commit when you do the translation. The checkpoint information is stored in the status file `packages/docs/.vitepress/translation-status.json`. _It's crucial for long-term maintenance since all the further translation sync-ups are based on their previous checkpoints._
5. Commit all the changes and create a pull request to our GitHub repo.

> [!TIP]
> When you create the checkpoint, please remember to pass the second "commit" argument as `v2` since that's the base branch of Pinia now.

We will have a paragraph at the top of each translation page that shows the translation status. That way, users can quickly determine if the translation is up-to-date or lags behind the English version.

Speaking of the up-to-date translation, we also need good long-term maintenance for every language. If you want to _update_ an existing translation:

1. See what translation you need to sync up with the original docs. There are two popular ways:
   1. Via the [GitHub Compare](https://github.com/vuejs/pinia/compare/) page, only see the changes in `packages/docs/*` from the checkpoint hash to `v2` branch. You can find the checkpoint hash for your language via the translation status file `packages/docs/.vitepress/translation-status.json`. The compare page can be directly opened with the hash as part of the URL, e.g. https://github.com/vuejs/pinia/compare/c67a5c9...v2
   2. Via a local command: `pnpm run docs:translation:compare <lang> v2`.
2. Create your own branch and start the translation update, following the previous comparison.
3. Create a checkpoint for your language by running `pnpm run docs:translation:update <lang> v2`.
4. Commit all the changes and create a pull request to our GitHub repo.

<!-- TODO: add an example once we have got one -->

> [!TIP]
> Before you create the new checkpoint, please remember fetch the latest v2 branch ahead.

### Self-host the translation

You can also host the translation on your own. To create one, fork our GitHub repo and change the content and site config in `packages/docs`. To long-term maintain it, we _highly recommend_ a similar way that we do above for our officially hosted translations:

- Ensure you maintain the _checkpoint_ properly. Also, ensure the _translation status_ is well-displayed on the top of each translation page.
- Utilize the diff result between the latest official repository and your own checkpoint to guide your translation.

Tip: you can add the official repo as a remote to your forked repo. This way, you can still run `pnpm run docs:translation:update <lang> [<commit>]` and `npm run docs:translation:compare <lang> [<commit>]` to get the checkpoint and diff result:

```bash
# prepare the upstream remote
git remote add upstream git@github.com:vuejs/pinia.git
git fetch upstream v2

# set the checkpoint
pnpm run docs:translation:update <lang> upstream/v2

# get the diff result
pnpm run docs:translation:compare <lang> upstream/v2
```

<!-- TODO: add an example once we have got one -->

### Translating Search text

The search box is powered by Algolia and you will need to translate the properties. Inspire yourself from `.vitepress/config/zh.ts` `zhSearch` variable.
