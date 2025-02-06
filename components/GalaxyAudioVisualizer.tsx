import type React from "react"
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface GalaxyAudioVisualizerProps {
  agentAudioData: Uint8Array | null
  userAudioData: Uint8Array | null
  isAgentSpeaking: boolean
  isUserSpeaking: boolean
}

const GalaxyAudioVisualizer: React.FC<GalaxyAudioVisualizerProps> = ({
  agentAudioData,
  userAudioData,
  isAgentSpeaking,
  isUserSpeaking,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const drawGalaxy = (audioData: Uint8Array | null, isSpeaking: boolean, isAgent: boolean) => {
      if (!audioData) return

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4

      ctx.save()
      ctx.translate(centerX, centerY)

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius)
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2)
      ctx.fill()

      const time = performance.now() * 0.001
      const numPoints = 100
      ctx.beginPath()
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2
        const dataIndex = Math.floor((i / numPoints) * audioData.length)
        const normalizedData = isSpeaking ? Math.min(1, (audioData[dataIndex] / 255) * 2) : audioData[dataIndex] / 255
        const radius = normalizedData * maxRadius * (isAgent ? 1.2 : 1)

        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        const distortion = Math.sin(angle * 10 + time * 5) * (isAgent ? 30 : 20) * normalizedData

        if (i === 0) {
          ctx.moveTo(x + distortion, y + distortion)
        } else {
          ctx.lineTo(x + distortion, y + distortion)
        }

        ctx.strokeStyle = "rgb(255, 255, 255)" // Branco puro
      }
      ctx.closePath()
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawGalaxy(agentAudioData, isAgentSpeaking, true)
      drawGalaxy(userAudioData, isUserSpeaking, false)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [agentAudioData, userAudioData, isAgentSpeaking, isUserSpeaking])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}

export default GalaxyAudioVisualizer

