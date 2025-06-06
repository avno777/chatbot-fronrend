import React from "react";
import { useAuth } from "../contexts/AuthContext";
import * as chatService from "../services/chatService";
import * as sessionService from "../services/sessionService";
import ChatMessage from "../components/ChatMessage";
import AppLayout from "../layouts/AppLayout";
import socket from "../utils/socket";
import type { Message, Session } from "../types";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [sessionList, setSessionList] = React.useState<Session[]>([]);

  React.useEffect(() => {
    const init = async () => {
      if (!user) return;
      const sessions = await sessionService.getSessions(user.id);
      setSessionList(sessions);

      if (sessions.length > 0) {
        const defaultSessionId = sessions[0].id;
        setSessionId(defaultSessionId);
        const msgs = await chatService.getMessages(defaultSessionId);
        setMessages(msgs);
      }
    };

    init();

    // socket join room
    socket.emit("join", user?.id);
    interface ChatMessageData {
      session_id: string;
      messages: Message[];
    }

    socket.on("chat_message", (data: ChatMessageData) => {
      if (data.session_id === sessionId) {
        setMessages((prev: Message[]) => [...prev, ...data.messages]);
      }
    });

    return () => {
      socket.off("chat_message");
    };
  }, [user, sessionId]);

  const handleSelectSession = async (id: string) => {
    setSessionId(id);
    const msgs = await chatService.getMessages(id);
    setMessages(msgs);
  };

  const handleCreateSession = async (name: string) => {
    const newSession = await sessionService.createSession(user!.id, name);
    const sessions = await sessionService.getSessions(user!.id);
    setSessionList(sessions);
    setSessionId(newSession.id);
    setMessages([]);
  };

  const handleDeleteSession = async (id: string) => {
    await sessionService.deleteSession(id);
    const sessions = await sessionService.getSessions(user!.id);
    setSessionList(sessions);
    if (sessions.length > 0) {
      setSessionId(sessions[0].id);
      const msgs = await chatService.getMessages(sessions[0].id);
      setMessages(msgs);
    } else {
      setSessionId(null);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    let sid = sessionId;

    if (!sid) {
      const label = `Phiên - ${new Date().toLocaleDateString("vi-VN")}`;
      const newSession = await sessionService.createSession(user.id, label);
      sid = newSession.id;
      setSessionId(sid);
      const sessions = await sessionService.getSessions(user.id);
      setSessionList(sessions);
    }

    const userMsg: Message = {
      userId: user.id,
      agentId: "1",
      sessionId: sid!,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      await chatService.saveMessages({
        userId: user.id,
        agentId: "1",
        sessionId: sid,
        role: "user",
        message: userMsg.content,
      });
      // Tin nhắn phản hồi sẽ được nhận qua socket
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

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
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>

        <div className="border-t border-gray-700 p-3 flex gap-2 items-center bg-gray-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
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

// import React from "react";
// import { useAuth } from "../contexts/AuthContext";
// import * as localChat from "../services/localChatService";
// import ChatMessage from "../components/ChatMessage";
// import AppLayout from "../layouts/AppLayout";
// import { v4 as uuidv4 } from "uuid";
// import type { Message } from "../types";

// const ChatPage: React.FC = () => {
//   const { user } = useAuth();
//   const [messages, setMessages] = React.useState<Message[]>([]);
//   const [input, setInput] = React.useState("");
//   const [sessionId, setSessionId] = React.useState<string | null>(null);
//   const [sessionList, setSessionList] = React.useState(() =>
//     localChat.getSessions(user!.id)
//   );

//   // Load phiên đầu tiên nếu có
//   React.useEffect(() => {
//     if (sessionList.length > 0) {
//       const defaultSessionId = sessionList[0].id;
//       setSessionId(defaultSessionId);
//       setMessages(localChat.getMessages(defaultSessionId));
//     }
//   }, [sessionList]);

//   const handleSelectSession = (id: string) => {
//     setSessionId(id);
//     setMessages(localChat.getMessages(id));
//   };

//   const handleCreateSession = (name: string) => {
//     const newSession = localChat.createSession(user!.id, name);
//     const updated = localChat.getSessions(user!.id);
//     setSessionList(updated);
//     setSessionId(newSession.id);
//     setMessages([]);
//   };

//   const handleDeleteSession = (id: string) => {
//     localChat.deleteSession(id);
//     const updated = localChat.getSessions(user!.id);
//     setSessionList(updated);
//     if (updated.length > 0) {
//       setSessionId(updated[0].id);
//       setMessages(localChat.getMessages(updated[0].id));
//     } else {
//       setSessionId(null);
//       setMessages([]);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     let sid = sessionId;

//     // Tạo phiên nếu chưa có
//     if (!sid) {
//       const label = `Phiên - ${new Date().toLocaleDateString("vi-VN")}`;
//       const newSession = localChat.createSession(user!.id, label);
//       sid = newSession.id;
//       setSessionId(sid);
//       setSessionList(localChat.getSessions(user!.id));
//     }

//     const userMsg: Message = {
//       id: uuidv4(),
//       role: "user",
//       content: input.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     const updated = [...messages, userMsg];
//     setMessages(updated);
//     localChat.saveMessages(sid, updated);
//     setInput("");

//     try {
//       const botReply = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: "1",
//           agent_id: "1",
//           message: userMsg.content,
//           response: "",
//           rate: 0,
//           feedback: "",
//           timestamp: new Date().toISOString(),
//         }),
//       });
//       const data = await botReply.json();

//       const botMsg: Message = {
//         id: uuidv4(),
//         role: "bot",
//         content: data.message,
//         timestamp: new Date().toISOString(),
//       };

//       const finalMessages = [...updated, botMsg];
//       setMessages(finalMessages);
//       localChat.saveMessages(sid, finalMessages);
//     } catch (err) {
//       console.error("Gọi API thất bại:", err);
//     }
//   };

//   return (
//     <AppLayout
//       sessionList={sessionList}
//       setSessionList={setSessionList}
//       onSelectSession={handleSelectSession}
//       onCreateSession={handleCreateSession}
//       onDeleteSession={handleDeleteSession}
//       selectedSession={sessionId}
//     >
//       <div className="flex flex-col h-full overflow-hidden">
//         <div className="flex-1 overflow-y-auto space-y-4 py-4 px-4">
//           {messages.map((msg) => (
//             <ChatMessage key={msg.id} message={msg} />
//           ))}
//         </div>

//         <div className="border-t border-gray-700 p-3 flex gap-2 items-center bg-gray-800">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSend();
//               }
//             }}
//             placeholder="Nhập tin nhắn..."
//             className="flex-1 bg-gray-900 text-white border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-500"
//           />
//           <button
//             onClick={handleSend}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             title="Gửi tin nhắn"
//           >
//             Gửi
//           </button>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default ChatPage;
