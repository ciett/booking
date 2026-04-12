import React, { useState, useRef, useEffect } from 'react';
import { Input, Collapse, ConfigProvider } from 'antd';
import { 
    SearchOutlined, 
    QuestionCircleOutlined, 
    MessageOutlined, 
    PhoneOutlined, 
    MailOutlined,
    CloseOutlined,
    SendOutlined,
    RobotOutlined
} from '@ant-design/icons';
import { Button } from '@mui/material';
import api from '../services/api';

const { Panel } = Collapse;

const CustomerService = () => {
    const [searchText, setSearchText] = useState('');

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Xin chào! Tôi là Gemma, trợ lý AI của Booking. Bạn cần hỗ trợ gì ạ?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isChatLoading]);

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
                text: 'Xin lỗi, Gemma đang bận hoặc server chưa bật AI. Bạn vui lòng thử lại sau nhé!' 
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const faqs = [
        {
            key: '1',
            header: 'Làm thế nào để hủy đặt phòng/vé?',
            content: 'Bạn có thể hủy đặt chỗ trong phần "Quản lý đặt chỗ" trên tài khoản của mình. Vui lòng kiểm tra chính sách hủy của nhà cung cấp trước khi thực hiện.'
        },
        {
            key: '2',
            header: 'Tôi có thể thay đổi ngày đi không?',
            content: 'Việc đổi ngày tùy thuộc vào chính sách của hãng hàng không hoặc khách sạn. Bạn có thể tự thực hiện trong chi tiết đơn hàng hoặc liên hệ hotline để được hỗ trợ.'
        },
        {
            key: '3',
            header: 'Làm sao để nhận hóa đơn VAT?',
            content: 'Sau khi hoàn tất thanh toán và sử dụng dịch vụ, bạn có thể yêu cầu xuất hóa đơn trong mục "Lịch sử giao dịch". Hóa đơn điện tử sẽ được gửi qua email trong vòng 7 ngày làm việc.'
        },
        {
            key: '4',
            header: 'Các phương thức thanh toán được hỗ trợ?',
            content: 'Chúng tôi hỗ trợ thẻ tín dụng (Visa, Mastercard), chuyển khoản ngân hàng, ví Momo, ZaloPay và thanh toán tại cửa hàng tiện lợi.'
        }
    ];

    return (
        <ConfigProvider theme={{ token: { colorPrimary: '#003b95' } }}>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header Section */}
                <div className="bg-[#003b95] text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">Trợ giúp & Dịch vụ khách hàng</h1>
                        <div className="relative max-w-2xl mx-auto">
                            <Input 
                                size="large"
                                placeholder="Nhập vấn đề bạn cần giúp đỡ..." 
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="rounded-full py-3 px-6 shadow-lg"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 -mt-8">
                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                            <PhoneOutlined className="text-3xl text-blue-600 mb-3" />
                            <h3 className="font-bold text-lg">Gọi cho chúng tôi</h3>
                            <p className="text-gray-500 text-sm mb-2">Hỗ trợ 24/7 cho mọi vấn đề gấp</p>
                            <span className="text-blue-700 font-bold text-lg">1900 1234</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                            <MessageOutlined className="text-3xl text-green-600 mb-3" />
                            <h3 className="font-bold text-lg">Chat trực tuyến</h3>
                            <p className="text-gray-500 text-sm mb-2">Trao đổi trực tiếp với nhân viên AI</p>
                            <button 
                                onClick={() => setIsChatOpen(true)}
                                className="text-green-700 font-bold hover:underline"
                            >
                                Bắt đầu chat ngay
                            </button>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
                            <MailOutlined className="text-3xl text-red-600 mb-3" />
                            <h3 className="font-bold text-lg">Gửi Email</h3>
                            <p className="text-gray-500 text-sm mb-2">Gửi phản hồi hoặc khiếu nại</p>
                            <span className="text-red-700 font-bold">support@booking.com</span>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <QuestionCircleOutlined className="text-blue-600" />
                            Câu hỏi thường gặp
                        </h2>
                        <Collapse 
                            accordion 
                            ghost 
                            expandIconPosition="end"
                            className="bg-transparent"
                        >
                            {faqs.map(faq => (
                                <Panel 
                                    header={<span className="font-semibold text-gray-700 text-lg">{faq.header}</span>} 
                                    key={faq.key}
                                    className="border-b border-gray-100 last:border-0"
                                >
                                    <p className="text-gray-600 leading-relaxed">{faq.content}</p>
                                </Panel>
                            ))}
                        </Collapse>
                    </div>

                    {/* Still need help? */}
                    <div className="mt-12 text-center p-8 bg-blue-50 rounded-2xl">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">Vẫn chưa tìm thấy câu trả lời?</h3>
                        <p className="text-blue-700 mb-6">Đừng lo lắng, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
                        <Button 
                            variant="contained" 
                            sx={{ backgroundColor: '#003b95', textTransform: 'none', px: 4, py: 1 }}
                        >
                            Liên hệ hỗ trợ ngay
                        </Button>
                    </div>
                </div>

                {/* Floating Chat Widget */}
                {isChatOpen && (
                    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-fade-in-up">
                        {/* Chat Header */}
                        <div className="bg-[#003b95] text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <RobotOutlined className="text-2xl" />
                                <div>
                                    <h3 className="font-bold leading-tight">Trợ lý ảo Gemma</h3>
                                    <p className="text-[10px] text-blue-200">Powered by Ollama AI</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-300">
                                <CloseOutlined />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 p-4 h-[350px] overflow-y-auto bg-gray-50 flex flex-col gap-3">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <RobotOutlined />
                                        </div>
                                    )}
                                    <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                                        msg.sender === 'user' 
                                            ? 'bg-[#003b95] text-white rounded-br-none' 
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex gap-2 justify-start items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <RobotOutlined />
                                    </div>
                                    <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
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
                                className="flex-1 border-none focus:ring-0 outline-none px-2 text-sm"
                            />
                            <button 
                                onClick={handleSendChat}
                                disabled={isChatLoading || !chatInput.trim()}
                                className="w-10 h-10 rounded-full bg-[#003b95] text-white flex items-center justify-center disabled:opacity-50 hover:bg-[#002d73] transition-colors shrink-0"
                            >
                                <SendOutlined />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ConfigProvider>
    );
};

export default CustomerService;