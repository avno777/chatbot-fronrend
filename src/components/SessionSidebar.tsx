import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface Props {
  sessions: { id: string; name: string }[];
  selectedSession: string;
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}

const SessionSidebar: React.FC<Props> = ({
  sessions,
  selectedSession,
  onSelect,
  onCreate,
  onDelete,
}) => {
  const [newSessionName, setNewSessionName] = useState("");

  const handleCreate = () => {
    if (newSessionName.trim()) {
      onCreate(newSessionName.trim());
      setNewSessionName("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tạo phiên */}
      <div className="flex">
        <input
          className="flex-1 bg-gray-700 border border-gray-600 text-sm text-white rounded-l px-2 py-1 placeholder-gray-400"
          placeholder="Tên phiên mới..."
          value={newSessionName}
          onChange={(e) => setNewSessionName(e.target.value)}
        />
        <button
          title="Tạo phiên mới"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r"
          onClick={handleCreate}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Danh sách phiên */}
      <div className="flex flex-col gap-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-all ${
              selectedSession === session.id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            }`}
            onClick={() => onSelect(session.id)}
            title={`Chọn phiên "${session.name}"`}
          >
            <span className="truncate">{session.name}</span>
            <span title="Xóa phiên">
              <Trash2
                size={16}
                className="text-gray-400 hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(session.id);
                }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionSidebar;
