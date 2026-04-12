import React, { useState, useRef, useEffect } from 'react';
import { CloseOutlined, SendOutlined, RobotOutlined, MessageOutlined } from '@ant-design/icons';
import api from '../services/api';

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Xin chào! Tôi là AI Assistant. Bạn cần hỗ trợ gì ạ?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [chatMessages, isChatLoading, isOpen]);

    const handleSendChat = async () => {
        if (!chatInput.trim()) return;
        
        const userMsg = chatInput.trim();
        setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const res = await api.post('/chat/ask', { message: userMsg });
            setChatMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { 
                sender: 'bot', 
                text: 'Xin lỗi, quá tải hệ thống AI. Bạn vui lòng thử lại sau!' 
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Widget Window */}
            {isOpen && (
                <div className="w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up mb-4" style={{ height: '450px' }}>
                    {/* Chat Header */}
                    <div className="bg-[#006ce4] text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#006ce4] text-xl">
                                <RobotOutlined />
                            </div>
                            <div>
                                <h3 className="font-bold leading-tight">AI Assistant</h3>
                                <div className="text-xs text-blue-100 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Luôn trực tuyến
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                            <CloseOutlined />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 p-4 overflow-y-auto bg-[#f9fafb] flex flex-col gap-4">
                        <div className="text-center text-xs text-gray-400 mb-2">Hôm nay</div>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#006ce4] shrink-0 border border-blue-200 mt-auto">
                                        <RobotOutlined />
                                    </div>
                                )}
                                <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-[#006ce4] text-white rounded-br-none' 
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex gap-2 justify-start items-end">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#006ce4] shrink-0 border border-blue-200">
                                    <RobotOutlined />
                                </div>
                                <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Footer */}
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                        <input 
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder="Nhập câu hỏi..."
                            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-[#006ce4] outline-none"
                        />
                        <button 
                            onClick={handleSendChat}
                            disabled={isChatLoading || !chatInput.trim()}
                            className="w-10 h-10 rounded-full bg-[#006ce4] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#003580] transition-colors shrink-0 shadow-md"
                        >
                            <SendOutlined />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-[#006ce4] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#003580] transition-transform hover:scale-110 active:scale-95"
                    style={{ boxShadow: '0 8px 24px rgba(0, 108, 228, 0.4)' }}
                >
                    <MessageOutlined className="text-2xl" />
                </button>
            )}
        </div>
    );
};

export default FloatingChatbot;
