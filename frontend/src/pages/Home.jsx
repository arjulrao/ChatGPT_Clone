import React, { useEffect, useState } from 'react';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessage.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';

const Home = () => {
  // Local, in-memory state (no redux, no socket) so UI can be tested offline.
  const [chats, setChats] = useState(() => [
    { _id: 'chat-1', title: 'Main', messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState(chats[0]._id);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [ sidebarOpen, setSidebarOpen ] = useState(false);

  const activeChat = chats.find(c => c._id === activeChatId) || null;

  const [ messages, setMessages ] = useState([]);

  const handleNewChat = async () => {
    // Local-only: create a new chat object in memory
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return;

    const newChat = { _id: `chat-${Date.now()}`, title, messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat._id);
    setMessages([]);
    setSidebarOpen(false);
  }

  // Ensure messages reflect active chat
  useEffect(() => {
    if (activeChat) setMessages(activeChat.messages || []);
  }, [activeChat]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;
    setIsSending(true);

    const newUserMsg = { type: 'user', content: trimmed };
    const newMessages = [ ...messages, newUserMsg ];
    setMessages(newMessages);
    setInput('');

    try {
      const reply = await fakeAIReply(trimmed);
      const aiMsg = { type: 'ai', content: reply };
      setMessages(prev => [ ...prev, aiMsg ]);

      // persist into chats array for simple local history
      setChats(prev => prev.map(c => c._id === activeChatId ? { ...c, messages: [ ...newMessages, aiMsg ] } : c));
    } catch {
      setMessages(prev => [ ...prev, { type: 'ai', content: 'Error fetching AI response.' } ]);
    } finally {
      setIsSending(false);
    }
  }

  const getMessages = (chatId) => {
    const c = chats.find(x => x._id === chatId);
    setMessages(c ? (c.messages || []) : []);
  }

  return (
  <div className="chat-layout minimal">
      {/* Desktop-only New Chat button (top-left) */}
      <button type="button" className="new-chat-desktop" onClick={handleNewChat} aria-label="New chat">
        <span className="new-chat-label">New Chat</span>
      </button>

      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />

      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setActiveChatId(id);
          setSidebarOpen(false);
          getMessages(id);
        }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />

      <main className="chat-main" role="main">
    {/* pre-chat banner removed per request */}

        <ChatMessages messages={messages} isSending={isSending} />

        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => setInput(v)}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;