# Editable HTML Poster

A modern web application for creating and editing HTML posters with a visual, drag-and-drop interface. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎨 Visual Editor
- **720×720px fixed canvas** for consistent poster sizing
- **Drag-and-drop** element positioning with `react-draggable`
- **Real-time visual feedback** with element selection highlighting
- **Zoom and pan** capabilities for detailed editing

### 📝 Element Management
- **Text Elements**: Add, edit, and style text with inline editing
- **Image Elements**: Upload images via URL or file upload
- **Element Properties**: Comprehensive property panel for styling
- **Element Deletion**: Delete elements with keyboard shortcuts or UI buttons

### 🔧 Text Editing
- **Inline text editing** with double-click activation
- **Font customization**: size, weight, color
- **Background color** support
- **Real-time preview** of changes

### 🖼️ Image Editing
- **Image replacement** via URL or file upload
- **Alt text management** for accessibility
- **Size adjustment** with width/height controls
- **Drag-and-drop positioning**

### 📥 HTML Import/Export
- **HTML file upload** with sanitization using DOMPurify
- **Paste HTML** directly into the editor
- **Export to HTML** with proper structure and metadata
- **Safe HTML parsing** with XSS protection

### 🎯 User Experience
- **Properties Panel**: Edit element properties in real-time
- **Keyboard Shortcuts**: Delete key for element removal
- **Visual Selection**: Clear element highlighting
- **Responsive Design**: Works on different screen sizes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: react-draggable
- **HTML Sanitization**: DOMPurify
- **Architecture**: SOLID principles

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd editable-html-poster
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Poster

1. **Add Elements**: Use the toolbar to add text or image elements
2. **Position Elements**: Drag elements to desired positions on the canvas
3. **Edit Properties**: Select an element and use the properties panel to customize
4. **Text Editing**: Double-click text elements for inline editing
5. **Export**: Click "Export HTML" to download your poster

### Importing HTML

1. **Upload File**: Click "Upload File" to select an HTML file
2. **Paste HTML**: Click "Import HTML" to paste HTML directly
3. **Edit Elements**: Imported elements become editable in the canvas

### Keyboard Shortcuts

- **Delete**: Remove selected element
- **Double-click**: Edit text elements inline

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Main application
├── components/
│   ├── Toolbar.tsx        # Top toolbar with controls
│   ├── Stage.tsx          # Main canvas area
│   └── PropertiesPanel.tsx # Element properties editor
├── types/
│   └── index.ts           # TypeScript interfaces
└── utils/
    └── htmlParser.ts      # HTML import/export utilities
```

## Key Components

### Stage Component
- 720×720px fixed canvas
- Element rendering with absolute positioning
- Drag-and-drop functionality
- Element selection handling

### Properties Panel
- Real-time property editing
- Support for text and image properties
- Color pickers and input controls
- Element deletion

### HTML Parser
- Safe HTML sanitization
- Element extraction and conversion
- Export with proper structure
- XSS protection

## Features in Detail

### Element Types
- **Text**: Editable text with font styling
- **Image**: Images with URL and alt text support
- **Div**: Generic containers for layout

### Styling Options
- Position (x, y coordinates)
- Size (width, height)
- Font properties (size, weight, color)
- Background color
- Z-index for layering

### Import/Export
- **Import**: Parse HTML and convert to editable elements
- **Export**: Generate clean HTML with metadata
- **Sanitization**: Remove potentially dangerous content
- **Structure**: Maintain element hierarchy and styling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling
- react-draggable for drag-and-drop functionality
- DOMPurify for HTML sanitization