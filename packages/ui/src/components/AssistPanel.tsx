import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { SuggestionsPanel } from './SuggestionsPanel';
import { ComplianceAlertCard } from './ComplianceAlert';
import { KnowledgeBase } from './KnowledgeBase';
import { DispositionPanel } from './DispositionPanel';
import { PostCallSummary } from './PostCallSummary';

type Tab = 'suggestions' | 'compliance' | 'knowledge' | 'disposition' | 'summary';

export function AssistPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('suggestions');
  const { suggestions, complianceAlerts } = useAgentStore();

  const hasCritical = complianceAlerts.some((a) => a.severity === 'critical');

  const tabs: { id: Tab; label: string; badge?: number; pulse?: boolean }[] = [
    { id: 'suggestions', label: '🤖 Suggestions', badge: suggestions.length },
    { id: 'compliance', label: '⚖️ Compliance', badge: complianceAlerts.length, pulse: hasCritical },
    { id: 'knowledge', label: '📚 Knowledge' },
    { id: 'disposition', label: '📋 Disposition' },
    { id: 'summary', label: '📝 Summary' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.pulse && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                tab.id === 'compliance' && hasCritical ? 'bg-red-500 text-white' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'suggestions' && <SuggestionsPanel />}
        {activeTab === 'compliance' && (
          <div>
            {complianceAlerts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No compliance alerts</p>
            ) : (
              complianceAlerts.map((a) => <ComplianceAlertCard key={`${a.ruleId}-${a.timestamp}`} alert={a} />)
            )}
          </div>
        )}
        {activeTab === 'knowledge' && <KnowledgeBase />}
        {activeTab === 'disposition' && <DispositionPanel />}
        {activeTab === 'summary' && <PostCallSummary />}
      </div>
    </div>
  );
}
