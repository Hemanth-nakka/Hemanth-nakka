import React from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { UiLanguage } from '../types';

export function ConversationHeader() {
  const { agent, conversation, wsConnected, uiLanguage, setLanguage, endConversation } = useAgentStore();

  return (
    <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg">Agent Assist</span>
        <span className="text-indigo-200 text-sm">|</span>
        <span className="text-indigo-100 text-sm">{agent?.name} ({agent?.agentId})</span>
        {conversation && (
          <>
            <span className="text-indigo-200 text-sm">|</span>
            <span className="text-indigo-100 text-sm">{conversation.customerId}</span>
            <span className="bg-indigo-500 text-xs px-2 py-0.5 rounded-full uppercase">{conversation.channelType}</span>
            {conversation.dpd !== undefined && (
              <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-0.5 rounded-full">{conversation.dpd}dpd</span>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} title={wsConnected ? 'Live' : 'Disconnected'} />
        <select
          className="bg-indigo-600 text-white text-xs border border-indigo-400 rounded px-2 py-1"
          value={uiLanguage}
          onChange={(e) => setLanguage(e.target.value as UiLanguage)}
        >
          <option value="tl-PH">Taglish 🇵🇭</option>
          <option value="en-PH">English PH 🇵🇭</option>
          <option value="en">English 🌐</option>
        </select>
        <button onClick={endConversation} className="text-indigo-200 hover:text-white text-sm">End</button>
      </div>
    </div>
  );
}
