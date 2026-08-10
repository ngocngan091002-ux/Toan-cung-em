import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import { Bot, Send, Sparkles, MessageCircle } from 'lucide-react';

export const AiTutorTab: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'panda' | 'student'; text: string }>>([
    {
      sender: 'panda',
      text: '🐼 Chào em! Chú Panda là Trợ lý AI học toán của em. Em chưa hiểu phép tính hay đề bài nào, hãy nhắn cho Panda biết để chú đặt câu hỏi gợi ý cho em tự giải nhé!'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'student', text: userText }]);
    setInputVal('');
    setLoading(true);

    const reply = await aiService.askPandaAi(userText);
    setLoading(false);

    setMessages(prev => [...prev, { sender: 'panda', text: reply }]);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border-4 border-sky-300 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[70vh]">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🐼
          </div>
          <div>
            <h2 className="font-fredoka text-lg font-bold">TRỢ LÝ TOÁN HỌC AI PANDA</h2>
            <p className="text-[11px] text-sky-100 font-semibold">Phương pháp gợi mở Socratic • Không làm bài thay</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'student' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
              msg.sender === 'student' ? 'bg-sky-500 text-white' : 'bg-amber-100 border border-amber-300'
            }`}>
              {msg.sender === 'student' ? '👦' : '🐼'}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm font-semibold leading-relaxed shadow-xs ${
                msg.sender === 'student'
                  ? 'bg-sky-500 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border-2 border-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text.split('\n').map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-sm">
              🐼
            </div>
            <div className="bg-white border-2 border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs font-bold text-slate-500 animate-pulse">
              🐼 Panda đang suy nghĩ gợi ý...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t-2 border-slate-200 flex gap-2">
        <input
          type="text"
          placeholder="Hỏi chú Panda bài toán này (ví dụ: giải thích phép cộng có nhớ)..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-sky-500 rounded-2xl text-sm font-bold outline-none"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white font-black px-5 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 text-xs"
        >
          <span>Gửi</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
