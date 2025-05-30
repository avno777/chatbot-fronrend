import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SessionSidebar from "../components/SessionSidebar";
import * as localChat from "../services/localChatService";

interface Props {
  children: React.ReactNode;
}

interface Session {
  id: string;
  name: string;
  // add other properties if needed
}

const AppLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sessions: Session[] = localChat.getSessions(user!.id) as Session[];
  const [selectedSession, setSelectedSession] = React.useState(sessions[0]?.id || "");
  const [sessionList, setSessionList] = React.useState<Session[]>(sessions);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreate = (name: string) => {
    const newSession = localChat.createSession(user!.id, name);
    setSessionList(localChat.getSessions(user!.id) as Session[]);
    setSelectedSession(newSession.id);
  };

  const handleDelete = (id: string) => {
    localChat.deleteSession(id);
    const updated = localChat.getSessions(user!.id) as Session[];
    setSessionList(updated);
    setSelectedSession(updated[0]?.id || "");
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-900">
      <aside className="w-72 bg-white border-r shadow-sm p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600">🤖 ChatBot AI</h1>
          <p className="text-sm text-gray-400 mt-1">Xin chào {user?.email}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SessionSidebar
            sessions={sessionList}
            selectedSession={selectedSession}
            onSelect={setSelectedSession}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm mt-6"
          title="Đăng xuất"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </aside>

      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
