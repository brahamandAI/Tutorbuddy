import React, { useState, useEffect } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { ImageUpload } from '../ui/ImageUpload';
import { postForm } from '@/lib/apiClient';

type SnapSolveResponse = {
  ocrText: string;
  steps?: string[];
  explanation: string;
};

export const SnapSolve = () => {
  const { currentTool, closeTool, questionId, saveToolResult, getToolResult, onToolUsed } = useLearningTools();
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<SnapSolveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentTool === 'snapSolve') {
      const last = getToolResult('snapSolve');
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
      const payload = { image: file };
      const res = await postForm<SnapSolveResponse>('/api/snap-solve', form);
      setResult(res);
      saveToolResult('snapSolve', res);
      onToolUsed('snapSolve', payload, res);
    } catch (e: any) {
      setError(e.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={currentTool === 'snapSolve'} onClose={closeTool} title="Snap & Solve">
      <div className="flex flex-col gap-4">
        <ImageUpload onUpload={handleImageUpload} />
        {loading && <div className="text-center">Processing...</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {result && (
          <>
            <div>
              <div className="font-semibold">Extracted Text:</div>
              <div className="bg-gray-100 p-2 rounded text-sm">{result.ocrText}</div>
            </div>
            {result.steps && (
              <div>
                <div className="font-semibold">Steps:</div>
                <ul className="list-decimal ml-6 text-sm">
                  {result.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            <div>
              <div className="font-semibold">Solution:</div>
              <div className="bg-green-100 p-2 rounded text-sm">{result.explanation}</div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}; 