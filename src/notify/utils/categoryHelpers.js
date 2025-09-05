//src/notify/utils/categoryHelpers.js

export function buildTree(categories) {
  const tree = {};
  categories.forEach((c) => {
    if (!tree[c.parentName]) tree[c.parentName] = [];
    tree[c.parentName].push(c.name);
  });
  return tree;
}
