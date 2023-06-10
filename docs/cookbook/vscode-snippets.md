# VSCode Snippets

다음은 개발을 더 쉽게 만들기 위해 VSCode에 사용한 일부 스니펫입니다.

Manage user snippets with <kbd>⇧</kbd> <kbd>⌘</kbd> <kbd>P</kbd> / <kbd>⇧</kbd> <kbd>⌃</kbd> <kbd>P</kbd> and then `Snippets: Configure User Snippets`.

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
