const fs = require('fs');
const path = require('path');

const srcDir = './';
const destDir = './react-frontend/src/pages';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function convertHtmlToTsx(htmlContent, fileName) {
    const componentName = fileName
        .replace('.html', '')
        .split(/[-_]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    // Extract body content - simple regex as these are basic HTML files
    let bodyContent = htmlContent;
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        bodyContent = bodyMatch[1];
    }

    // Remove script tags
    bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Replace class= with className=
    bodyContent = bodyContent.replace(/class=/g, 'className=');

    // Replace for= with htmlFor=
    bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');
    
    // Replace inline styles with objects (very hacky regex for basic cases)
    bodyContent = bodyContent.replace(/style='([^']+)'/g, (match, p1) => {
        let styleObj = {};
        p1.split(';').forEach(s => {
            if (!s.trim()) return;
            let [k, v] = s.split(':');
            if (k && v) {
                // to camelCase
                k = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObj[k] = v.trim();
            }
        });
        return `style={${JSON.stringify(styleObj)}}`;
    });

    bodyContent = bodyContent.replace(/style="([^"]+)"/g, (match, p1) => {
        let styleObj = {};
        p1.split(';').forEach(s => {
            if (!s.trim()) return;
            let [k, v] = s.split(':');
            if (k && v) {
                // to camelCase
                k = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                styleObj[k] = v.trim();
            }
        });
        return `style={${JSON.stringify(styleObj)}}`;
    });

    // Self close tags
    const voidElementList = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    voidElementList.forEach(tag => {
        const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, 'gi');
        bodyContent = bodyContent.replace(regex, `<${tag}$1 />`);
    });

    // Replace hrefs
    bodyContent = bodyContent.replace(/href=['"](.*?).html['"]/gi, (match, p1) => {
        if(p1 === 'index') return `href="/"`;
        return `href="/${p1}"`;
    });

    const tsxTemplate = `
import React, { useEffect } from 'react';
import '../styles.css';

const ${componentName} = () => {
    useEffect(() => {
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileMenu && navLinks) {
            const toggleMenu = () => {
                navLinks.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            };
            const handleClick = (e: MouseEvent) => e.preventDefault();
            mobileMenu.addEventListener('click', toggleMenu);
            return () => {
                mobileMenu.removeEventListener('click', toggleMenu);
            };
        }
    }, [])
    
    return (
        <>
            ${bodyContent}
        </>
    );
};

export default ${componentName};
`;

    return { componentName, tsxTemplate };
}

const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

const components = [];

htmlFiles.forEach(file => {
    const htmlContent = fs.readFileSync(path.join(srcDir, file), 'utf8');
    try {
        const { componentName, tsxTemplate } = convertHtmlToTsx(htmlContent, file);
        fs.writeFileSync(path.join(destDir, `${componentName}.tsx`), tsxTemplate);
        components.push({ componentName, route: file === 'index.html' ? '/' : `/${file.replace('.html', '')}` });
        console.log(`Converted ${file} to ${componentName}.tsx`);
    } catch (e) {
        console.error(`Failed to convert ${file}: ${e.message}`);
    }
});

fs.writeFileSync('./react-frontend/src/pagesList.json', JSON.stringify(components, null, 2));

console.log("Done generating components.");
