import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-base-100/50 backdrop-blur-sm">
      <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-primary/20">
        <MessageCircleIcon className="size-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-widest">
        System Ready
      </h3>
      <p className="text-base-content/60 max-w-md font-mono text-sm">
        {">"} Select a target from the sidebar to initialize communication protocol...
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
