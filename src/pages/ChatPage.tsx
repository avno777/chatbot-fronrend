import React from "react";
import { useAuth } from "../contexts/AuthContext";
import * as localChat from "../services/localChatService";
import ChatMessage from "../components/ChatMessage";
import AppLayout from "../layouts/AppLayout";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<localChat.Message[]>([]);
  const [input, setInput] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [sessionList, setSessionList] = React.useState<
    { id: string; name: string }[]
  >(() => localChat.getSessions(user!.id) as { id: string; name: string }[]);

  // Load phiên đầu tiên nếu có
  React.useEffect(() => {
    if (sessionList.length > 0) {
      const defaultSessionId = sessionList[0].id;
      setSessionId(defaultSessionId);
      setMessages(localChat.getMessages(defaultSessionId));
    }
  }, [sessionList]);

  const handleSelectSession = (id: string) => {
    setSessionId(id);
    setMessages(localChat.getMessages(id));
  };

  const handleCreateSession = (name: string) => {
    const newSession = localChat.createSession(user!.id, name);
    const updated = localChat.getSessions(user!.id);
    setSessionList(updated as { id: string; name: string }[]);
    setSessionId(newSession.id);
    setMessages([]);
  };

  const handleDeleteSession = (id: string) => {
    localChat.deleteSession(id);
    const updated = localChat.getSessions(user!.id);
    setSessionList(updated as { id: string; name: string }[]);
    if (updated.length > 0) {
      setSessionId((updated[0] as { id: string }).id);
      setMessages(localChat.getMessages((updated[0] as { id: string }).id));
    } else {
      setSessionId(null);
      setMessages([]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    let sid = sessionId;

    if (!sid) {
      const label = `Phiên - ${new Date().toLocaleDateString("vi-VN")}`;
      const newSession = localChat.createSession(user!.id, label);
      sid = newSession.id;
      setSessionId(sid);
      setSessionList(
        localChat.getSessions(user!.id) as { id: string; name: string }[]
      ); // ✅ cập nhật danh sách phiên
    }

    const userMsg = localChat.addMessage(sid!, "user", input);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = `Xin chào! Đây là phản hồi tự động cho tin nhắn của bạn: ${input}.`;
      console.log("BOT REPLY >>>", reply); // ✅ debug log
      const botMsg = localChat.addMessage(sid!, "bot", String(reply)); // ép chắc chắn là string
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };
  console.log("ChatPage rendered", messages);

  return (
    <AppLayout
      sessionList={sessionList}
      setSessionList={setSessionList}
      onSelectSession={handleSelectSession}
      onCreateSession={handleCreateSession}
      onDeleteSession={handleDeleteSession}
      selectedSession={sessionId}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 py-4 px-4">
          {messages.map(
            (msg) => (
              console.log("Rendering message:", msg), // ✅ debug log
              (<ChatMessage key={msg.id} message={msg} />)
            )
          )}
        </div>

        <div className="border-t border-gray-700 p-3 flex gap-2 items-center bg-gray-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(); // Gửi tin nhắn khi nhấn Enter
              }
            }}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-gray-900 text-white border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            title="Gửi tin nhắn"
          >
            Gửi
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;
