#!/bin/bash

# check for netlify to skip deploy
# needed because we cannot use && in netlify.toml

# exit 0 will skip the build while exit 1 will build

git diff --quiet 'HEAD^' HEAD . && git diff --quiet 'HEAD^' HEAD ../pinia
