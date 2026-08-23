/**
 * Keep historical heading text and relative hierarchy while preventing a body
 * heading from skipping levels after the article's h1.
 */
export function rehypeNormalizeHeadings() {
  return (tree) => {
    let previousDepth = 1;

    function visit(node) {
      if (node?.type === 'element') {
        const match = /^h([1-6])$/.exec(node.tagName);
        if (match) {
          const originalDepth = Number(match[1]);
          const depth = Math.min(originalDepth, previousDepth + 1);
          if (depth !== originalDepth) {
            node.tagName = `h${depth}`;
            node.properties ??= {};
            node.properties.dataOriginalHeading = String(originalDepth);
          }
          previousDepth = depth;
        }
      }

      for (const child of node?.children ?? []) visit(child);
    }

    visit(tree);
  };
}
