'use client';

import { useState, useEffect } from 'react';
import { PropertiesPanelProps } from '@/types';

export function PropertiesPanel({ selectedElement, onUpdateElement, onDeleteElement }: PropertiesPanelProps) {
  const [localValues, setLocalValues] = useState({
    content: '',
    src: '',
    alt: '',
    fontSize: 16,
    color: '#000000',
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    width: 150,
    height: 50
  });

  useEffect(() => {
    if (selectedElement) {
      setLocalValues({
        content: selectedElement.content || '',
        src: selectedElement.src || '',
        alt: selectedElement.alt || '',
        fontSize: selectedElement.style.fontSize || 16,
        color: selectedElement.style.color || '#000000',
        fontWeight: selectedElement.style.fontWeight || 'normal',
        backgroundColor: selectedElement.style.backgroundColor || 'transparent',
        width: selectedElement.style.width || 150,
        height: selectedElement.style.height || 50
      });
    }
  }, [selectedElement]);

  const handleUpdate = (field: string, value: any) => {
    if (!selectedElement) return;

    setLocalValues(prev => ({ ...prev, [field]: value }));

    if (field === 'content' || field === 'src' || field === 'alt') {
      onUpdateElement(selectedElement.id, { [field]: value });
    } else {
      onUpdateElement(selectedElement.id, {
        style: {
          ...selectedElement.style,
          [field]: value
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedElement) {
      onDeleteElement(selectedElement.id);
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
        <p className="text-gray-500">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-white to-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Properties</h3>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Element Type
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded text-sm text-gray-600">
            {selectedElement.type}
          </div>
        </div>

        {selectedElement.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={localValues.content}
              onChange={(e) => handleUpdate('content', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={3}
            />
          </div>
        )}

        {selectedElement.type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={localValues.src}
                onChange={(e) => handleUpdate('src', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                value={localValues.alt}
                onChange={(e) => handleUpdate('alt', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Image description"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Image Rotation
              </label>
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedElement.style.rotation || 0}
                  onChange={(e) => handleUpdate('rotation', parseInt(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg appearance-none cursor-pointer shadow-inner"
                  style={{
                    background: `linear-gradient(to right, #dbeafe 0%, #dbeafe ${(selectedElement.style.rotation || 0) / 360 * 100}%, #e5e7eb ${(selectedElement.style.rotation || 0) / 360 * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="bg-white border border-blue-300 rounded-lg px-3 py-1 shadow-sm">
                  <span className="text-sm font-bold text-blue-700 w-12 text-center">
                    {selectedElement.style.rotation || 0}°
                  </span>
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-3">
                <button
                  onClick={() => handleUpdate('rotation', (selectedElement.style.rotation || 0) - 15)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  -15°
                </button>
                <button
                  onClick={() => handleUpdate('rotation', 0)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={() => handleUpdate('rotation', (selectedElement.style.rotation || 0) + 15)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm font-medium"
                >
                  +15°
                </button>
              </div>
            </div>
          </>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Dimensions
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width
              </label>
              <input
                type="number"
                value={localValues.width}
                onChange={(e) => handleUpdate('width', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <input
                type="number"
                value={localValues.height}
                onChange={(e) => handleUpdate('height', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {selectedElement.type === 'text' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Text Styling
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  value={localValues.fontSize}
                  onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value) || 16)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Weight
                </label>
                <select
                  value={localValues.fontWeight}
                  onChange={(e) => handleUpdate('fontWeight', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Light</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localValues.color}
                    onChange={(e) => handleUpdate('color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localValues.color}
                    onChange={(e) => handleUpdate('color', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localValues.backgroundColor}
                    onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={localValues.backgroundColor}
                    onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
