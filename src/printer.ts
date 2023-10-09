import { AstPath, Doc } from "prettier";

/**
 * Returns a `Doc` representation of the given AST `path`.
 * @param path The AST path to print.
 * @returns A `Doc` representation of the AST node.
 * @throws An error if the AST node type is unknown.
 */
export const print = (path: AstPath): Doc => {
  const node = path.getValue();

  switch (node.type) {
    case "blade-formatter": {
      return node.body;
    }
  }

  throw new Error(`Unknown node type: ${node.type}`);
};
