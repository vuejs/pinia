#!/bin/bash

# check if doc files changes for netlify
# needed because we cannot use && in netlify.toml

# exit 0 will skip the build while exit 1 will build

git diff --quiet 'HEAD^' HEAD ./packages/docs/ && ! git diff 'HEAD^' HEAD ./yarn.lock | grep --quiet vite && git diff --quiet 'HEAD^' HEAD netlify.toml
