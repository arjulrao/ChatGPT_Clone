import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessage.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';
import { useDispatch, useSelector } from 'react-redux';
import axios  from 'axios';

import {
  ensureInitialChat,
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage,
  setChats
} from '../store/chatSlice.js';

const Home = () => {
const dispatch = useDispatch();
const chats = useSelector(state => state.chat.chats);
const activeChatId = useSelector(state => state.chat.activeChatId);
const input = useSelector(state => state.chat.input);
const isSending = useSelector(state => state.chat.isSending);
const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
const [ socket, setSocket ] = useState(null);

const activeChat = chats.find(c => c.id === activeChatId) || null;

const [ messages, setMessages ] = useState([]);

const handleNewChat = async () => {
    // Local-only: create a new chat object in memory
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return;

    const response = await axios.post("http://localhost:3000/auth/chat", {
      title
    },{
      withCredentials: true
    })
    console.log(response.data)

    getMessages(response.data.chat._id);
    dispatch(startNewChat(response.data.chat));
    setSidebarOpen(false)
  }

  // Ensure messages reflect active chat
   useEffect(() => {

    axios.get("http://localhost:3000/auth/chat", { withCredentials: true })
      .then(response => {
        dispatch(setChats(response.data.chats.reverse()));
      })

    const tempSocket = io("https://cohort-1-project-chat-gpt.onrender.com", {
      withCredentials: true,
    })

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received AI response:", messagePayload);

      setMessages((prevMessages) => [ ...prevMessages, {
        type: 'ai',
        content: messagePayload.content
      } ]);

      dispatch(sendingFinished());
    });

    setSocket(tempSocket);

  }, [dispatch]);



  const sendMessage = async () => {

      const trimmed = input.trim();
      console.log("Sending message:", trimmed);
      if (!trimmed || !activeChatId || isSending) return;
      dispatch(sendingStarted());

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