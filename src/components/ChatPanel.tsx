"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, User, Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: any[];
}

export default function ChatPanel() {
  const [input, setInput] = useState("");

  const suggestedQueries = [
    "A fast 5G smartphone with a great camera",
    "A budget phone with amazing battery life",
    "A powerful laptop for heavy 4K video editing",
    "Earphones with punchy bass to use while commuting"
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hi! I'm your AI Shopping Assistant. Looking for any specific electronics today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const submitMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message?.text || "I found some products for you!",
        products: data.data?.hits || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestClick = (query: string) => {
    setInput(query);
    submitMessage(query);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3 shrink-0 bg-gray-50/50">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">AI Assistant</h3>
          <p className="text-xs text-gray-500">Powered by NeuralSearch™</p>
        </div>
      </div>

      {/* Suggested Queries */}
      {messages.length === 1 && (
        <div className="px-5 pt-5 pb-2">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Try Semantic Search</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestClick(query)}
                className="text-left text-xs bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5 transition-colors duration-200 ease-in-out font-medium"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-5 space-y-6 custom-scrollbar bg-gray-50/30"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex gap-3",
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-white border border-gray-200 text-primary"
            )}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="space-y-3 w-full max-w-[85%]">
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              )}>
                {m.content}
              </div>

              {/* Product Recommendations */}
              {m.products && m.products.length > 0 && (
                <div className="grid grid-cols-1 gap-3 w-full animate-in fade-in slide-in-from-bottom-2">
                  {m.products.map((p: any) => (
                    <Card key={p.objectID} className="p-3 bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-2 flex-shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-grow min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{p.name}</p>
                            <p className="text-[11px] text-gray-500 mt-1 uppercase font-semibold">{p.brand}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-bold text-primary">${p.price}</span>
                            <Link href={`/product/${p.objectID}`}>
                              <Button size="sm" className="h-7 text-xs px-3">View</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-white border border-gray-200 text-primary shadow-sm flex items-center justify-center mt-1">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-primary/70" />
              <span>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-5 shrink-0 bg-white border-t border-gray-100"
      >
        <div className="flex gap-3 relative shadow-sm rounded-xl">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI assistant..."
            className="w-full bg-gray-50/50 border-gray-200 focus-visible:ring-primary focus-visible:bg-white h-12 pl-4 pr-12 rounded-xl text-[15px] transition-colors"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading}
            className="absolute right-1 top-1 h-10 w-10 shrink-0 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
