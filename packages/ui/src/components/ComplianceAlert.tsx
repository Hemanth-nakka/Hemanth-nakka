import React from 'react';
import { ComplianceAlert as CA } from '../types';
import { useAgentStore } from '../store/useAgentStore';

const SEVERITY_STYLES: Record<CA['severity'], string> = {
  critical: 'bg-red-50 border-red-400 text-red-800',
  high: 'bg-orange-50 border-orange-400 text-orange-800',
  medium: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  low: 'bg-blue-50 border-blue-400 text-blue-800',
};

export function ComplianceAlertCard({ alert }: { alert: CA }) {
  const uiLanguage = useAgentStore((s) => s.uiLanguage);
  const isTl = uiLanguage === 'tl-PH';

  return (
    <div className={`border-l-4 rounded-r-lg p-3 mb-2 ${SEVERITY_STYLES[alert.severity]}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase">{alert.severity}</span>
            <span className="text-xs">{alert.ruleId}</span>
            <span className="text-xs opacity-70">{alert.regulation}</span>
          </div>
          <p className="text-sm font-medium">{isTl ? alert.agentCueTl : alert.agentCue}</p>
          {alert.triggeredText && (
            <p className="text-xs mt-1 opacity-60 italic truncate">"{alert.triggeredText}"</p>
          )}
        </div>
        {alert.autoEscalate && (
          <span className="shrink-0 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Auto-Escalate</span>
        )}
      </div>
    </div>
  );
}
