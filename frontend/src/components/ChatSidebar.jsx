import React from "react";
import { useChatStore } from "../store/useChatStore";

// Consistent sidebar width (matches left sidebar)
const SIDEBAR_WIDTH = "w-80 max-w-xs min-w-[18rem]";

const ChatSidebar = () => {
  const { selectedUser, messages, isSidebarOpen, setSidebarOpen } =
    useChatStore();

  if (!selectedUser || !isSidebarOpen) return null;

  // Filter media messages (images only for now)
  const mediaMessages = messages.filter((msg) => msg.image && !msg.isDeleted);

  return (
    <aside
      className={`hidden md:flex flex-col h-full bg-base-200 border-l border-white/10 ${SIDEBAR_WIDTH} transition-all duration-200`}
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center py-8 px-4 border-b border-white/10 bg-base-200">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/30 shadow-lg"
          />
          {/* Online dot (optional, for direct chats) */}
          <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-base-200 bg-success"></span>
        </div>
        <div className="mt-4 text-center">
          <div className="font-bold text-xl text-white mb-1">
            {selectedUser.fullName}
          </div>
          <div className="text-primary/80 text-xs mb-2">
            @{selectedUser.username || "username"}
          </div>
          <div className="text-gray-400 text-sm italic mb-2">
            {selectedUser.about || "Hey there! I am using ChatApp."}
          </div>
          <div className="text-gray-500 text-xs">
            <span className="font-semibold">Phone:</span>{" "}
            {selectedUser.phone || "Not set"}
          </div>
          <div className="text-gray-500 text-xs">
            <span className="font-semibold">Email:</span>{" "}
            {selectedUser.email || "Not set"}
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="px-4 py-2 border-b border-white/10 bg-base-200">
        <span className="uppercase text-xs text-primary font-semibold tracking-widest">
          Media, Links & Docs
        </span>
      </div>

      {/* Media Gallery */}
      <div className="p-4 flex-1 overflow-y-auto bg-base-200">
        {mediaMessages.length === 0 ? (
          <div className="text-gray-400 text-sm text-center mt-8">
            No media shared yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {mediaMessages.map((msg) => (
              <div key={msg._id} className="relative group">
                <img
                  src={msg.image}
                  alt="media"
                  className="w-full h-20 object-cover rounded border border-white/10 shadow group-hover:scale-105 transition-transform"
                />
                {/* Optionally add overlay or preview in the future */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section (future actions/info) */}
      <div className="p-4 border-t border-white/10 text-gray-400 text-xs bg-base-200">
        <div className="mb-1 font-semibold text-primary">Info</div>
        <div>
          Profile and media are visible here. More features coming soon…
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
