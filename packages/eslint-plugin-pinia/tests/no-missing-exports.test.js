const rule = require("../src/rules/no-missing-exports");
const { RuleTester } = require("eslint");

const tester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: "module" }
});

tester.run("no-missing-exports", rule, {
  valid: [
    `
    export const useX = defineStore('x', () => {
      const a = 1;
      return { a };
    });
    `
  ],
  invalid: [
    {
      code: `
      export const useX = defineStore('x', () => {
        const a = 1;
        const b = 2;
        return { a };
      });
      `,
      errors: [{ message: "Variable 'b' is declared but not exported via return()" }]
    }
  ]
});
