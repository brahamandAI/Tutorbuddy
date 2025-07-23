import React, { useState, useEffect } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { postJSON } from '@/lib/apiClient';

type ExplainLevel = 'Kid' | 'Class10' | 'Competitive' | 'Meme';
type ExplainApiLevel = 'kid' | 'class10' | 'competitive' | 'meme';

const levels = [
  { value: 'Kid', label: 'Kid (5y)' },
  { value: 'Class10', label: 'Class 10' },
  { value: 'Competitive', label: 'Competitive' },
  { value: 'Meme', label: 'Meme' },
];

function toApiLevel(level: ExplainLevel): ExplainApiLevel {
  switch (level) {
    case 'Kid': return 'kid';
    case 'Class10': return 'class10';
    case 'Competitive': return 'competitive';
    case 'Meme': return 'meme';
  }
}

type ExplainResponse = {
  explanation: string;
  mediaHints?: string[];
};

export const MagicExplain = () => {
  const { currentTool, closeTool, selectedText, userMeta, saveToolResult, getToolResult, onToolUsed, setSelectedText } = useLearningTools();
  const [level, setLevel] = useState<ExplainLevel>(userMeta.classLevel);
  const [text, setText] = useState(selectedText);
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-preload highlighted text
  useEffect(() => {
    if (currentTool === 'magicExplain') {
      const last = getToolResult('magicExplain');
      if (last) setResult(last);
      const handler = () => {
        const sel = window.getSelection();
        if (sel && sel.toString().trim().length > 0) {
          setText(sel.toString());
          setSelectedText(sel.toString());
        }
      };
      document.addEventListener('selectionchange', handler);
      return () => document.removeEventListener('selectionchange', handler);
    }
  }, [currentTool, getToolResult, setSelectedText]);

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { text, level: toApiLevel(level) };
      const res = await postJSON<typeof payload, ExplainResponse>('/api/explain', payload);
      setResult(res);
      saveToolResult('magicExplain', res);
      onToolUsed('magicExplain', payload, res);
    } catch (e: any) {
      setError(e.message || 'Failed to explain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={currentTool === 'magicExplain'} onClose={closeTool} title="Magic Explain">
      <div className="flex flex-col gap-4">
        <Select 
          label="Explain as" 
          value={level} 
          onChange={(value: string) => setLevel(value as ExplainLevel)} 
          options={levels} 
        />
        <TextArea label="Text to explain" value={text} onChange={setText} rows={3} />
        <button className="bg-blue-600 text-white rounded px-4 py-2 mt-2" onClick={handleExplain} disabled={loading}>
          {loading ? 'Explaining...' : 'Explain'}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {result && (
          <>
            <div className="bg-gray-100 p-2 rounded text-sm mt-2">{result.explanation}</div>
            {result.mediaHints && (
              <div className="mt-2">
                <div className="font-semibold">Media Hints:</div>
                <ul className="list-disc ml-6 text-sm">
                  {result.mediaHints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}; 