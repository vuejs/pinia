/**
 * Rule goal:
 * Warn when variables declared inside a Pinia setup store
 * are NOT returned in the final return statement.
 */

module.exports = {
    meta: {
      type: "problem",
      docs: {
        description:
          "Warn when variables declared inside a setup store are not exported via return()",
      },
      schema: [],
    },
  
    create(context) {
      return {
        ReturnStatement(node) {
          const returnedNames = new Set();
  
          // read return object properties (return { a, b })
          if (node.argument && node.argument.properties) {
            for (const prop of node.argument.properties) {
              if (prop.key && prop.key.name) {
                returnedNames.add(prop.key.name);
              }
            }
          }
  
          // find variable declarations in the same function
          const fn = context
            .getAncestors()
            .reverse()
            .find(
              (n) =>
                n.type === "FunctionDeclaration" ||
                n.type === "FunctionExpression" ||
                n.type === "ArrowFunctionExpression"
            );
  
          if (!fn || !fn.body || !fn.body.body) return;
  
          for (const stmt of fn.body.body) {
            if (stmt.type === "VariableDeclaration") {
              for (const decl of stmt.declarations) {
                const name = decl.id.name;
                if (!returnedNames.has(name)) {
                  context.report({
                    node: decl,
                    message: `Variable '${name}' is declared but not exported via return()`,
                  });
                }
              }
            }
          }
        },
      };
    },
  };
  