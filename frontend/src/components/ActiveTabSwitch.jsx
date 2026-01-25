import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab flex-1 font-mono transition-all duration-300 rounded-none ${
          activeTab === "chats"
            ? "bg-primary text-black font-bold border-b-2 border-primary"
            : "text-base-content/60 hover:text-base-content"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab flex-1 font-mono transition-all duration-300 rounded-none ${
          activeTab === "contacts"
            ? "bg-primary text-black font-bold border-b-2 border-primary"
            : "text-base-content/60 hover:text-base-content"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
