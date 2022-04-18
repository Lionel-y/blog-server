export function tocTokens2HTML(tokens) {
  let html = '<ul>',
    index = 0,
    level = 1;
  const levelStack = ['</ul>'];

  const tokensLength = tokens.length;
  if (!tokensLength) return '';
  while (index < tokensLength) {
    if (tokens[index].level == level) {
      if (levelStack[levelStack.length - 1] == '</li>') {
        html += levelStack.pop(); // html += '</li>'
      }
      html += `<li><a href="#${tokens[index].anchor}" index="${index}">${tokens[index].text}</a>`;

      levelStack.push(`</li>`);
      index++;
    } else if (tokens[index].level > level) {
      if (levelStack[levelStack.length - 1] == '</ul>') {
        html += `<li><ul>`;
        levelStack.push(`</li>`);
        levelStack.push(`</ul>`);
      } else {
        html += `<ul>`;
        levelStack.push('</ul>');
      }
      level++;
    } else {
      for (let i = (level - tokens[index].level) * 2 + 1; i > 0; i--) {
        html += levelStack.pop();
      }
      level = tokens[index].level;
    }
  }
  for (let i = levelStack.length; i > 0; i--) {
    html += levelStack.pop();
  }
  return html;
}
