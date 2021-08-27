#!/bin/bash

# check if doc files changes for netlify
# needed because we cannot use && in netlify.toml

git diff --quiet 'HEAD^' HEAD ./packages/docs/ && ! git diff 'HEAD^' HEAD ./yarn.lock | grep --quiet vite && git diff --quiet 'HEAD^' HEAD netlify.toml typedoc.js
