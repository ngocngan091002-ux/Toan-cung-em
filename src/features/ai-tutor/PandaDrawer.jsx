import React, { useState } from 'react';
import { processAiMessage } from '../../services/aiService';

export const PandaDrawer = ({ onAiTaskCompleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'panda', text: '🐼 Chào em! Panda là Trợ lý AI học toán của em. Em có thắc mắc bài toán nào cần Panda hỗ trợ không?' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && onAiTaskCompleted) {
      onAiTaskCompleted();
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');
    setIsTyping(true);

    const aiReply = await processAiMessage(userText);
    setIsTyping(false);
    setMessages(prev => [...prev, { sender: 'panda', text: aiReply }]);
  };

  return (
    <>
      {/* Floating Panda Trigger Button */}
      <div className="ai-tutor-trigger" title="Hỏi Trợ lý AI Panda" onClick={toggleOpen}>
        🐼
      </div>

      {/* Floating Chat Drawer */}
      <div className={`ai-tutor-drawer ${isOpen ? 'open' : ''}`}>
        <div className="ai-tutor-header">
          <div className="ai-tutor-title">
            <span style={{ fontSize: '24px' }}>🐼</span>
            <span>Trợ Lý AI Panda (Hỏi Bài)</span>
          </div>
          <button
            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            onClick={() => setIsOpen(false)}
          >
            ✖
          </button>
        </div>

        <div className="ai-chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.sender}`}>
              {msg.text.split('\n').map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg panda">
              🐼 Panda đang suy nghĩ gợi ý...
            </div>
          )}
        </div>

        <form className="ai-chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            placeholder="Hỏi chú Panda bài toán này..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
            Gửi 🚀
          </button>
        </form>
      </div>
    </>
  );
};
