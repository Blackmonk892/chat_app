import React from "react";
import ChatSidebar from "../components/ChatSidebar";
import { useChatStore } from "../store/useChatStore";

const ChatLayout = ({ children }) => {
  // This layout wraps the chat area and sidebar for consistent flex layout
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 flex flex-col relative">{children}</div>
      <ChatSidebar />
    </div>
  );
};

export default ChatLayout;
