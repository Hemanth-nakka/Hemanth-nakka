import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { DISPOSITION_CODES } from '../types';

export function DispositionPanel() {
  const { disposition, setDisposition, uiLanguage } = useAgentStore();
  const isTl = uiLanguage === 'tl-PH';
  const [selectedCode, setSelectedCode] = useState(disposition?.code || '');
  const [date, setDate] = useState(disposition?.date || '');
  const [amount, setAmount] = useState(disposition?.amount || '');

  const selected = DISPOSITION_CODES.find((d) => d.code === selectedCode);

  const save = () => {
    if (!selectedCode) return;
    setDisposition({ code: selectedCode, date: date || undefined, amount: amount || undefined });
    alert(`Disposition saved: ${selectedCode}`);
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">Select call outcome disposition</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {DISPOSITION_CODES.map((d) => (
          <button
            key={d.code}
            onClick={() => setSelectedCode(d.code)}
            className={`text-xs p-2 rounded-lg border font-medium transition ${
              selectedCode === d.code
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="font-bold">{d.code}</div>
            <div className="opacity-80 text-xs">{isTl ? d.labelTl : d.label}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="space-y-2 border-t pt-3">
          {selected.requiresDate && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-1.5 text-sm" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}
          {selected.requiresAmount && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">Amount (PHP)</label>
              <input type="number" className="w-full border rounded-lg px-3 py-1.5 text-sm" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" />
            </div>
          )}
          <button onClick={save} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700">Save Disposition</button>
        </div>
      )}
    </div>
  );
}
