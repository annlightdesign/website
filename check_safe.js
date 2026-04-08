const fs = require('fs');
const html = fs.readFileSync('test_dom.html', 'utf8');
const lines = html.split('<section');
lines.forEach(l => {
  const match = l.substring(0, 200).match(/style=\"([^\"]+)\"/);
  if (match) console.log(match[1]);
});
