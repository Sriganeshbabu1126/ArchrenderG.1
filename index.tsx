import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Modality } from "@google/genai";

const RENDER_OPTIONS = {
  subject: [
    { name: 'Buildings', image: 'https://images.pexels.com/photos/2088164/pexels-photo-2088164.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Houses', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Apartments', image: 'https://images.pexels.com/photos/277667/pexels-photo-277667.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  medium: [
    { name: 'Realistic Photo', image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: '3D Rendering', image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Sketches', image: 'https://images.pexels.com/photos/1484433/pexels-photo-1484433.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  style: [
    { name: 'Loft', image: 'https://images.pexels.com/photos/383568/pexels-photo-383568.jpeg?auto=compress&cs=tinysrgb&w=400', preview: 'https://images.pexels.com/photos/383568/pexels-photo-383568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Gothic', image: 'https://images.pexels.com/photos/161418/cathedral-of-milan-italy-lombardy-161418.jpeg?auto=compress&cs=tinysrgb&w=400', preview: 'https://images.pexels.com/photos/161418/cathedral-of-milan-italy-lombardy-161418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Brutalist', image: 'https://images.pexels.com/photos/7403986/pexels-photo-7403986.jpeg?auto=compress&cs=tinysrgb&w=400', preview: 'https://images.pexels.com/photos/7403986/pexels-photo-7403986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Spanish Revival', image: 'https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=400', preview: 'https://images.pexels.com/photos/128421/pexels-photo-128421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    { name: 'Modernism', image: 'https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg?auto=compress&cs=tinysrgb&w=400', preview: 'https://images.pexels.com/photos/189333/pexels-photo-189333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  ],
  environment: [
    { name: 'Indoors', image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Outdoors', image: 'https://images.pexels.com/photos/2105493/pexels-photo-2105493.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Roads', image: 'https://images.pexels.com/photos/3214778/pexels-photo-3214778.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Plantation', image: 'https://images.pexels.com/photos/1428277/pexels-photo-1428277.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  lighting: [
    { name: 'Soft', image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Ambient', image: 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Overcast', image: 'https://images.pexels.com/photos/1110826/pexels-photo-1110826.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Neon', image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Direct Sun Light', image: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  color: [
    { name: 'Vibrant', image: 'https://images.pexels.com/photos/2088282/pexels-photo-2088282.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Muted', image: 'https://images.pexels.com/photos/1350615/pexels-photo-1350615.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Bright', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Monochromatic', image: 'https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Colorful', image: 'https://images.pexels.com/photos/2740956/pexels-photo-2740956.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Pastel', image: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  mood: [
    { name: 'Sedate', image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Calm', image: 'https://images.pexels.com/photos/210552/pexels-photo-210552.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Energetic', image: 'https://images.pexels.com/photos/314937/pexels-photo-314937.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Majestic', image: 'https://images.pexels.com/photos/1528375/pexels-photo-1528375.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Futuristic', image: 'https://images.pexels.com/photos/2156/sky-lights-space-dark.jpg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Cozy', image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Playful', image: 'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Minimalist', image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Somber', image: 'https://images.pexels.com/photos/1105325/pexels-photo-1105325.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Raucous', image: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
};

type RenderOptionKeys = keyof typeof RENDER_OPTIONS;
type Selections = { [key in RenderOptionKeys]?: string };
type ImageState = { file: File | null; preview: string | null };
type ChatMessage = { type: 'user' | 'ai', content: string };

// SVG Icons as React Components
const CubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const RerenderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;
const RestartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>;


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const App = () => {
  const [selections, setSelections] = useState<Selections>({});
  const [planImage, setPlanImage] = useState<ImageState>({ file: null, preview: null });
  const [generatedImage, setGeneratedImage] = useState<ImageState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [activeTab, setActiveTab] = useState('Concept');
  const [stylePreview, setStylePreview] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const handleSelection = (category: RenderOptionKeys, value: string) => {
    setSelections(prev => ({ ...prev, [category]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<ImageState>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const isReadyToGenerate = useMemo(() => {
    return Object.keys(selections).length === Object.keys(RENDER_OPTIONS).length && planImage.file;
  }, [selections, planImage]);

  const generatePrompt = (correction = "") => {
    if (correction) return correction;
    return `Re-render the provided image with the following characteristics, ensuring the original composition, layout, and structural elements remain completely intact. Your task is to apply a new aesthetic, not to change the architecture.
    - Medium: ${selections.medium}
    - Subject Focus: ${selections.subject}
    - Style: ${selections.style}
    - Environment: ${selections.environment}
    - Lighting: ${selections.lighting}
    - Color: ${selections.color}
    - Mood: ${selections.mood}`;
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    if (!generatedImage) {
        setChatHistory([]);
        setGeneratedImage(null);
    }

    const prompt = generatePrompt();
    const imageToProcess = planImage.file;

    if (!imageToProcess) {
      console.error("Missing dependencies for generation.");
      setIsLoading(false);
      return;
    }

    try {
      const imagePart = await fileToGenerativePart(imageToProcess);
      const textPart = { text: prompt };
      
      const config = {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        ...(systemPrompt && { systemInstruction: systemPrompt }),
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config,
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newImageB64 = part.inlineData.data;
          const newImageUrl = `data:${part.inlineData.mimeType};base64,${newImageB64}`;
          const newImageResponse = await fetch(newImageUrl);
          const newImageBlob = await newImageResponse.blob();
          const newImageFile = new File([newImageBlob], "generated.png", { type: newImageBlob.type });

          setGeneratedImage({
            file: newImageFile,
            preview: newImageUrl,
          });
          
          if (!generatedImage) {
            setChatHistory([{ type: 'ai', content: 'Here is the initial render based on your selections.' }]);
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isLoading || !generatedImage?.file) return;
    
    const userMessage: ChatMessage = { type: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsLoading(true);

    try {
      const imagePart = await fileToGenerativePart(generatedImage.file);
      const textPart = { text: chatMessage };

      const config = {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        ...(systemPrompt && { systemInstruction: systemPrompt }),
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config,
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newImageB64 = part.inlineData.data;
          const newImageUrl = `data:${part.inlineData.mimeType};base64,${newImageB64}`;
          const newImageResponse = await fetch(newImageUrl);
          const newImageBlob = await newImageResponse.blob();
          const newImageFile = new File([newImageBlob], "generated.png", { type: newImageBlob.type });

          setGeneratedImage({ file: newImageFile, preview: newImageUrl });
          setChatHistory(prev => [...prev, { type: 'ai', content: 'Here is the updated image.' }]);
        }
      }
    } catch (error) {
      console.error("Error generating correction:", error);
      setChatHistory(prev => [...prev, { type: 'ai', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage?.preview) {
      const link = document.createElement('a');
      link.href = generatedImage.preview;
      link.download = `render-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRestart = () => {
    setSelections({});
    setPlanImage({ file: null, preview: null });
    setGeneratedImage(null);
    setIsLoading(false);
    setChatHistory([]);
    setChatMessage('');
    setSystemPrompt('');
    setActiveTab('Concept');
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const controlTabs = {
    'System': [],
    'Concept': ['subject', 'medium', 'style'],
    'Scene': ['environment', 'lighting'],
    'Aesthetics': ['color', 'mood']
  };

  return (
    <div className="studio-container">
      {stylePreview && (
        <div className="style-preview-popup">
          <img src={stylePreview} alt="Style preview" />
        </div>
      )}

      <aside className="sidebar">
        <header className="sidebar-header">
            <div className="logo-container">
                <CubeIcon />
                <h1>ArchrenderG.1</h1>
            </div>
            <button className="restart-button" onClick={handleRestart} aria-label="Restart Session">
                <RestartIcon />
            </button>
        </header>

        <nav className="sidebar-nav">
          {Object.keys(controlTabs).map(tabName => (
            <button 
              key={tabName} 
              className={`nav-button ${activeTab === tabName ? 'active' : ''}`}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName}
            </button>
          ))}
        </nav>

        <div className="sidebar-content">
          {activeTab === 'System' ? (
            <div className="system-prompt-group">
              <h4>System Prompt</h4>
              <textarea
                className="system-prompt-input"
                placeholder="e.g., You are an expert architectural visualizer who preserves the core structure of the user's image..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </div>
          ) : (
            controlTabs[activeTab as keyof typeof controlTabs].map(key => (
              <div key={key} className="selection-group">
                <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                <div className="option-grid">
                  {RENDER_OPTIONS[key as RenderOptionKeys].map(option => (
                    <label
                      key={option.name}
                      className={`option-tag ${selections[key as RenderOptionKeys] === option.name ? 'selected' : ''}`}
                      onMouseEnter={key === 'style' && 'preview' in option ? () => setStylePreview(option.preview) : undefined}
                      onMouseLeave={key === 'style' && 'preview' in option ? () => setStylePreview(null) : undefined}
                    >
                      <input
                        type="radio"
                        name={key}
                        value={option.name}
                        checked={selections[key as RenderOptionKeys] === option.name}
                        onChange={() => handleSelection(key as RenderOptionKeys, option.name)}
                      />
                      {option.name}
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="sidebar-footer">
          <div className="file-uploader-wrapper">
            <label className="file-uploader">
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPlanImage)} />
              {planImage.preview ? <img src={planImage.preview} alt="Plan Preview" /> : (
                <>
                  <UploadIcon/>
                  <span>Upload Plan / Sketch</span>
                </>
              )}
            </label>
          </div>
          <button className="generate-button" disabled={!isReadyToGenerate || isLoading} onClick={handleGenerate}>
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </footer>
      </aside>

      <main className="canvas">
        {!generatedImage && !isLoading && (
          <div className="placeholder">
            <ImageIcon />
            <h2>Your Masterpiece Awaits</h2>
            <p>Complete all selections and upload a base image to begin.</p>
          </div>
        )}
        {isLoading && !generatedImage && <div className="loader"></div>}
        {generatedImage && (
          <div className="main-content">
            <div className="image-display-area">
              <div className="generated-image-container">
                  {isLoading && <div className="image-loader"></div>}
                  <img src={generatedImage.preview} alt="Generated architecture" className={`generated-image ${isLoading ? 'loading' : ''}`} />
              </div>
            </div>

            <div className="refinement-area">
              <div className="render-actions">
                  <button className="action-button" onClick={handleGenerate} disabled={isLoading}>
                      <RerenderIcon />
                      Rerender
                  </button>
                  <button className="action-button" onClick={handleDownload}>
                      <DownloadIcon />
                      Save Image
                  </button>
              </div>
              <div className="chat-container">
                <div className="chat-history" ref={chatHistoryRef}>
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}-message`}>{msg.content}</div>
                  ))}
                </div>
                <form className="chat-input-form" onSubmit={handleChatSubmit}>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Refine your image... (e.g., 'make the windows larger')"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    aria-label="Chat input for corrections"
                    disabled={isLoading}
                  />
                  <button type="submit" className="chat-submit-button" aria-label="Send correction" disabled={isLoading}>
                      <SendIcon/>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);