"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { chat } from "@/ai/flows/chatbot";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { VisionaryLogo } from "@/components/icons";
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id?: string; // Optional: To be used with Firestore document ID
  text: string;
  isUser: boolean;
  media?: string;
  timestamp?: Date;
};

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

export function ChatbotForm() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // In a full implementation, this useEffect would fetch chat history if a conversationId exists.
  useEffect(() => {
    if (conversationId) {
        // TODO: Fetch previous messages for this conversationId from Firestore
        // e.g., getMessages(`conversations/${conversationId}/messages`)
        console.log(`Continuing conversation with ID: ${conversationId}`);
    }
  }, [conversationId]);


  const handleSend = async () => {
    if (input.trim() === "") return;
    
    let currentConversationId = conversationId;
    if (!currentConversationId) {
        currentConversationId = uuidv4();
        setConversationId(currentConversationId);
        // This is where you would create a new conversation document in Firestore.
        console.log(`Starting new conversation with ID: ${currentConversationId}`);
    }

    const userMessage: Message = { text: input, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);

    // TODO: Save userMessage to Firestore
    // e.g., addMessage(`conversations/${currentConversationId}/messages`, userMessage)

    setInput("");
    setIsLoading(true);

    try {
      const result = await chat({ message: input });
      const aiMessage: Message = { text: result.response, isUser: false, media: result.media, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMessage]);

      // TODO: Save aiMessage to Firestore
      // e.g., addMessage(`conversations/${currentConversationId}/messages`, aiMessage)

    } catch (error) {
      console.error("Error with chatbot:", error);
      toast({
        title: "Error",
        description: "The chatbot is currently unavailable. Please try again later.",
        variant: "destructive",
      });
       const errorMessage: Message = { text: "Sorry, I'm having trouble connecting right now. Please try again later.", isUser: false };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
    
    // Play audio for the last message if it exists
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.media && audioRef.current) {
        audioRef.current.src = lastMessage.media;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <audio ref={audioRef} className="hidden" />
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageCircle className="h-8 w-8 text-muted-foreground"/>
                </div>
              <p className="text-muted-foreground">Ask a question to start the conversation.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.isUser ? "justify-end" : ""
                }`}
              >
                {!message.isUser && (
                  <Avatar className="h-9 w-9">
                     <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <VisionaryLogo className="h-5 w-5" />
                     </div>
                  </Avatar>
                )}
                <div
                  className={`max-w-md rounded-lg p-3 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {!message.isUser && message.media && (
                      <audio controls className="w-full mt-2 h-8">
                          <source src={message.media} type="audio/wav" />
                          Your browser does not support the audio element.
                      </audio>
                  )}
                </div>
                {message.isUser && (
                  <Avatar className="h-9 w-9">
                    {userAvatar && (
                        <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} />
                    )}
                    <AvatarFallback>YOU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
           {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                   <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <VisionaryLogo className="h-5 w-5" />
                    </div>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-muted flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || input.trim() === ""}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
