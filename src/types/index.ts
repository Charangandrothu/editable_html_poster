export interface ElementData {
  id: string;
  type: 'text' | 'image' | 'div';
  content?: string;
  src?: string;
  alt?: string;
  style: {
    position: 'absolute';
    left: number;
    top: number;
    width?: number;
    height?: number;
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    backgroundColor?: string;
    border?: string;
    zIndex: number;
    transform?: string;
    rotation?: number;
  };
  attributes?: Record<string, string>;
}

export interface StageState {
  elements: ElementData[];
  selectedElementId: string | null;
  zoom: number;
  pan: { x: number; y: number };
}

export interface PropertiesPanelProps {
  selectedElement: ElementData | null;
  onUpdateElement: (elementId: string, updates: Partial<ElementData>) => void;
  onDeleteElement: (elementId: string) => void;
}

export interface ToolbarProps {
  onAddElement: (type: 'text' | 'image') => void;
  onImportHTML: (html: string) => void;
  onExportHTML: () => void;
}

export interface StageProps {
  elements: ElementData[];
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<ElementData>) => void;
  onDeleteElement: (elementId: string) => void;
  onAddElement: (type: 'text' | 'image') => void;
}
