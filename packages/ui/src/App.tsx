import React from 'react';
import { useAgentStore } from './store/useAgentStore';
import { LoginScreen } from './components/LoginScreen';
import { ConversationSetup } from './components/ConversationSetup';
import { ConversationHeader } from './components/ConversationHeader';
import { AssistPanel } from './components/AssistPanel';
import { useWebSocket } from './hooks/useWebSocket';

function ActiveSession() {
  useWebSocket();
  return (
    <div className="flex flex-col h-screen">
      <ConversationHeader />
      <div className="flex-1 overflow-hidden">
        <AssistPanel />
      </div>
    </div>
  );
}

export default function App() {
  const token = useAgentStore((s) => s.token);
  const conversation = useAgentStore((s) => s.conversation);

  if (!token) return <LoginScreen />;
  if (!conversation) return <ConversationSetup />;
  return <ActiveSession />;
}
