import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';

const CATEGORY_COLORS: Record<string, string> = {
  negotiation: 'bg-blue-100 text-blue-800',
  compliance: 'bg-red-100 text-red-800',
  empathy: 'bg-purple-100 text-purple-800',
  payment: 'bg-green-100 text-green-800',
  escalation: 'bg-orange-100 text-orange-800',
  closing: 'bg-teal-100 text-teal-800',
};

export function SuggestionsPanel() {
  const { suggestions, uiLanguage } = useAgentStore();
  const isTl = uiLanguage === 'tl-PH';
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!suggestions.length) {
    return <p className="text-gray-400 text-sm text-center py-8">Waiting for conversation...</p>;
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s) => (
        <div key={s.id} className="border rounded-xl p-3 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[s.category] || 'bg-gray-100 text-gray-700'}`}>{s.category}</span>
              <span className="font-medium text-sm">{isTl ? s.titleTl : s.title}</span>
            </div>
            <span className="text-xs text-gray-400">{Math.round(s.confidence * 100)}%</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{isTl ? s.bodyTl : s.body}</p>
          {(s.script || s.scriptTl) && (
            <div className="bg-gray-50 rounded-lg p-2 flex items-start justify-between gap-2">
              <p className="text-xs text-gray-700 italic flex-1">{isTl ? s.scriptTl : s.script}</p>
              <button
                onClick={() => copy(isTl ? (s.scriptTl || '') : (s.script || ''), s.id)}
                className="shrink-0 text-xs text-indigo-600 hover:text-indigo-800"
              >
                {copied === s.id ? '✓' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
