// Recursively extract all "text" fields from ProseMirror/Tiptap JSON
function extractTextFromJSON(content) {
  let text = "";

  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node.type && node.content) {
      walk(node.content);
    } else if (node.text) {
      text += " " + node.text;
    }
  }

  let jsonData = typeof content === "string" ? JSON.parse(content) : content;
  walk(jsonData);
  return text.trim();
}


function generateTagsWithCount(text) {
  const commonWords = ["the", "and", "is", "in", "to", "of", "for", "a", "on", "it", "as", "at", "by", "an", "be", "are", "was", "were", "that", "this", "from"];
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

  const tagMap = {};
  words.forEach(word => {
    if (!commonWords.includes(word)) {
      tagMap[word] = (tagMap[word] || 0) + 1;
    }
  });

  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export { extractTextFromJSON, generateTagsWithCount };