import { useEffect, useRef, useState } from "react";
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

  // Modal state for delete confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
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
                  className={`chat-bubble relative rounded-none border cursor-pointer ${
                    msg.senderId === authUser._id
                      ? "bg-primary text-black border-primary"
                      : "bg-base-200 text-base-content border-white/10"
                  }`}
                  onClick={() => {
                    if (msg.senderId === authUser._id && !msg.isDeleted) {
                      setMessageToDelete(msg);
                      setModalOpen(true);
                    }
                  }}
                  title={
                    msg.senderId === authUser._id && !msg.isDeleted
                      ? "Click to manage message"
                      : undefined
                  }
                >
                  {msg.isDeleted ? (
                    <span className="italic text-gray-400">
                      Message deleted
                    </span>
                  ) : (
                    <>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="mb-2 border border-black/20"
                        />
                      )}
                      {msg.text && <p className="font-mono">{msg.text}</p>}
                    </>
                  )}
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
      {/* Delete Confirmation Modal */}
      {modalOpen && messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-200 rounded-lg shadow-lg p-8 max-w-xs w-full text-center relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-error text-xl"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h2 className="text-lg font-bold mb-2">Delete Message?</h2>
            <p className="mb-6 text-gray-400">This action cannot be undone.</p>
            <button
              className="btn btn-error w-full mb-2"
              onClick={async () => {
                setModalOpen(false);
                setMessageToDelete(null);
                // Use zustand hook to get the function
                const { deleteMessage } = useChatStore.getState();
                if (deleteMessage) await deleteMessage(messageToDelete._id);
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-ghost w-full"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
