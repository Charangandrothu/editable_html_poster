'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { StageProps, ElementData } from '@/types';

export function Stage({ 
  elements, 
  selectedElementId, 
  onSelectElement, 
  onUpdateElement, 
  onDeleteElement,
  onAddElement
}: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onSelectElement(elementId);
  }, [onSelectElement]);

  const handleStageClick = useCallback(() => {
    onSelectElement(null);
  }, [onSelectElement]);

  const handleMouseDown = useCallback((elementId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return;

    setDraggedElement(elementId);
    setDragOffset({
      x: event.clientX - stageRect.left - element.style.left,
      y: event.clientY - stageRect.top - element.style.top
    });
  }, [elements]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!draggedElement || !stageRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const newX = event.clientX - stageRect.left - dragOffset.x;
    const newY = event.clientY - stageRect.top - dragOffset.y;

    // Constrain to stage boundaries
    const constrainedX = Math.max(0, Math.min(newX, 720 - (elements.find(el => el.id === draggedElement)?.style.width || 100)));
    const constrainedY = Math.max(0, Math.min(newY, 720 - (elements.find(el => el.id === draggedElement)?.style.height || 50)));

    const element = elements.find(el => el.id === draggedElement);
    if (element) {
      onUpdateElement(draggedElement, {
        style: {
          ...element.style,
          left: constrainedX,
          top: constrainedY
        }
      });
    }
  }, [draggedElement, dragOffset, elements, onUpdateElement]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedElement, handleMouseMove, handleMouseUp]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' && selectedElementId) {
      onDeleteElement(selectedElementId);
    }
  }, [selectedElementId, onDeleteElement]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderElement = (element: ElementData) => {
    const isSelected = selectedElementId === element.id;
    const isDragging = draggedElement === element.id;
    
    const elementStyle: React.CSSProperties = {
      ...element.style,
      border: isSelected ? '2px solid #3b82f6' : element.style.border,
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none' as const,
      transform: element.style.rotation ? `rotate(${element.style.rotation}deg)` : element.style.transform,
      transition: isDragging ? 'none' : 'all 0.2s ease',
      boxShadow: isSelected ? '0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px'
    };

    const elementContent = element.type === 'text' ? (
      <div
        style={elementStyle}
        onClick={(e) => handleElementClick(element.id, e)}
        onMouseDown={(e) => handleMouseDown(element.id, e)}
        onDoubleClick={(e) => {
          e.preventDefault();
          // Enable inline editing
          const target = e.target as HTMLElement;
          target.contentEditable = 'true';
          target.focus();
        }}
        onBlur={(e) => {
          const target = e.target as HTMLElement;
          target.contentEditable = 'false';
          onUpdateElement(element.id, { content: target.textContent || '' });
        }}
        suppressContentEditableWarning={true}
        className="hover:shadow-lg transition-shadow duration-200"
      >
        {element.content}
      </div>
    ) : element.type === 'image' ? (
      <div className="relative group">
        <img
          src={element.src}
          alt={element.alt}
          style={elementStyle}
          onClick={(e) => handleElementClick(element.id, e)}
          onMouseDown={(e) => handleMouseDown(element.id, e)}
          draggable={false}
          className="hover:shadow-lg transition-shadow duration-200"
        />
        {isSelected && (
          <div className="absolute -top-8 -right-8 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentRotation = element.style.rotation || 0;
                onUpdateElement(element.id, {
                  style: {
                    ...element.style,
                    rotation: (currentRotation + 15) % 360
                  }
                });
              }}
              className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
              title="Rotate 15° clockwise"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentRotation = element.style.rotation || 0;
                onUpdateElement(element.id, {
                  style: {
                    ...element.style,
                    rotation: (currentRotation - 15 + 360) % 360
                  }
                });
              }}
              className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-md"
              title="Rotate 15° counter-clockwise"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    ) : (
      <div
        style={elementStyle}
        onClick={(e) => handleElementClick(element.id, e)}
        onMouseDown={(e) => handleMouseDown(element.id, e)}
        className="hover:shadow-lg transition-shadow duration-200"
      >
        {element.content}
      </div>
    );

    return (
      <div key={element.id}>
        {elementContent}
      </div>
    );
  };

  return (
    <div
      ref={stageRef}
      className="relative bg-white border-2 border-gray-200 shadow-2xl rounded-xl overflow-hidden"
      style={{ width: '720px', height: '720px' }}
      onClick={handleStageClick}
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {elements.map(renderElement)}
      
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Creating</h3>
            <p className="text-gray-500 mb-4">Add text or images to begin designing your poster</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddElement('text');
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Add Text
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddElement('image');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
