// src/components/ChatMessage.tsx
import React, { useEffect, useState, useRef } from "react";
import { MessageCircle, User } from "lucide-react";
import RatingFeedback from "./RatingFeedback";

interface Props {
  message: {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: string;
  };
}

const ChatMessage: React.FC<Props> = ({ message }) => {
  const isUser = message.role === "user";
  const [displayedText, setDisplayedText] = useState(
    isUser ? message.content : ""
  );
  const [isTyping, setIsTyping] = useState(!isUser);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isUser || !message.content) return;

    const rawContent = message.content.trim(); // loại bỏ khoảng trắng đầu/cuối
    const words = rawContent.split(" ").filter(Boolean); // lọc bỏ phần tử rỗng

    let index = 0;
    setDisplayedText(""); // reset trước

    const interval = setInterval(() => {
      if (index >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
        return;
      }

      const word = words[index];
      if (word !== undefined) {
        setDisplayedText((prev) =>
          prev.length === 0 ? word : `${prev} ${word}`
        );
      }
      index++;
    }, 150);

    return () => clearInterval(interval);
  }, [message, isUser]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [displayedText]);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-4`}
      ref={containerRef}
    >
      <div
        className={`max-w-md p-3 rounded-lg shadow relative whitespace-pre-wrap ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
        }`}
      >
        <div
          className={`text-xs mb-1 ${
            isUser
              ? "text-right pr-2 text-blue-100"
              : "text-left pl-2 text-gray-400"
          }`}
        >
          {isUser ? "Bạn" : "Bot"} •{" "}
          {new Date(message.timestamp).toLocaleString("vi-VN")}
        </div>
        <div className="flex items-start gap-2">
          {isUser ? (
            <User size={16} className="mt-1 text-gray-300" />
          ) : (
            <MessageCircle size={16} className="mt-1 text-gray-300" />
          )}
          <p className="leading-relaxed break-words">
            {isTyping ? (
              <span className="text-gray-400 animate-pulse">Đang gõ...</span>
            ) : (
              displayedText
            )}
          </p>
        </div>
        {!isUser && !isTyping && <RatingFeedback messageId={message.id} />}
      </div>
    </div>
  );
};

export default ChatMessage;
