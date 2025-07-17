"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search, ChevronLeft, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Message {
  id: string
  sender: string // User ID or name
  content: string
  timestamp: string // ISO string
  isMe: boolean // True if current user sent it
}

interface ChatContact {
  id: string
  name: string
  lastMessage: string
  lastMessageTime: string
  avatarUrl?: string
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<ChatContact | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulated Data
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: "chat1",
      name: "Alice Smith",
      lastMessage: "Hey, checking in on the design bounty.",
      lastMessageTime: "10:30 AM",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "chat2",
      name: "Bob Johnson (Org)",
      lastMessage: "Your submission for the content project is approved!",
      lastMessageTime: "Yesterday",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "chat3",
      name: "Charlie Brown",
      lastMessage: "Can we discuss the payment terms?",
      lastMessageTime: "Mon",
      avatarUrl: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "Alice Smith", content: "Hi there!", timestamp: "2023-10-26T10:00:00Z", isMe: false },
    { id: "m2", sender: "Me", content: "Hey Alice! How can I help?", timestamp: "2023-10-26T10:01:00Z", isMe: true },
    {
      id: "m3",
      sender: "Alice Smith",
      content: "Checking in on the design bounty.",
      timestamp: "2023-10-26T10:30:00Z",
      isMe: false,
    },
    {
      id: "m4",
      sender: "Me",
      content: "Got it. I'll send an update by end of day.",
      timestamp: "2023-10-26T10:31:00Z",
      isMe: true,
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedChat])

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const newMessage: Message = {
        id: `m${messages.length + 1}`,
        sender: "Me", // In a real app, this would be the current user's ID/name
        content: messageInput.trim(),
        timestamp: new Date().toISOString(),
        isMe: true,
      }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      setMessageInput("")
      // In a real app, you'd send this message to Firestore/backend
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Left Pane - Chat List */}
      <Card
        className={cn("w-full md:w-1/3 lg:w-1/4 border-r rounded-none md:rounded-l-xl", {
          "hidden md:flex flex-col": selectedChat, // Hide on mobile if a chat is selected
          "flex flex-col": !selectedChat, // Show on mobile if no chat is selected
        })}
      >
        <CardHeader className="border-b p-4">
          <CardTitle className="text-xl font-bold">Chats</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search chats" className="pl-9 pr-3 py-2 rounded-md text-sm w-full" />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent className="p-0">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No messages yet.</div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={cn(
                    "flex items-center p-4 space-x-3 cursor-pointer hover:bg-gray-100",
                    selectedChat?.id === contact.id && "bg-gray-100 border-l-4 border-indigo-600",
                  )}
                  onClick={() => setSelectedChat(contact)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatarUrl || "/placeholder.svg"} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{contact.lastMessageTime}</span>
                </div>
              ))
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Right Pane - Chat Window */}
      <Card
        className={cn("flex-1 flex flex-col rounded-none md:rounded-r-xl", {
          "hidden md:flex": !selectedChat, // Hide on mobile if no chat is selected
          flex: selectedChat, // Show on mobile if a chat is selected
        })}
      >
        {selectedChat ? (
          <>
            <CardHeader className="border-b p-4 flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedChat(null)}>
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back to chats</span>
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatarUrl || "/placeholder.svg"} alt={selectedChat.name} />
                  <AvatarFallback>{selectedChat.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-bold">{selectedChat.name}</CardTitle>
              </div>
              {/* Add call/video icons here if desired */}
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", {
                      "justify-end": msg.isMe,
                      "justify-start": !msg.isMe,
                    })}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] p-3 rounded-lg",
                        msg.isMe
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none",
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className="text-xs opacity-75 mt-1 block text-right">
                        {format(new Date(msg.timestamp), "p")}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll target */}
              </div>
            </ScrollArea>
            <div className="border-t p-4 flex items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage()
                }}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-16 w-16 mb-4" />
            <p className="text-lg">Select a chat to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  )
}
