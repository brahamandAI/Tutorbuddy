"use client"
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  student: {
    id: string;
    user: {
      id: string;
      name: string;
    };
  };
  lastMessage?: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/tutor/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch conversations');

      const data = await response.json();
      setConversations(data);

      if (!selectedConversation && data.length > 0) {
        setSelectedConversation(data[0].id);
      }
    } catch (error) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/tutor/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError('Failed to load messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      const response = await fetch(`/api/tutor/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setNewMessage('');
      fetchMessages(selectedConversation);
    } catch (error) {
      setError('Failed to send message');
    }
  };

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex">
          <aside className="w-1/3 border-r pr-4">
            <h2 className="font-semibold mb-2">Conversations</h2>
            <ul>
              {conversations.map((conv) => (
                <li
                  key={conv.id}
                  className={`cursor-pointer p-2 rounded mb-1 ${selectedConversation === conv.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  {conv.student.user.name}
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 text-xs text-white bg-blue-500 rounded-full px-2 py-0.5">
                      {conv.unreadCount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </aside>
          <section className="w-2/3 pl-4">
            <div className="h-96 overflow-y-auto border rounded p-4 mb-2 bg-white">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-2 ${msg.senderId === user?.id ? 'text-right' : 'text-left'}`}>
                  <span className="inline-block px-3 py-1 rounded bg-gray-200">
                    {msg.content}
                  </span>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {selectedConversation && (
              <form onSubmit={sendMessage} className="flex">
                <input
                  type="text"
                  className="flex-1 border rounded-l px-3 py-2"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
} 