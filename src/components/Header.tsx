import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

const defaultAvatar = "https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff";

const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-end items-center px-6 py-3 border-b border-gray-700 bg-gray-900 relative">
      <div className="relative" ref={menuRef}>
        <img
          src={defaultAvatar}
          alt="avatar"
          className="w-10 h-10 rounded-full cursor-pointer border border-gray-500"
          onClick={toggleMenu}
        />
        {showMenu && (
          <div className="absolute right-0 mt-2 w-52 bg-gray-800 text-sm text-white rounded shadow-lg z-10">
            <div className="p-4 border-b border-gray-600">
              <p className="font-semibold">Tài khoản</p>
              <p className="text-gray-300 break-words">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-700"
            >
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
