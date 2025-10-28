import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onCreateSketch: () => void;
  onGenerateImage: () => void;
  isLoading: boolean;
  loadingAction: 'sketch' | 'generate' | null;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onCreateSketch, onGenerateImage, isLoading, loadingAction }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && prompt) {
      onGenerateImage();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-700 p-2 rounded-2xl shadow-lg border border-slate-600">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'A happy dog' or 'Add sunglasses'"
        className="w-full sm:flex-grow bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none p-3"
        disabled={isLoading}
      />
      
      <div className="flex w-full sm:w-auto items-center gap-2">
        <button
          onClick={onCreateSketch}
          disabled={isLoading || !prompt}
          className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out flex items-center justify-center gap-2"
          aria-label="Create a new sketch from prompt"
        >
          {isLoading && loadingAction === 'sketch' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sketching...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
              <span><span className="hidden sm:inline">Create </span>Sketch</span>
            </>
          )}
        </button>

        <button
          onClick={onGenerateImage}
          disabled={isLoading || !prompt}
          className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl transition duration-300 ease-in-out flex items-center justify-center gap-2"
          aria-label="Edit the current image or generate a new one using the prompt"
        >
          {isLoading && loadingAction === 'generate' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span><span className="hidden sm:inline">Generate </span>Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};