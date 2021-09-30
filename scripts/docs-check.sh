#!/bin/bash

# check if doc files changes for netlify
# needed because we cannot use && in netlify.toml

# exit 0 will skip the build while exit 1 will build

# - check any change in docs
# - check for new version of vite related deps
# - changes in netlify conf
# - a commit message that starts with docs like docs: ... or docs(nuxt): ...

git diff --quiet 'HEAD^' HEAD ./packages/docs/ && ! git diff 'HEAD^' HEAD ./yarn.lock | grep --quiet vite && git diff --quiet 'HEAD^' HEAD netlify.toml && ! git log -1 --pretty=%B | grep '^docs'
