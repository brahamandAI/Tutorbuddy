import React, { useState, useEffect } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { ImageUpload } from '../ui/ImageUpload';
import { TextArea } from '../ui/TextArea';
import { postForm, postJSON } from '@/lib/apiClient';

type HomeworkHelperResponse = {
  concept: string;
  guidanceSteps: string[];
};

export const HomeworkHelper = () => {
  const { currentTool, closeTool, selectedText, questionId, saveToolResult, getToolResult, onToolUsed, userMeta } = useLearningTools();
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState(selectedText);
  const [result, setResult] = useState<HomeworkHelperResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTool === 'homeworkHelper') {
      const last = getToolResult('homeworkHelper');
      if (last) setResult(last);
    }
  }, [currentTool, getToolResult]);

  const handleImageUpload = async (file: File) => {
    setImage(file);
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      if (userMeta.classLevel) form.append('ageLevel', userMeta.classLevel);
      const payload = { image: file, ageLevel: userMeta.classLevel };
      const res = await postForm<HomeworkHelperResponse>('/api/homework-helper', form);
      setResult(res);
      saveToolResult('homeworkHelper', res);
      onToolUsed('homeworkHelper', payload, res);
    } catch (e: any) {
      setError(e.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleTextExplain = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { text, ageLevel: userMeta.classLevel };
      const res = await postJSON<typeof payload, HomeworkHelperResponse>('/api/homework-helper', payload);
      setResult(res);
      saveToolResult('homeworkHelper', res);
      onToolUsed('homeworkHelper', payload, res);
    } catch (e: any) {
      setError(e.message || 'Failed to explain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={currentTool === 'homeworkHelper'} onClose={closeTool} title="AI Homework Helper">
      <div className="flex flex-col gap-4">
        <div className="font-semibold">Upload Image or Paste Text</div>
        <ImageUpload onUpload={handleImageUpload} />
        <div className="text-center text-gray-400">or</div>
        <TextArea label="Paste Question or Concept" value={text} onChange={setText} rows={3} />
        <button className="bg-blue-600 text-white rounded px-4 py-2 mt-2" onClick={handleTextExplain} disabled={loading}>
          {loading ? 'Explaining...' : 'Explain'}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {result && (
          <>
            <div className="bg-gray-100 p-2 rounded text-sm mt-2">{result.concept}</div>
            {result.guidanceSteps && (
              <div className="mt-2">
                <div className="font-semibold">Guidance Steps:</div>
                <ul className="list-decimal ml-6 text-sm">
                  {result.guidanceSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}; 