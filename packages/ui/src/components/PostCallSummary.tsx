import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { useApi } from '../hooks/useApi';

const SENTIMENT_STYLES = {
  positive: 'bg-green-100 text-green-700',
  neutral: 'bg-gray-100 text-gray-700',
  negative: 'bg-red-100 text-red-700',
};

export function PostCallSummary() {
  const { postCallSummary, setPostCallSummary, conversation, uiLanguage } = useAgentStore();
  const { generatePostCallSummary } = useApi();
  const [loading, setLoading] = useState(false);
  const isTl = uiLanguage === 'tl-PH';

  const generate = async () => {
    if (!conversation) return;
    setLoading(true);
    try {
      const summary = await generatePostCallSummary(conversation.conversationId, []);
      setPostCallSummary(summary);
    } finally {
      setLoading(false);
    }
  };

  if (!postCallSummary) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm mb-4">Generate a post-call summary after the conversation ends.</p>
        <button onClick={generate} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      </div>
    );
  }

  const s = postCallSummary;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SENTIMENT_STYLES[s.sentiment]}`}>{s.sentiment}</span>
        <span className="text-xs text-gray-400">{new Date(s.timestamp).toLocaleString()}</span>
      </div>
      <p className="text-sm text-gray-700">{isTl ? s.summaryTl : s.summary}</p>
      {s.keyTopics.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Key Topics</p>
          <div className="flex flex-wrap gap-1">{s.keyTopics.map((t) => <span key={t} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{t}</span>)}</div>
        </div>
      )}
      {s.commitmentsMade.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Commitments</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">{s.commitmentsMade.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      )}
      {s.followUpActions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">Follow-ups</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">{s.followUpActions.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}
      {s.complianceFlags.length > 0 && (
        <div className="bg-red-50 rounded-lg p-2">
          <p className="text-xs font-semibold text-red-600 mb-1">Compliance Flags</p>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-0.5">{s.complianceFlags.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}
      <button
        onClick={() => navigator.clipboard.writeText(isTl ? s.summaryTl : s.summary)}
        className="text-xs text-indigo-600 hover:underline"
      >
        Copy summary
      </button>
    </div>
  );
}
