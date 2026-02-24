"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, User, Bot, ShoppingBag } from "lucide-react";
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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          // You can send conversation_id if Algolia supports it for thread persistence
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Adapt based on actual Algolia Agent response structure
      // Usually: { message: { text: "..." }, data: { hits: [...] } }
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message?.text || "I found some products for you!",
        products: data.data?.hits || [], // Assuming 'hits' contains products
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[400px] h-[600px] bg-background/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">AI Assistant</h3>
                  <p className="text-xs opacity-80">Powered by Algolia</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close chat"
                className="hover:bg-white/20 text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar"
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
                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  )}>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="space-y-4 max-w-[80%]">
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-secondary/50 text-secondary-foreground rounded-tl-none border border-white/10"
                    )}>
                      {m.content}
                    </div>

                    {/* Product Recommendations */}
                    {m.products && m.products.length > 0 && (
                      <div className="grid grid-cols-1 gap-3 w-full animate-in fade-in slide-in-from-bottom-2">
                        {m.products.map((p: any) => (
                          <Card key={p.objectID} className="p-2 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex gap-3">
                              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-white/10 p-1 flex-shrink-0">
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-xs font-bold truncate">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground">{p.brand}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs font-bold text-primary">${p.price}</span>
                                  <Link href={`/product/${p.objectID}`}>
                                    <Button size="sm" className="h-6 text-[10px] px-2">View</Button>
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
                  <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-none border border-white/10">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="h-1.5 w-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/10 bg-white/5"
            >
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a product..."
                  className="bg-background/50 border-white/10 focus-visible:ring-primary h-10"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading}
                  className="h-10 w-10 shrink-0"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          aria-label="Toggle chat"
          className="h-14 w-14 rounded-full shadow-2xl p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <span className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-primary"></span>
          </span>}
        </Button>
      </motion.div>
    </div>
  );
}
