import React, { useState, useRef, useCallback } from 'react';
import { Canvas, type CanvasRef } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { PromptInput } from './components/PromptInput';
import { ImageUploader } from './components/ImageUploader';
import { editImage, createSketch } from './services/geminiService';
import { type Tool } from './types';
import { DEFAULT_COLOR, DEFAULT_LINE_WIDTH } from './constants';

const App: React.FC = () => {
  const [tool, setTool] = useState<Tool>('pen');
  const [strokeColor, setStrokeColor] = useState<string>(DEFAULT_COLOR);
  const [lineWidth, setLineWidth] = useState<number>(DEFAULT_LINE_WIDTH);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<'sketch' | 'generate' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<CanvasRef>(null);

  const handleCreateSketch = async () => {
    if (!prompt || !canvasRef.current) return;

    setIsLoading(true);
    setLoadingAction('sketch');
    setError(null);

    try {
      const newImageBase64 = await createSketch(prompt);
      canvasRef.current.loadImage(`data:image/jpeg;base64,${newImageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt || !canvasRef.current) return;

    setIsLoading(true);
    setLoadingAction('generate');
    setError(null);

    try {
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
      if (!imageDataUrl) {
          throw new Error("Could not get image data from canvas.");
      }
      const newImageBase64 = await editImage(imageDataUrl, prompt);
      canvasRef.current.loadImage(`data:image/jpeg;base64,${newImageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };
  
  const handleImageUpload = useCallback((imageDataUrl: string) => {
    canvasRef.current?.loadImage(imageDataUrl);
  }, []);

  const handleClear = useCallback(() => {
    canvasRef.current?.clearCanvas();
  }, []);

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4">
        
        {/* Left Panel: Toolbar and Image Uploader */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          <header className="text-center lg:text-left">
             <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent pb-2">
              Genesis Sketchpad
            </h1>
            <p className="text-slate-400 mt-1">Draw or upload an image, then tell AI how to edit it.</p>
          </header>

          <Toolbar
            tool={tool}
            setTool={setTool}
            color={strokeColor}
            setColor={setStrokeColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            onClear={handleClear}
          />
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>

        {/* Right Panel: Canvas and Prompt */}
        <main className="lg:w-3/4 flex flex-col gap-4">
          <div className="relative aspect-square w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700">
            <Canvas
              ref={canvasRef}
              tool={tool}
              strokeColor={strokeColor}
              lineWidth={lineWidth}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg font-semibold">Genesis is dreaming up your art...</p>
              </div>
            )}
          </div>
          
          {error && <div className="bg-pink-800/50 border border-pink-700 text-pink-200 p-3 rounded-xl text-sm">{error}</div>}

          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onCreateSketch={handleCreateSketch}
            onGenerateImage={handleGenerateImage}
            isLoading={isLoading}
            loadingAction={loadingAction}
          />
        </main>
      </div>
    </div>
  );
};

export default App;