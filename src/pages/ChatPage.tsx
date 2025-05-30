import React from "react";
import { useAuth } from "../contexts/AuthContext";
import * as localChat from "../services/localChatService";
import ChatMessage from "../components/ChatMessage";
import AppLayout from "../layouts/AppLayout";

interface Session {
  id: string;
  name: string;
  // add other properties if needed
}
const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<localChat.Message[]>([]);
  const [input, setInput] = React.useState("");
  const [sessionId, setSessionId] = React.useState("");

  React.useEffect(() => {
    const sessions = localChat.getSessions(user!.id) as Session[];
    if (sessions.length > 0) {
      const defaultSessionId = sessions[0].id;
      setSessionId(defaultSessionId);
      setMessages(localChat.getMessages(defaultSessionId));
    }
  }, [user]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = localChat.addMessage(sessionId, "user", input);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Fake bot response
    const botContent = `Bạn vừa nói: "${input}". Đây là phản hồi từ bot.`;
    setTimeout(() => {
      const botMsg = localChat.addMessage(sessionId, "bot", botContent);
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      <div className="border-t p-3 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          title="Gửi tin nhắn"
        >
          Gửi
        </button>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
