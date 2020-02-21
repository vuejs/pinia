module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'yarn run lint',
    'pre-push': 'yarn run lint',
  },
}
