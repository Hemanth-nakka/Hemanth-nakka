import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { useApi } from '../hooks/useApi';
import { KBArticle } from '../types';

export function KnowledgeBase() {
  const { kbSearchResults, setKbResults, selectedArticle, setSelectedArticle, uiLanguage } = useAgentStore();
  const { searchKnowledge } = useApi();
  const [query, setQuery] = useState('');
  const isTl = uiLanguage === 'tl-PH';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const results = await searchKnowledge(query);
    setKbResults(results);
  };

  if (selectedArticle) {
    return (
      <div>
        <button onClick={() => setSelectedArticle(null)} className="text-indigo-600 text-sm mb-3 hover:underline">← Back</button>
        <h3 className="font-semibold text-gray-800 mb-1">{isTl ? selectedArticle.titleTl : selectedArticle.title}</h3>
        <div className="flex gap-1 mb-3">
          {selectedArticle.tags.map((t) => (
            <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
          {isTl ? selectedArticle.contentTl : selectedArticle.content}
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <input
          className="flex-1 border rounded-lg px-3 py-1.5 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search KB (Taglish ok)..."
        />
        <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700">Search</button>
      </form>
      {kbSearchResults.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">Search the knowledge base above</p>
      ) : (
        <div className="space-y-2">
          {kbSearchResults.map((a: KBArticle) => (
            <button
              key={a.id}
              onClick={() => setSelectedArticle(a)}
              className="w-full text-left border rounded-lg p-3 hover:bg-indigo-50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.id}</span>
                <span className="font-medium text-sm">{isTl ? a.titleTl : a.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
