import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Chatbot.css";

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThreadOptionsId, setShowThreadOptionsId] = useState(null);
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);

  // Fetch all chat threads for the logged-in user
  const fetchThreads = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/history/chat/threads", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setThreads(data);
      }
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    if (showChat) {
      fetchThreads();
    }
  }, [showChat]);

  // Load messages for the selected thread
  const handleSelectThread = async (threadId) => {
    setActiveThreadId(threadId);
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/history/chat/messages/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data.map(msg => ({ role: msg.role, text: msg.text })));
      }
    } catch (err) {
      console.error("Error loading thread messages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start a fresh, new conversation
  const handleNewChat = () => {
    setActiveThreadId(null);
    setMessages([]);
    setInput("");
  };

  // Rename a conversation thread
  const handleRenameThread = async (threadId) => {
    if (!editingTitle.trim()) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/history/chat/threads/${threadId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingTitle })
      });
      if (res.ok) {
        setThreads(prev => prev.map(t => t._id === threadId ? { ...t, title: editingTitle } : t));
        setEditingThreadId(null);
        setEditingTitle("");
        setShowThreadOptionsId(null);
      }
    } catch (err) {
      console.error("Error renaming thread:", err);
    }
  };

  // Delete a conversation thread
  const handleDeleteThread = async (threadId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this conversation?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/history/chat/threads/${threadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setThreads(prev => prev.filter(t => t._id !== threadId));
        if (activeThreadId === threadId) {
          handleNewChat();
        }
        setShowThreadOptionsId(null);
      }
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  // Auto-scroll to bottom when messages or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // Click outside to close thread options menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showThreadOptionsId && !e.target.closest(".thread-options-container")) {
        setShowThreadOptionsId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showThreadOptionsId]);

  // 🎤 Speech-to-Text Voice Input
  const startListening = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
  };

  // 🤖 Send message to chatbot
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          message: userMsg.text,
          threadId: activeThreadId
        })
      });

      const data = await res.json();

      const botMsg = {
        role: "bot",
        text: data.reply || "No response"
      };

      setMessages((prev) => [...prev, botMsg]);

      // If a new thread was created automatically, update states and fetch threads list
      if (data.threadId && data.threadId !== activeThreadId) {
        setActiveThreadId(data.threadId);
        fetchThreads();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Unable to connect to AI service. Please try again later." }
      ]);
    }

    setLoading(false);
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      {/* Open Button */}
      <button className="ai-open-btn" onClick={() => setShowChat(true)}>
        <span className="ai-btn-pulse"></span>
        <span className="ai-btn-icon">🤖</span>
        <span className="ai-btn-text">AI-Powered Farming Assistant</span>
      </button>

      {/* Popup - Portal to body */}
      {showChat && createPortal(
        <div className="chat-overlay" onClick={(e) => {
          if (e.target.classList.contains('chat-overlay')) setShowChat(false);
        }}>
          <div className={`chat-modal double-column ${isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"}`}>

            {/* 🚪 ChatGPT SIDEBAR */}
            {isSidebarOpen && (
              <div className="chat-sidebar">
                <button className="new-chat-btn" onClick={handleNewChat}>
                  <span>➕</span> New Chat
                </button>

                <div className="sidebar-threads-list">
                  <div className="sidebar-section-title">Previous Chats</div>
                  
                  {!isLoggedIn ? (
                    <div className="sidebar-empty">🔒 Log in to save chats!</div>
                  ) : threads.length === 0 ? (
                    <div className="sidebar-empty">No conversations yet</div>
                  ) : (
                    threads.map((t) => (
                      <div 
                        key={t._id} 
                        className={`thread-item ${activeThreadId === t._id ? "active" : ""}`}
                        onClick={() => handleSelectThread(t._id)}
                      >
                        <span className="thread-icon">💬</span>
                        
                        {editingThreadId === t._id ? (
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleRenameThread(t._id)}
                            onKeyDown={(e) => e.key === "Enter" && handleRenameThread(t._id)}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="thread-title">{t.title}</span>
                        )}

                        <div className="thread-options-container" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="thread-menu-trigger"
                            onClick={() => setShowThreadOptionsId(showThreadOptionsId === t._id ? null : t._id)}
                          >
                            •••
                          </button>
                          
                          {showThreadOptionsId === t._id && (
                            <div className="thread-dropdown">
                              <button 
                                className="dropdown-btn"
                                onClick={() => {
                                  setEditingThreadId(t._id);
                                  setEditingTitle(t.title);
                                }}
                              >
                                ✏️ Rename
                              </button>
                              <button 
                                className="dropdown-btn delete"
                                onClick={(e) => handleDeleteThread(t._id, e)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    ))
                  )}
                </div>

                <div className="sidebar-footer">
                  <span>Logged in as: {JSON.parse(localStorage.getItem("user"))?.name || "Farmer"}</span>
                </div>
              </div>
            )}

            {/* 💬 MAIN CHAT WORKSPACE */}
            <div className="chat-main">
              
              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <button 
                    className="sidebar-toggle-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title="Toggle Sidebar"
                  >
                    ☰
                  </button>
                  <div className="chat-header-avatar">🤖</div>
                  <div className="chat-header-info">
                    <span className="chat-header-title">Krishi AI Assistant</span>
                    <span className="chat-header-status">
                      <span className="status-dot"></span>
                      Online
                    </span>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setShowChat(false)} title="Close chat">✕</button>
              </div>

              {/* Welcome Banner */}
              <div className="chat-welcome-banner">
                <span>🌱 {getGreeting()}! Ask me about crops, soil health, fertilizers, or weather.</span>
              </div>

              {/* Messages */}
              <div className="chat-body" ref={chatBodyRef}>
                {messages.length === 0 && (
                  <div className="chat-welcome-screen">
                    <div className="ai-mascot">🌾🤖🌾</div>
                    <h2>Welcome to Krishi AI</h2>
                    <p>Ask anything about soil nutrients, crop recommendations, weather updates, and mandi prices!</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg-wrapper ${msg.role}`}>
                    {msg.role === "bot" && (
                      <div className="chat-msg-avatar bot-avatar">🤖</div>
                    )}
                    <div className={`chat-bubble ${msg.role}`}>
                      <div className="bubble-text">{msg.text}</div>
                      <div className="bubble-time">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="chat-msg-avatar user-avatar">👤</div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="chat-msg-wrapper bot">
                    <div className="chat-msg-avatar bot-avatar">🤖</div>
                    <div className="chat-bubble bot typing-bubble">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length === 0 && (
                <div className="chat-suggestions">
                  {["Best crop for summer?", "How to improve soil?", "Water management tips", "Organic fertilizers"].map((suggestion, i) => (
                    <button
                      key={i}
                      className="suggestion-chip"
                      onClick={() => {
                        setInput(suggestion);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="chat-footer">
                <div className="chat-input-wrapper">
                  <input
                    type="text"
                    placeholder="Type your farming question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                  />
                  <button className="voice-btn" onClick={startListening} title="Voice input" disabled={loading}>
                    🎤
                  </button>
                </div>
                <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()} title="Send message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>

            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Chatbot;