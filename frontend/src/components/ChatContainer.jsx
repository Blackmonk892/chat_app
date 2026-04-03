import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    setIsTyping,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  // Effect for fetching messages and subscribing to new ones
  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Effect for scrolling to the bottom of the messages
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Effect for handling typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleTypingStart = ({ from }) => {
      if (from === selectedUser?._id) {
        setIsTyping(true);
      }
    };

    const handleTypingStop = ({ from }) => {
      if (from === selectedUser?._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [socket, selectedUser, setIsTyping]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative rounded-none border ${
                    msg.senderId === authUser._id
                      ? "bg-primary text-black border-primary"
                      : "bg-base-200 text-base-content border-white/10" // Using base-200 for other's messages
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="mb-2 border border-black/20"
                    />
                  )}
                  {msg.text && <p className="font-mono">{msg.text}</p>}
                  <p className="text-[10px] mt-1 opacity-75 flex items-center gap-1 font-mono tracking-tighter">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {/* Typing indicator */}
      <div className="h-8 px-6">
        {isTyping && (
          <p className="text-sm text-info animate-pulse font-mono">typing...</p>
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
