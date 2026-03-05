const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
    { target: /#f8fafc/g, replacement: '#0f172a' },
    { target: /#cbd5e1/g, replacement: '#64748b' },
    { target: /#94a3b8/g, replacement: '#64748b' }, // Optional: slightly darker gray for light mode
    { target: /rgba\(15, 23, 42, 0.6\)/g, replacement: '#ffffff' }, // Fallback if inline
    { target: /rgba\(255, 255, 255, 0.05\)/g, replacement: 'rgba(0, 0, 0, 0.02)' }, // borders
    { target: /rgba\(255,255,255,0.05\)/g, replacement: 'rgba(0, 0, 0, 0.02)' },
    { target: /rgba\(255, 255, 255, 0.1\)/g, replacement: 'rgba(0, 0, 0, 0.05)' },
    { target: /#e2e8f0/g, replacement: '#1e293b' } // Make light text dark
];

function processDirectory(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                processDirectory(filePath);
            } else if (file.endsWith('.tsx') && (
                file.includes('attendance') ||
                file.includes('punch-') ||
                file.includes('break') ||
                file.includes('overtime') ||
                file.includes('week-off') ||
                file.includes('absent-')
            )) {
                let content = fs.readFileSync(filePath, 'utf8');
                let modified = false;

                replacements.forEach(rule => {
                    if (rule.target.test(content)) {
                        content = content.replace(rule.target, rule.replacement);
                        modified = true;
                    }
                });

                if (modified) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated colors in ${file}`);
                }
            }
        });
    });
}

processDirectory(directoryPath);
