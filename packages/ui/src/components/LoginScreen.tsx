import React, { useState } from 'react';
import { useAgentStore } from '../store/useAgentStore';
import { useApi } from '../hooks/useApi';

export function LoginScreen() {
  const [agentId, setAgentId] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('agent');
  const [secret, setSecret] = useState(import.meta.env.VITE_AGENT_SECRET || 'dev-agent-secret');
  const [error, setError] = useState('');
  const { login } = useApi();
  const setAuth = useAgentStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(agentId, name, role, secret);
      setAuth(data.token, { agentId: data.agentId, name: data.name, role: data.role });
    } catch {
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 mb-1">Agent Assist</h1>
        <p className="text-gray-500 text-sm mb-6">Philippine Collections Contact Center</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="AGT-001" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Juan dela Cruz" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="agent">Agent</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Secret</label>
            <input type="password" className="w-full border rounded-lg px-3 py-2 text-sm" value={secret} onChange={(e) => setSecret(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Login</button>
        </form>
      </div>
    </div>
  );
}
