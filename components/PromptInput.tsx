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
    <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-700">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'A happy dog' or 'Add sunglasses'"
        className="flex-grow bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none px-2 py-1"
        disabled={isLoading}
      />
      
      <button
        onClick={onCreateSketch}
        disabled={isLoading || !prompt}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center gap-2 min-w-[130px]"
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
            <span>Create Sketch</span>
          </>
        )}
      </button>

      <button
        onClick={onGenerateImage}
        disabled={isLoading || !prompt}
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-5 rounded-md transition duration-300 ease-in-out flex items-center justify-center gap-2 min-w-[170px]"
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
            <span>Generate Image</span>
          </>
        )}
      </button>
    </div>
  );
};