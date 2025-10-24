'use client';

import { useState, useCallback } from 'react';
import { ElementData, StageState } from '@/types';
import { Toolbar } from '@/components/Toolbar';
import { Stage } from '@/components/Stage';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { parseHTMLToElements, exportElementsToHTML } from '@/utils/htmlParser';

export default function Home() {
  const [stageState, setStageState] = useState<StageState>({
    elements: [],
    selectedElementId: null,
    zoom: 1,
    pan: { x: 0, y: 0 }
  });

  const handleSelectElement = useCallback((elementId: string | null) => {
    setStageState(prev => ({ ...prev, selectedElementId: elementId }));
  }, []);

  const handleUpdateElement = useCallback((elementId: string, updates: Partial<ElementData>) => {
    setStageState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  }, []);

  const handleDeleteElement = useCallback((elementId: string) => {
    setStageState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId),
      selectedElementId: prev.selectedElementId === elementId ? null : prev.selectedElementId
    }));
  }, []);

  const handleAddElement = useCallback((type: 'text' | 'image') => {
    const newElement: ElementData = {
      id: `element-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : '',
      src: type === 'image' ? 'https://via.placeholder.com/200x150' : undefined,
      alt: type === 'image' ? 'New Image' : undefined,
      style: {
        position: 'absolute',
        left: 50,
        top: 50,
        width: type === 'image' ? 200 : 150,
        height: type === 'image' ? 150 : 50,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'normal',
        backgroundColor: type === 'text' ? 'transparent' : 'transparent',
        border: 'none',
        zIndex: stageState.elements.length + 1
      }
    };

    setStageState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedElementId: newElement.id
    }));
  }, [stageState.elements.length]);

  const handleImportHTML = useCallback((html: string) => {
    try {
      const elements = parseHTMLToElements(html);
      setStageState(prev => ({
        ...prev,
        elements: [...prev.elements, ...elements],
        selectedElementId: elements.length > 0 ? elements[elements.length - 1].id : null
      }));
    } catch (error) {
      console.error('Error parsing HTML:', error);
      alert('Error parsing HTML. Please check the format and try again.');
    }
  }, []);

  const handleExportHTML = useCallback(() => {
    try {
      const html = exportElementsToHTML(stageState.elements);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'poster.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Error exporting HTML. Please try again.');
    }
  }, [stageState.elements]);

  const selectedElement = stageState.elements.find(el => el.id === stageState.selectedElementId) || null;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Toolbar 
        onAddElement={handleAddElement}
        onImportHTML={handleImportHTML}
        onExportHTML={handleExportHTML}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-white to-gray-50">
          <div className="relative">
            <Stage
              elements={stageState.elements}
              selectedElementId={stageState.selectedElementId}
              onSelectElement={handleSelectElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
            />
            <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              720×720
            </div>
          </div>
        </div>
        
        <div className="w-96 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 shadow-xl">
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
          />
        </div>
      </div>
    </div>
  );
}