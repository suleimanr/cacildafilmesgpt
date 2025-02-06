import { config } from "./config"

export class ElevenLabsService {
  private ws: WebSocket | null = null
  private audioContext: AudioContext | null = null
  private onMessageCallback: ((message: any) => void) | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private isReconnecting = false
  private isWebSocketReady = false
  private audioQueue: string[] = []
  private connectionTimeout: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  async connect(onMessage: (message: any) => void): Promise<void> {
    this.onMessageCallback = onMessage

    console.log("Attempting to connect with config:", {
      apiKey: config.elevenlabs.apiKey ? "Set" : "Not set",
      agentId: config.elevenlabs.agentId,
      apiBaseUrl: config.elevenlabs.apiBaseUrl,
      wsBaseUrl: config.elevenlabs.wsBaseUrl,
    })

    if (!config.elevenlabs.agentId) {
      throw new Error("Agent ID is not set")
    }

    if (!config.elevenlabs.apiKey) {
      throw new Error("API Key is not set")
    }

    // Verify API Key
    try {
      await this.verifyApiKey()
    } catch (error) {
      console.error("Failed to verify API Key:", error)
      throw new Error("Invalid API Key")
    }

    console.log("Connecting to ElevenLabs WebSocket...")
    try {
      const signedUrl = await this.getSignedUrl(config.elevenlabs.agentId)
      console.log("Got signed URL, establishing WebSocket connection...")
      this.ws = new WebSocket(signedUrl)
      this.setupWebSocketHandlers()

      // Set a connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          console.error("WebSocket connection timed out")
          this.ws.close()
          this.attemptReconnect()
        }
      }, 10000) // 10 seconds timeout
    } catch (error) {
      console.error("Failed to get signed WebSocket URL:", error)
      throw error
    }
  }

  private async verifyApiKey(): Promise<void> {
    try {
      const response = await fetch(`${config.elevenlabs.apiBaseUrl}/user`, {
        headers: {
          "xi-api-key": config.elevenlabs.apiKey || "",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Key verification failed:", errorData)
        throw new Error(`Invalid API Key: ${errorData.detail || response.statusText}`)
      }
    } catch (error) {
      console.error("Error verifying API Key:", error)
      throw error
    }
  }

  private async getSignedUrl(agentId: string): Promise<string> {
    console.log("Getting signed URL for agent:", agentId)
    const response = await fetch(
      `${config.elevenlabs.apiBaseUrl}/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": config.elevenlabs.apiKey || "",
          Origin: window.location.origin,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to get signed URL: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Received signed URL")
    return data.signed_url
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log("WebSocket connected successfully")
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout)
        this.connectionTimeout = null
      }
      this.isWebSocketReady = true
      this.reconnectAttempts = 0
      this.isReconnecting = false
      this.processAudioQueue()
    }

    this.ws.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data)
      try {
        const data = JSON.parse(event.data)
        if (this.onMessageCallback) {
          this.onMessageCallback(data)
        }

        if (data.type === "ping") {
          this.sendPong(data.ping_event.event_id)
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      this.isWebSocketReady = false
    }

    this.ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason)
      this.isWebSocketReady = false
      if (!this.isReconnecting) {
        this.attemptReconnect()
      }
    }
  }

  private isValidAudioData(base64Audio: string): boolean {
    // Verifica se o tamanho dos dados é múltiplo de 4 (requisito para Base64)
    return base64Audio.length % 4 === 0
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.isReconnecting = true
      this.reconnectAttempts++
      console.log(`Tentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      setTimeout(
        () => {
          if (this.onMessageCallback) {
            this.connect(this.onMessageCallback).catch((error) => {
              console.error("Falha na tentativa de reconexão:", error)
              this.attemptReconnect()
            })
          }
        },
        5000 * Math.pow(2, this.reconnectAttempts - 1),
      ) // Backoff exponencial
    } else {
      console.error("Número máximo de tentativas de reconexão atingido. Por favor, tente novamente mais tarde.")
      this.isReconnecting = false
    }
  }

  sendAudioChunk(audioChunk: string) {
    if (!this.isValidAudioData(audioChunk)) {
      console.error("Chunk de áudio inválido. Ignorando...")
      return
    }

    if (this.isWebSocketReady && this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("Enviando chunk de áudio...")
      this.ws.send(
        JSON.stringify({
          user_audio_chunk: audioChunk,
        }),
      )
    } else {
      console.log("WebSocket não está pronto. Enfileirando chunk de áudio.")
      this.audioQueue.push(audioChunk)
    }
  }

  private processAudioQueue() {
    while (this.audioQueue.length > 0 && this.isWebSocketReady) {
      const chunk = this.audioQueue.shift()
      if (chunk) {
        this.sendAudioChunk(chunk)
      }
    }
  }

  private sendPong(eventId: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("Sending pong for event:", eventId)
      this.ws.send(
        JSON.stringify({
          type: "pong",
          event_id: eventId,
        }),
      )
    }
  }

  async playAudio(base64Audio: string) {
    if (!this.audioContext) {
      console.error("AudioContext não está disponível")
      return
    }

    if (!this.isValidAudioData(base64Audio)) {
      console.error("Dados de áudio inválidos recebidos")
      return
    }

    console.log("Reproduzindo áudio...")
    const audioData = atob(base64Audio)
    const arrayBuffer = new ArrayBuffer(audioData.length)
    const view = new Uint8Array(arrayBuffer)

    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i)
    }

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.audioContext.destination)
      source.start()
    } catch (error) {
      console.error("Erro ao decodificar ou reproduzir áudio:", error)
    }
  }

  disconnect() {
    if (this.ws) {
      console.log("Disconnecting WebSocket...")
      this.ws.close()
      this.ws = null
    }
    this.isWebSocketReady = false
  }

  isReady(): boolean {
    return this.isWebSocketReady
  }
}

export const elevenlabsService = new ElevenLabsService()

