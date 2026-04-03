import React, { useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

// NOTE: Assuming these components exist and are structured similarly
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { selectedUser, isTyping, setIsTyping } = useChatStore();
  const { socket } = useAuthStore();

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTypingStart = ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      setIsTyping(false); // Reset on cleanup
    };
  }, [socket, selectedUser, setIsTyping]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4">
        <Messages />
      </div>

      <div className="p-4 border-t">
        <div className="h-6">
          {isTyping && (
            <p className="text-sm text-gray-500 animate-pulse">typing...</p>
          )}
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
