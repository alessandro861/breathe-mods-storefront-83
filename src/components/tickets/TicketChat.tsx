
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export interface TicketMessage {
  id: number;
  content: string;
  sender: "user" | "admin";
  timestamp: string;
}

interface TicketChatProps {
  messages: TicketMessage[];
  onSendMessage: (message: string) => void;
  isTicketClosed?: boolean;
}

const TicketChat: React.FC<TicketChatProps> = ({
  messages,
  onSendMessage,
  isTicketClosed = false,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-[50vh] overflow-y-auto p-2 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-right text-xs mt-1 opacity-60">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!isTicketClosed && (
        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketChat;
