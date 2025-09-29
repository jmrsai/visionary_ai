import { MessageCircle } from "lucide-react";
import { ChatbotForm } from "./chatbot-form";

export default function ChatbotPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Chatbot</h1>
          <p className="text-muted-foreground">
            Ask our AI assistant about eye health, exercises, and more.
          </p>
        </div>
      </div>
      <ChatbotForm />
    </div>
  );
}
