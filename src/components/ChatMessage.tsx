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
  const [displayedText, setDisplayedText] = useState(isUser ? message.content : "");
  const [isTyping, setIsTyping] = useState(!isUser);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isUser || !message.content) return;

    let index = 0;
    const delayBeforeStart = 1000;
    const typingSpeed = 15;

    const startTyping = () => {
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + message.content[index]);
        index++;
        if (index >= message.content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, typingSpeed);
    };

    const timeout = setTimeout(startTyping, delayBeforeStart);
    return () => {
      clearTimeout(timeout);
    };
  }, [message, isUser]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [displayedText]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`} ref={containerRef}>
      <div
        className={`max-w-md p-3 rounded-lg shadow-md relative whitespace-pre-wrap ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <div className="text-xs absolute -top-5 left-0 text-gray-400">
          {isUser ? "Bạn" : "Bot"} - {new Date(message.timestamp).toLocaleString()}
        </div>
        <div className="flex items-start gap-2">
          {isUser ? (
            <User size={16} className="mt-1">
              <title>User</title>
            </User>
          ) : (
            <MessageCircle size={16} className="mt-1">
              <title>Bot</title>
            </MessageCircle>
          )}
          <p>
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
