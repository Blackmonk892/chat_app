import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();
  const typingTimeoutRef = useRef(null);

  const emitStopTyping = () => {
    if (socket && selectedUser) {
      socket.emit("typing:stop", { to: selectedUser._id });
    }
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!socket || !selectedUser) return;

    // If not already "typing", emit start and set the timeout
    if (!typingTimeoutRef.current) {
      socket.emit("typing:start", { to: selectedUser._id });
    } else {
      // Clear previous timeout if user continues typing
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to emit "stop typing" after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping();
      typingTimeoutRef.current = null; // Reset ref after timeout
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage({ text });
    setText("");

    // Stop typing immediately on send
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    emitStopTyping();
  };

  // Cleanup on unmount or when selectedUser changes
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        emitStopTyping(); // Ensure we emit stop if component unmounts while typing
      }
    };
  }, [selectedUser]); // Dependency ensures cleanup runs for the previous chat

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="input input-bordered flex-1"
      />
      <button type="submit" className="btn btn-primary">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
