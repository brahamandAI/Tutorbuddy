import React, { useState, useEffect } from 'react';
import { useLearningTools } from './LearningToolsProvider';
import { Modal } from '../ui/Modal';
import { TextArea } from '../ui/TextArea';
import { postJSON } from '@/lib/apiClient';

type WhatsAppDoubtResponse = {
  deepLink: string;
  summary: string;
};

export const WhatsAppDoubt = () => {
  const { currentTool, closeTool, selectedText, questionId, saveToolResult, getToolResult, onToolUsed } = useLearningTools();
  const [question, setQuestion] = useState(selectedText);
  const [summary, setSummary] = useState('');
  const [waLink, setWaLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WhatsAppDoubtResponse | null>(null);

  useEffect(() => {
    if (currentTool === 'whatsappDoubt') {
      const last = getToolResult('whatsappDoubt');
      if (last) setResult(last);
    }
  }, [currentTool, getToolResult]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = { questionText: question };
      const res = await postJSON<typeof payload, WhatsAppDoubtResponse>('/api/whatsapp-doubt', payload);
      setSummary(res.summary);
      // Use returned summary and generate deep link with placeholder number
      const msg = `${question}\n\nSummary: ${res.summary}`;
      const link = `https://wa.me/1234567890?text=${encodeURIComponent(msg)}`;
      setWaLink(link);
      setResult(res);
      saveToolResult('whatsappDoubt', res);
      onToolUsed('whatsappDoubt', payload, res);
    } catch (e: any) {
      setError(e.message || 'Failed to generate WhatsApp link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={currentTool === 'whatsappDoubt'} onClose={closeTool} title="Ask This Doubt in WhatsApp">
      <div className="flex flex-col gap-4">
        <TextArea label="Your Question" value={question} onChange={setQuestion} rows={2} />
        <TextArea label="AI Summary (optional)" value={summary} onChange={setSummary} rows={2} />
        <button className="bg-green-600 text-white rounded px-4 py-2 mt-2" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate WhatsApp Link'}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="block bg-green-100 text-green-800 rounded px-4 py-2 mt-2 text-center font-semibold">Open in WhatsApp</a>
        )}
        {result && (
          <div className="bg-gray-100 p-2 rounded text-sm mt-2">Summary: {result.summary}</div>
        )}
      </div>
    </Modal>
  );
}; 