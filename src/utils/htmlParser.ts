import DOMPurify from 'dompurify';
import { ElementData } from '@/types';

export function parseHTMLToElements(html: string): ElementData[] {
  // Sanitize the HTML
  const sanitizedHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'img', 'a', 'strong', 'em', 'br'],
    ALLOWED_ATTR: ['src', 'alt', 'href', 'style', 'class', 'id']
  });

  // Create a temporary DOM element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = sanitizedHTML;

  const elements: ElementData[] = [];
  let zIndex = 1;
  let currentY = 20; // Start position

  function parseNode(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // Skip script, style, and other non-visual elements
      if (['script', 'style', 'meta', 'title', 'head', 'body', 'html'].includes(tagName)) {
        return;
      }

      // Handle text elements
      if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'].includes(tagName)) {
        const textContent = element.textContent?.trim();
        if (textContent) {
          // Parse inline styles if present
          const inlineStyle = element.getAttribute('style') || '';
          const fontSize = inlineStyle.match(/font-size:\s*(\d+)px/)?.[1] || '16';
          const color = inlineStyle.match(/color:\s*([^;]+)/)?.[1] || '#000000';
          const fontWeight = inlineStyle.match(/font-weight:\s*([^;]+)/)?.[1] || 'normal';
          const backgroundColor = inlineStyle.match(/background-color:\s*([^;]+)/)?.[1] || 'transparent';
          
          elements.push({
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'text',
            content: textContent,
            style: {
              position: 'absolute',
              left: 20,
              top: currentY,
              width: 200,
              height: 50,
              fontSize: parseInt(fontSize),
              color: color,
              fontWeight: fontWeight,
              backgroundColor: backgroundColor,
              border: 'none',
              zIndex: zIndex++
            }
          });
          
          currentY += 60; // Move down for next element
        }
      }

      // Handle image elements
      if (tagName === 'img') {
        const src = element.getAttribute('src');
        const alt = element.getAttribute('alt') || '';
        if (src) {
          elements.push({
            id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'image',
            src,
            alt,
            style: {
              position: 'absolute',
              left: 20,
              top: currentY,
              width: 200,
              height: 150,
              fontSize: 16,
              color: '#000000',
              fontWeight: 'normal',
              backgroundColor: 'transparent',
              border: 'none',
              zIndex: zIndex++
            }
          });
          
          currentY += 170; // Move down for next element
        }
      }

      // Recursively parse child nodes
      Array.from(element.childNodes).forEach(childNode => {
        parseNode(childNode);
      });
    }
  }

  // Parse all child nodes
  Array.from(tempDiv.childNodes).forEach(node => {
    parseNode(node);
  });

  return elements;
}

export function exportElementsToHTML(elements: ElementData[]): string {
  const htmlContent = elements
    .sort((a, b) => a.style.zIndex - b.style.zIndex)
    .map(element => {
      const style = Object.entries(element.style)
        .filter(([key, value]) => key !== 'zIndex' && value !== undefined)
        .map(([key, value]) => {
          if (key === 'rotation') {
            return `transform: rotate(${value}deg)`;
          }
          return `${key}: ${value}`;
        })
        .join('; ');

      if (element.type === 'text') {
        return `<div style="${style}">${element.content}</div>`;
      } else if (element.type === 'image') {
        return `<img src="${element.src}" alt="${element.alt || ''}" style="${style}" />`;
      } else {
        return `<div style="${style}">${element.content || ''}</div>`;
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta data-generated-by="editable-html-poster" />
    <title>Generated HTML Poster</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .poster-container {
            width: 720px;
            height: 720px;
            position: relative;
            background-color: white;
            border: 1px solid #ddd;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="poster-container">
        ${htmlContent}
    </div>
</body>
</html>`;
}
