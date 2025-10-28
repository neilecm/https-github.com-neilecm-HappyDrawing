import React, { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { type Tool } from '../types';
import { ERASER_COLOR, ERASER_WIDTH } from '../constants';

interface CanvasProps {
  tool: Tool;
  strokeColor: string;
  lineWidth: number;
}

export interface CanvasRef {
  clearCanvas: () => void;
  toDataURL: (type?: string, quality?: any) => string | undefined;
  loadImage: (src: string) => void;
}

export const Canvas = forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const { tool, strokeColor, lineWidth } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Make canvas responsive
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            canvas.width = width;
            canvas.height = height;
            // Redraw content if needed, for now we just clear and set styles
            const context = canvas.getContext('2d');
            if (context) {
              contextRef.current = context;
              context.lineCap = 'round';
              context.lineJoin = 'round';
            }
        }
    });
    resizeObserver.observe(parent);

    return () => resizeObserver.disconnect();

  }, []);

  const getBrushProperties = useCallback(() => {
    if (tool === 'pen') {
      return { color: strokeColor, width: lineWidth };
    }
    return { color: ERASER_COLOR, width: ERASER_WIDTH };
  }, [tool, strokeColor, lineWidth]);

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const context = contextRef.current;
    if (!context) return;
    
    isDrawing.current = true;
    const { color, width } = getBrushProperties();
    context.strokeStyle = color;
    context.lineWidth = width;
    
    const { offsetX, offsetY } = getCoords(event);
    context.beginPath();
    context.moveTo(offsetX, offsetY);
  }, [getBrushProperties]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !contextRef.current) return;
    
    const { offsetX, offsetY } = getCoords(event);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }, []);

  const stopDrawing = useCallback(() => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    isDrawing.current = false;
  }, []);

  const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    if ('touches' in event.nativeEvent) {
      const touch = event.nativeEvent.touches[0];
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    }
    return {
      offsetX: (event as React.MouseEvent).nativeEvent.offsetX,
      offsetY: (event as React.MouseEvent).nativeEvent.offsetY
    };
  };

  useImperativeHandle(ref, () => ({
    clearCanvas() {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    toDataURL(type = 'image/png', quality = 1.0) {
      return canvasRef.current?.toDataURL(type, quality);
    },
    loadImage(src: string) {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      const img = new Image();
      img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.onerror = () => {
          console.error("Failed to load image");
      }
      img.src = src;
    },
  }));

  const pencilCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>') 0 24, auto`;
  
  const canvasStyle: React.CSSProperties = {
    cursor: tool === 'pen' ? pencilCursor : 'crosshair',
  };


  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={canvasStyle}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
});