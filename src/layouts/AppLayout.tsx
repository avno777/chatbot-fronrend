import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SessionSidebar from "../components/SessionSidebar";
import Header from "../components/Header";
import * as localChat from "../services/localChatService";
import type { Session } from "../types";

interface Props {
  children: React.ReactNode;
  onSelectSession: (id: string) => void;
  onCreateSession: (name: string) => void;
  onDeleteSession: (id: string) => void;
  selectedSession: string | null;
  sessionList: Session[];
  setSessionList: (sessions: Session[]) => void;
}

const AppLayout: React.FC<Props> = ({
  children,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  selectedSession,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sessionList, setSessionList] = React.useState<{ id: string; name: string }[]>(() =>
    localChat.getSessions(user!.id) as { id: string; name: string }[]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreate = (name: string) => {
    onCreateSession(name);
    setSessionList(localChat.getSessions(user!.id) as { id: string; name: string }[]);
  };

  const handleDelete = (id: string) => {
    onDeleteSession(id);
    setSessionList(localChat.getSessions(user!.id) as { id: string; name: string }[]);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      <aside className="w-72 bg-gray-800 text-gray-100 border-r border-gray-700 p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-400">🤖 ChatBot AI</h1>
          <p className="text-sm text-gray-400 mt-1">Xin chào {user?.email}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SessionSidebar
            sessions={sessionList}
            selectedSession={selectedSession || ""}
            onSelect={onSelectSession}
            onCreate={handleCreate}
            onDelete={handleDelete}
          />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-300 text-sm mt-6"
          title="Đăng xuất"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </aside>

      <main className="flex-1 flex flex-col bg-gray-900 text-white overflow-hidden">
        <Header onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
