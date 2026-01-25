"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface ChatWidgetProps {
    isOpen: boolean
    onClose: () => void
}

// Simple knowledge base for the simulated AI
const knowledgeBase = [
    {
        keywords: ["install", "setup", "time", "long"],
        answer: "A standard R3Bin installation takes approximately 2-4 hours per unit. This includes physical placement, power connection, network configuration, and initial calibration."
    },
    {
        keywords: ["wifi", "connect", "internet", "offline", "network"],
        answer: "If a bin loses connectivity, it has a local storage buffer for up to 7 days of data. Once reconnected, it automatically syncs. The AI continues to work offline!"
    },
    {
        keywords: ["accuracy", "precise", "wrong", "mistake", "classification"],
        answer: "Our AI classification system achieves 94%+ accuracy across standard waste categories. It continuously improves through machine learning."
    },
    {
        keywords: ["api", "integrate", "software", "erp", "salesforce"],
        answer: "Yes, R3Bin offers comprehensive integration options including REST API, GraphQL, and pre-built connectors for SAP, Oracle, and Salesforce."
    },
    {
        keywords: ["clean", "maintain", "maintenance", "dirty"],
        answer: "Maintenance is minimal! We recommend quarterly sensor cleaning (we'll alert you) and annual camera lens cleaning. The solar panels are self-cleaning."
    },
    {
        keywords: ["price", "cost", "quote", "buy"],
        answer: "Pricing depends on the volume of units and your specific enterprise needs. Please contact our sales team at sales@fostride.com for a custom quote."
    },
    {
        keywords: ["hello", "hi", "hey", "start"],
        answer: "Hello! I'm the Fostride AI Assistant. How can I help you with your smart bins today?"
    }
]

export function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hi there! 👋 I'm your AI support assistant. Ask me anything about installation, connectivity, or maintenance.",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    // Focus input when opening
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen, isMinimized])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        // Simulate AI thinking and response
        setTimeout(() => {
            const response = generateResponse(userMsg.content)

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500 + Math.random() * 1000) // Random delay 1.5s - 2.5s for realism
    }

    const generateResponse = (input: string): string => {
        const lowerInput = input.toLowerCase()

        // Check knowledge base
        for (const entry of knowledgeBase) {
            if (entry.keywords.some(k => lowerInput.includes(k))) {
                return entry.answer
            }
        }

        // Default fallback
        return "I'm not sure about that specific detail yet. Would you like me to connect you with a human specialist? You can also try searching our Knowledge Base for more articles."
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!isOpen) return null

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center"
                >
                    <Bot className="h-8 w-8 text-primary-foreground" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </Button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] md:w-[400px] max-h-[600px] shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
            <Card className="border-primary/20 flex flex-col h-[500px] md:h-[600px]">
                {/* Header */}
                <CardHeader className="p-4 border-b bg-primary/5 flex flex-row items-center justify-between space-y-0 relative">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">Fostride AI Support</h3>
                            <p className="text-xs text-muted-foreground">Always online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMinimized(true)}>
                            <Minimize2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <div
                        ref={scrollRef}
                        className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <Avatar className="h-8 w-8 mt-1 border">
                                    {msg.role === "assistant" ? (
                                        <>
                                            <AvatarImage src="/bot-avatar.png" />
                                            <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <AvatarImage src="/user-avatar.png" />
                                            <AvatarFallback className="bg-secondary">ME</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>

                                <div
                                    className={cn(
                                        "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-secondary text-secondary-foreground rounded-tl-none"
                                    )}
                                >
                                    {msg.content}
                                    <div
                                        className={cn(
                                            "text-[10px] mt-1 opacity-70",
                                            msg.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                                        )}
                                    >
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3 max-w-[85%]">
                                <Avatar className="h-8 w-8 mt-1 border">
                                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                                </Avatar>
                                <div className="bg-secondary rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Input */}
                <CardFooter className="p-3 bg-muted/30 border-t">
                    <form
                        className="flex w-full items-center gap-2"
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    >
                        <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question..."
                            className="flex-1 bg-background border-muted-foreground/20 focus-visible:ring-primary/20"
                            autoComplete="off"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() || isTyping}
                            className={cn(
                                "transition-all duration-200",
                                inputValue.trim() ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
