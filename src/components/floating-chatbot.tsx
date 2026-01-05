
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, MessageCircle, Mic, X, Paperclip, Image as ImageIcon } from "lucide-react";
import { chat, type ChartData } from "@/ai/flows/chatbot";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { VisionaryLogo } from "@/components/icons";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Markdown from 'react-markdown';
import Image from 'next/image';


type Message = {
  id?: string;
  text: string;
  isUser: boolean;
  media?: string;
  chartData?: ChartData;
  imageDataUri?: string;
  timestamp?: Date;
};

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const ChatChart = ({ chartData }: { chartData: ChartData }) => {
    const data = chartData.dataPoints.map(p => ({ date: p.x, score: p.y }));
    const yDomain: [number, number] = [
        Math.min(...data.map(d => d.score)) - 5,
        Math.max(...data.map(d => d.score)) + 5,
    ];

    return (
        <Card className="max-w-md w-full bg-background/50">
            <CardHeader>
                <CardTitle>Vision Score History</CardTitle>
                <CardDescription>Your progress over time.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={data} margin={{ left: -20, right: 20, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={yDomain}
                            fontSize={12}
                        />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Line
                            dataKey="score"
                            type="monotone"
                            stroke="var(--color-score)"
                            strokeWidth={2}
                            dot={true}
                        />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFileUri, setSelectedFileUri] = useState<string | null>(null);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastPlayedMessageId, setLastPlayedMessageId] = useState<string | null>(null);

  const handleSend = async () => {
    if (input.trim() === "" && !selectedFileUri) return;

    const userMessage: Message = { 
        id: uuidv4(), 
        text: input, 
        isUser: true, 
        imageDataUri: selectedFileUri || undefined,
        timestamp: new Date() 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    setInput("");
    setSelectedFileUri(null);
    setIsLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(msg => ({
          role: msg.isUser ? 'user' as const : 'model' as const,
          content: [{ text: msg.text }]
      }));
        
      const result = await chat({ message: input, imageDataUri: selectedFileUri || undefined, history });
      const aiMessage: Message = { 
          id: uuidv4(),
          text: result.response, 
          media: result.media,
          chartData: result.chartData,
          isUser: false, 
          timestamp: new Date() 
      };
      setMessages((prev) => [...prev, aiMessage]);

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
  
  const handleListen = async () => {
    setIsListening(true);
    // TODO: Integrate Speech-to-Text (STT) service here.
    // 1. Start recording audio from the microphone.
    // 2. Stream the audio to the STT service.
    // 3. Update the `input` state with the transcribed text in real-time.
    // 4. When the user stops speaking, finalize the transcription.
    
    // For now, we'll simulate a voice input after a short delay.
    setTimeout(() => {
        setInput("Show me my vision score history");
        setIsListening(false);
    }, 2000);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFileUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser && lastMessage.media && audioRef.current && lastMessage.id !== lastPlayedMessageId) {
        audioRef.current.src = lastMessage.media;
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        setLastPlayedMessageId(lastMessage.id || null);
    }
  }, [messages, lastPlayedMessageId]);

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">
      <SheetHeader className="p-4 border-b">
        <SheetTitle>AI Assistant</SheetTitle>
        <SheetDescription>Ask our AI assistant about eye health, exercises, or your progress.</SheetDescription>
      </SheetHeader>
      <audio ref={audioRef} className="hidden" />
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center space-y-4 pt-10 text-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageCircle className="h-8 w-8 text-muted-foreground"/>
                </div>
              <p className="text-muted-foreground">Ask things like "What's wrong with my eye?" and upload a photo.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id || index}
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
                  className={`flex flex-col space-y-2 max-w-xs rounded-lg p-3 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.imageDataUri && (
                     <Image src={message.imageDataUri} alt="Uploaded content" width={200} height={150} className="rounded-md" />
                  )}
                  {message.text && (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                        <Markdown>{message.text}</Markdown>
                    </div>
                  )}
                  {message.chartData && (
                    <ChatChart chartData={message.chartData} />
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
                <div className="max-w-xs rounded-lg p-3 bg-muted flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        {selectedFileUri && (
            <div className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-muted">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">Image ready to upload</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setSelectedFileUri(null)}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isListening}>
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach File</span>
            </Button>
           <Button type="button" variant="ghost" size="icon" onClick={handleListen} disabled={isLoading || isListening}>
            {isListening ? (
                 <Loader2 className="h-5 w-5 animate-spin text-primary"/>
            ) : (
                 <Mic className="h-5 w-5" />
            )}
            <span className="sr-only">Use Microphone</span>
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            className="flex-1"
            disabled={isLoading || isListening}
          />
          <Button type="submit" disabled={isLoading || isListening || (input.trim() === "" && !selectedFileUri)}>
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

export function FloatingChatbot() {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();
    
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
                >
                    <MessageCircle className="h-8 w-8" />
                    <span className="sr-only">Open Chat</span>
                </Button>
            </SheetTrigger>
            <SheetContent 
                side={isMobile ? "bottom" : "right"} 
                className={`p-0 ${isMobile ? 'h-[80%]' : 'w-[400px] sm:max-w-md'} bg-transparent border-none shadow-none`}
            >
                <ChatInterface />
            </SheetContent>
        </Sheet>
    )
}
