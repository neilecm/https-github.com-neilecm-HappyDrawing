
import React, { useRef, useEffect, useCallback } from 'react';
import { type Tool } from '../types';

interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  onClear: () => void;
}

const ToolButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
  <button
    aria-label={label}
    onClick={onClick}
    className={`p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-cyan-500 text-white shadow-lg scale-110'
        : 'bg-gray-700 hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);


export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  onClear,
}) => {
  const colorBarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Helper to convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Effect to set up a hidden canvas for color picking from the gradient
  useEffect(() => {
    const canvas = canvasRef.current;
    const colorBar = colorBarRef.current;
    if (canvas && colorBar) {
      const rect = colorBar.getBoundingClientRect();
      if (rect.width > 0) {
        canvas.width = rect.width;
        canvas.height = 1;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          contextRef.current = ctx;
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop(0, '#ff0000');
          gradient.addColorStop(0.17, '#ffff00');
          gradient.addColorStop(0.34, '#00ff00');
          gradient.addColorStop(0.51, '#00ffff');
          gradient.addColorStop(0.68, '#0000ff');
          gradient.addColorStop(0.85, '#ff00ff');
          gradient.addColorStop(1, '#ff0000');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, []);

  const handleColorSelect = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (tool !== 'pen' || !contextRef.current || !colorBarRef.current) return;
    
    const rect = colorBarRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    const pixel = contextRef.current.getImageData(x, 0, 1, 1).data;
    const selectedColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setColor(selectedColor);
  }, [tool, setColor]);


  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-400">Tools</label>
        <div className="grid grid-cols-2 gap-2">
           <ToolButton label="Pen" isActive={tool === 'pen'} onClick={() => setTool('pen')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
          </ToolButton>
          <ToolButton label="Eraser" isActive={tool === 'eraser'} onClick={() => setTool('eraser')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
          </ToolButton>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-400 flex justify-between items-center">
          <span>Color</span>
          <div 
            className="w-6 h-6 rounded-full border-2 border-gray-500 shadow-md" 
            style={{ backgroundColor: color }}
            aria-label={`Current color: ${color}`}
          />
        </label>
        <div
          ref={colorBarRef}
          onClick={handleColorSelect}
          className={`w-full h-8 rounded-lg border-2 border-transparent ${tool === 'pen' ? 'cursor-pointer hover:border-cyan-400' : 'cursor-not-allowed opacity-50'}`}
          style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
          aria-label="Color spectrum selector"
          role="button"
          tabIndex={tool === 'pen' ? 0 : -1}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="space-y-2">
        <label htmlFor="line-width" className="text-sm font-semibold text-gray-400">
          Brush Size: <span className="font-bold text-cyan-400">{lineWidth}</span>
        </label>
        <input
          id="line-width"
          type="range"
          min="1"
          max="50"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          disabled={tool !== 'pen'}
        />
      </div>
      
      <button onClick={onClear} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
        Clear All
      </button>

    </div>
  );
};
