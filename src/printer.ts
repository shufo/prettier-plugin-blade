import { AstPath, Doc } from "prettier";

export const print = (path: AstPath): Doc => {
  const node = path.getValue();

  switch (node.type) {
    case "blade-formatter": {
      return node.body;
    }
  }

  throw new Error(`Unknown node type: ${node.type}`);
};
