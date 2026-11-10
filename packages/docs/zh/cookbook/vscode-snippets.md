# VS Code 代码片段

<!-- <RuleKitLink /> -->

这些是我在 VS Code 中使用的一些代码片段，可以让我的工作更轻松。

通过 <kbd>⇧ Shift</kbd>+<kbd>⌘ Command</kbd>+<kbd>P</kbd> / <kbd>⇧ Shift</kbd>+<kbd>⌃ Control</kbd>+<kbd>P</kbd> 然后输入 `Snippets: Configure User Snippets` 就可以管理用户代码片段。

```json
{
  "Pinia Options Store Boilerplate": {
    "scope": "javascript,typescript",
    "prefix": "pinia-options",
    "body": [
      "import { defineStore, acceptHMRUpdate } from 'pinia'",
      "",
      "export const use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store = defineStore('$TM_FILENAME_BASE', {",
      " state: () => ({",
      "   $0",
      " }),",
      " getters: {},",
      " actions: {},",
      "})",
      "",
      "if (import.meta.hot) {",
      " import.meta.hot.accept(acceptHMRUpdate(use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store, import.meta.hot))",
      "}",
      ""
    ],
    "description": "Bootstrap the code needed for a Vue.js Pinia Options Store file"
  },
  "Pinia Setup Store Boilerplate": {
    "scope": "javascript,typescript",
    "prefix": "pinia-setup",
    "body": [
      "import { defineStore, acceptHMRUpdate } from 'pinia'",
      "",
      "export const use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store = defineStore('$TM_FILENAME_BASE', () => {",
      " $0",
      " return {}",
      "})",
      "",
      "if (import.meta.hot) {",
      " import.meta.hot.accept(acceptHMRUpdate(use${TM_FILENAME_BASE/^(.*)$/${1:/pascalcase}/}Store, import.meta.hot))",
      "}",
      ""
    ],
    "description": "Bootstrap the code needed for a Vue.js Pinia Setup Store file"
  }
}
```
