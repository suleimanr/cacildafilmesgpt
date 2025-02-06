import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Conversation } from "@11labs/client"
import { config } from "@/lib/config"
import AgentInfo from "./AgentInfo"

interface ChatInterfaceProps {
  isActive: boolean
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isActive }) => {
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [status, setStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")
  const [isSpeaking, setIsSpeaking] = useState(false)

  const startConversation = useCallback(async () => {
    try {
      setStatus("connecting")
      await navigator.mediaDevices.getUserMedia({ audio: true })

      if (!config.elevenlabs.agentId) {
        throw new Error("Agent ID is not set. Please check your environment variables.")
      }

      const response = await fetch(`/api/generate-signed-url?agentId=${config.elevenlabs.agentId}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const { signedUrl } = await response.json()
      const newConversation = await Conversation.startSession({ signedUrl })

      setConversation(newConversation)
      setStatus("connected")

      newConversation.onMessage = (message) => {
        if (message.type === "transcript" && message.is_final) {
          setMessages((prev) => [...prev, { type: "user", text: message.text }])
        } else if (message.type === "response") {
          setMessages((prev) => [...prev, { type: "ai", text: message.text }])
        }
      }

      newConversation.onAgentSpeaking = (isSpeaking) => {
        setIsSpeaking(isSpeaking)
      }

      newConversation.onError = (error) => {
        setError(`Ocorreu um erro. Por favor, tente novamente.`)
        setStatus("disconnected")
      }

      newConversation.onDisconnect = () => {
        setStatus("disconnected")
        setConversation(null)
      }
    } catch (error) {
      setError(`Não foi possível iniciar a conversa. Por favor, tente novamente.`)
      setStatus("disconnected")
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef])

  useEffect(() => {
    if (isActive) {
      startConversation()
    } else if (conversation) {
      conversation.endSession()
    }

    return () => {
      if (conversation) {
        conversation.endSession()
      }
    }
  }, [isActive, conversation, startConversation])

  return (
    <motion.div
      className="fixed bottom-16 right-4 w-80 bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
      initial={{ height: 0 }}
      animate={{ height: isActive ? "auto" : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="mb-4 h-60 overflow-y-auto bg-gray-900 rounded-lg p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.type === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700"
              } max-w-[80%] ${message.type === "user" ? "ml-auto" : "mr-auto"}`}
            >
              <p className="text-white text-sm">{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <button
          className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            status === "connected"
              ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
          }`}
          onClick={status === "connected" ? () => conversation?.endSession() : startConversation}
          disabled={status === "connecting"}
        >
          {status === "connected" ? "Encerrar Conversa" : "Iniciar Conversa"}
        </button>
        {error && (
          <p className="mt-3 text-red-400 text-xs text-center bg-red-900 bg-opacity-50 p-2 rounded-lg">{error}</p>
        )}
        <AgentInfo />
      </div>
    </motion.div>
  )
}

export default ChatInterface

