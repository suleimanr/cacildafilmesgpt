"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import OpenAIAssistant from "@/components/OpenAIAssistant"
import ChatDisplay from "@/components/ChatDisplay"
import QuickAccessButtons from "@/components/QuickAccessButtons"
import ElevenLabsStreaming from "@/components/ElevenLabsStreaming"
import GalaxyAudioVisualizer from "@/components/GalaxyAudioVisualizer"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

interface Message {
  role: "user" | "assistant"
  content: string
  id: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isCallActive, setIsCallActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agentAudioData, setAgentAudioData] = useState<Uint8Array | null>(null)
  const [userAudioData, setUserAudioData] = useState<Uint8Array | null>(null)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [isChatCentered, setIsChatCentered] = useState(true)
  const [isThinking, setIsThinking] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const handleMessageSent = useCallback(
    async (message: string) => {
      const newUserMessage = { role: "user", content: message, id: uuidv4() }
      setMessages((prev) => [...prev, newUserMessage])
      setError(null)
      setIsThinking(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, newUserMessage] }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""

        while (true) {
          const { value, done } = await reader!.read()
          if (done) break
          const chunk = decoder.decode(value)
          assistantMessage += chunk
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage.role === "assistant") {
              return [...prev.slice(0, -1), { role: "assistant", content: assistantMessage, id: uuidv4() }]
            } else {
              return [...prev, { role: "assistant", content: assistantMessage, id: uuidv4() }]
            }
          })
        }
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "An error occurred. Please try again.", id: uuidv4() },
        ])
      } finally {
        setIsThinking(false)
      }
    },
    [messages],
  )

  const toggleCall = useCallback(() => {
    setIsCallActive((prev) => !prev)
  }, [])

  const handleQuickAccessClick = useCallback(
    (topic: string) => {
      handleMessageSent(`Fale-me sobre ${topic}`)
    },
    [handleMessageSent],
  )

  const handleAudioData = useCallback((audioData: Uint8Array) => {
    setAgentAudioData(audioData)
    setIsAgentSpeaking(true)
    const timer = setTimeout(() => setIsAgentSpeaking(false), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleError = useCallback((error: string) => {
    console.error("ElevenLabs error:", error)
    setError(error)
  }, [])

  const handleAgentSpeaking = useCallback((isSpeaking: boolean) => {
    setIsAgentSpeaking(isSpeaking)
  }, [])

  const updateUserAudioData = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      setUserAudioData(dataArray)
      setIsUserSpeaking(dataArray.some((value) => value > 0))
    }
    animationFrameRef.current = requestAnimationFrame(updateUserAudioData)
  }, [])

  const handleFirstInteraction = useCallback(() => {
    setIsChatCentered(false)
  }, [])

  useEffect(() => {
    if (isCallActive) {
      const initializeAudio = async () => {
        try {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
          analyserRef.current = audioContextRef.current.createAnalyser()
          analyserRef.current.fftSize = 256

          mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true })
          const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current)
          source.connect(analyserRef.current)

          updateUserAudioData()
        } catch (error) {
          console.error("Error initializing audio:", error)
        }
      }

      initializeAudio()
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      setUserAudioData(null)
      setIsUserSpeaking(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isCallActive, updateUserAudioData])

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="h-screen relative overflow-hidden flex flex-col pt-4">
        <div className="flex-grow relative pb-20">
          <ChatDisplay
            messages={messages}
            onUserInteraction={handleFirstInteraction}
            setMessages={setMessages}
            isThinking={isThinking}
          />
          {isCallActive && (
            <GalaxyAudioVisualizer
              agentAudioData={agentAudioData}
              userAudioData={userAudioData}
              isAgentSpeaking={isAgentSpeaking}
              isUserSpeaking={isUserSpeaking}
            />
          )}
        </div>
        <ElevenLabsStreaming
          isCallActive={isCallActive}
          onAudioData={handleAudioData}
          onError={handleError}
          onAgentSpeaking={handleAgentSpeaking}
        />
        <div
          className={`fixed transition-all duration-300 ease-in-out ${
            isChatCentered
              ? "inset-0 flex items-center justify-center"
              : "bottom-4 sm:bottom-6 left-2 sm:left-4 right-2 sm:right-4"
          } z-50`}
        >
          <div className={`w-full max-w-3xl mx-auto ${isChatCentered ? "px-4" : ""}`}>
            <div className="w-full max-w-3xl mx-auto">
              <OpenAIAssistant
                onMessageSent={handleMessageSent}
                onToggleCall={toggleCall}
                isCallActive={isCallActive}
                isCentered={isChatCentered}
                onFirstInteraction={handleFirstInteraction}
              />
              <div className={`mt-4 ${isChatCentered ? "text-center" : ""}`}>
                <QuickAccessButtons onButtonClick={handleQuickAccessClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

