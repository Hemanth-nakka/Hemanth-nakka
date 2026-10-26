import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { ChannelType } from '../types';
import { v4 as uuid } from 'uuid';

export function ConversationSetup() {
  const setConversation = useAgentStore((s) => s.setConversation);
  const agent = useAgentStore((s) => s.agent);
  const [customerId, setCustomerId] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>('voice');
  const [accountNumber, setAccountNumber] = useState('');
  const [dpd, setDpd] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setConversation({
      conversationId: `CONV-${uuid().slice(0, 8).toUpperCase()}`,
      channelType,
      customerId,
      accountNumber: accountNumber || undefined,
      dpd: dpd ? parseInt(dpd) : undefined,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">New Conversation</h2>
        <p className="text-gray-500 text-sm mb-6">Welcome, {agent?.name}</p>
        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={channelType} onChange={(e) => setChannelType(e.target.value as ChannelType)}>
              <option value="voice">Voice</option>
              <option value="chat">Chat</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="CUST-12345" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number (optional)</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="ACC-00001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Days Past Due (optional)</label>
            <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={dpd} onChange={(e) => setDpd(e.target.value)} placeholder="30" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">Start Conversation</button>
        </form>
      </div>
    </div>
  );
}

// polyfill uuid for browser
function v4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
