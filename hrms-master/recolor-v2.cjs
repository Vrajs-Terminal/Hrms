/**
 * Recolor script - converts all remaining dark-mode to light-mode
 * in attendance TSX files.
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');

// All attendance-related TSX files
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
    // Dark backgrounds to white
    [/rgba\(15,\s*23,\s*42,\s*0\.95\)/g, '#ffffff'],
    [/rgba\(15,\s*23,\s*42,\s*0\.9\)/g, '#ffffff'],
    [/rgba\(15,\s*23,\s*42,\s*0\.8\)/g, '#ffffff'],
    [/rgba\(15,\s*23,\s*42,\s*0\.666\)/g, '#ffffff'],
    [/rgba\(15,\s*23,\s*42,\s*0\.6\)/g, '#f8fafc'],
    [/rgba\(15,\s*23,\s*42,\s*0\.5\)/g, '#f8fafc'],

    // Semi-transparent borders to solid
    [/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, '#e2e8f0'],
    [/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, '#f1f5f9'],
    [/rgba\(255,\s*255,\s*255,\s*0\.15\)/g, '#e2e8f0'],
    [/rgba\(255,\s*255,\s*255,\s*0\.2\)/g, '#cbd5e1'],

    // Dark text color issues
    [/color:\s*'white'/g, "color: '#1e293b'"],
    [/color:\s*"white"/g, 'color: "#1e293b"'],
    [/color:\s*'#fff'/g, "color: '#1e293b'"],
    [/color:\s*'#e2e8f0'/g, "color: '#1e293b'"],
    [/color:\s*'#f1f5f9'/g, "color: '#0f172a'"],
    [/color:\s*'#cbd5e1'/g, "color: '#64748b'"],

    // Transparent background to white for cards
    [/rgba\(0,\s*0,\s*0,\s*0\.02\)/g, '#f8fafc'],
    [/rgba\(0,\s*0,\s*0,\s*0\.05\)/g, '#e2e8f0'],

    // Fix border-left dark separators in month grid
    [/borderLeft:\s*'1px solid rgba\(255,255,255,0\.1\)'/g, "borderLeft: '1px solid #e2e8f0'"],
    [/border-left:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.1\)/g, "border-left: 1px solid #e2e8f0"],
    [/borderRight:\s*'2px solid rgba\(0,\s*0,\s*0,\s*0\.05\)!important'/g, "borderRight: '2px solid #e2e8f0'"],
];

let totalChanges = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let fileChanges = 0;

    replacements.forEach(([pattern, replacement]) => {
        const matches = content.match(pattern);
        if (matches) {
            fileChanges += matches.length;
            content = content.replace(pattern, replacement);
        }
    });

    if (fileChanges > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`✓ ${file}: ${fileChanges} replacements`);
        totalChanges += fileChanges;
    }
});

console.log(`\nDone! Total changes: ${totalChanges}`);
