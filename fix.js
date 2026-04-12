const fs = require('fs');
const path = 'frontend/app/(marketing)/page.tsx';

let content = fs.readFileSync(path, 'utf8');

content = content.replace(/ reveal /g, ' ');
content = content.replace(/reveal /g, '');
content = content.replace(/ reveal/g, '');
content = content.replace(/delay-\[?[^ \]]+\]?/g, '');
content = content.replace(/  useEffect\(\(\) => \{\n\s+const observer = new IntersectionObserver\([\s\S]+?\}, \[\]\)\n/g, '');

fs.writeFileSync(path, content);
