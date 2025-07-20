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
  tutor: {
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
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch conversations');

      const data = await response.json();
      setConversations(data);

      // Select first conversation if none selected
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
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
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
      const response = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      setError('Failed to send message');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {conversation.tutor.user.name}
                  </h3>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}

          {conversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                {conversations.find(c => c.id === selectedConversation)?.tutor.user.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
} 