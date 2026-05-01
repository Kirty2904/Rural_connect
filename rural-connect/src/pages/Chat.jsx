import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { io } from 'socket.io-client'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState(null) // partner userId
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)
  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedChat),
    [conversations, selectedChat],
  )

  // Load conversation partners (simple: show all workers and employers from search endpoint or skip until available)
  useEffect(() => {
    let mounted = true
    // Minimal: use workers as chat candidates
    api.get('/api/workers').then(({ data }) => {
      if (!mounted) return
      const mapped = data.map(w => ({
        id: w._id,
        name: w.name,
        lastMessage: '',
        time: '',
        unread: 0,
        avatar: '👤',
        partnerUserId: null, // unknown without extra endpoint
      }))
      setConversations(mapped)
    }).catch(() => {
      setConversations([])
    })
    return () => { mounted = false }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Connect socket when a chat is selected
  useEffect(() => {
    if (!selectedChat) return
    const token = localStorage.getItem('rc_token')
    socketRef.current = io(import.meta.env.VITE_API_BASE || 'http://localhost:5000', { auth: { token } })
    socketRef.current.on('message:receive', (data) => {
      if (data.senderId === selectedChat || data.receiverId === selectedChat) {
        setMessages((prev) => [...prev, data])
      }
    })
    return () => {
      socketRef.current && socketRef.current.disconnect()
    }
  }, [selectedChat])

  const openChat = async (workerId) => {
    // In absence of partner userId mapping, use workerId as partner identifier if API supports; otherwise skip
    setSelectedChat(workerId)
    try {
      const { data } = await api.get(`/api/messages?withUser=${workerId}`)
      setMessages(data.map(m => ({
        id: m._id,
        text: m.message,
        sender: m.senderId === user?._id ? 'me' : 'other',
        time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })))
    } catch {
      setMessages([])
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return
    try {
      const payload = { receiverId: selectedChat, message }
      const { data } = await api.post('/api/messages', payload)
      setMessages((prev) => [
        ...prev,
        {
          id: data._id,
          text: data.message,
          sender: 'me',
          time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      socketRef.current && socketRef.current.emit('message:send', payload)
      setMessage('')
    } catch {
      // noop
    }
  }

  return (
    <div className="py-8">
      <div className="app-shell">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-3xl font-semibold text-slate-900"
        >
          {t('chat.title')}
        </motion.h1>

        <div className="surface-card flex h-[calc(100vh-220px)] overflow-hidden">
          {/* Sidebar */}
          <div className="flex w-full flex-col border-r border-slate-200 bg-white md:w-1/3">
            <div className="border-b border-slate-200 p-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="input-field w-full"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  onClick={() => openChat(conversation.id)}
                  className={`cursor-pointer border-b border-slate-100 p-4 transition-colors ${
                    selectedChat === conversation.id ? 'bg-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{conversation.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="bg-rural-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex flex-1 flex-col bg-slate-50">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{selectedConversation?.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{selectedConversation?.name}</h3>
                      <p className="text-sm text-slate-500">Online</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      📞
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      📹
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs rounded-2xl px-4 py-2 lg:max-w-md ${
                            msg.sender === 'me'
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-800 shadow-sm'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === 'me' ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-slate-200 bg-white p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      📎
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={t('chat.typeMessage')}
                      className="input-field flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="btn-primary px-6 py-3"
                      disabled={!message.trim()}
                    >
                      {t('chat.send')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-600 text-lg">{t('chat.noChat')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat


