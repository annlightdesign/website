const fs = require('fs');
const html = fs.readFileSync('test_dom.html', 'utf8');
const matches = html.match(/style=\"[^\"]*background-image[^\"]*\"/g);
console.log(matches);
