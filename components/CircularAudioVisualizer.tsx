import type React from "react"
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface CircularAudioVisualizerProps {
  agentAudioData: Uint8Array | null
  userAudioData: Uint8Array | null
  isAgentSpeaking: boolean
  isUserSpeaking: boolean
}

const CircularAudioVisualizer: React.FC<CircularAudioVisualizerProps> = ({
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

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    const drawWaveform = (data: Uint8Array | null, isSpeaking: boolean, startAngle: number, endAngle: number) => {
      if (!data) return

      const angleStep = (endAngle - startAngle) / data.length
      const gradientColors = isSpeaking
        ? ["#FF6B6B", "#FCA5A5", "#FCD34D", "#4ADE80", "#60A5FA"]
        : ["#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB"]

      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius)
      gradientColors.forEach((color, index) => {
        gradient.addColorStop(index / (gradientColors.length - 1), color)
      })

      ctx.strokeStyle = gradient
      ctx.lineWidth = 4
      ctx.lineCap = "round"

      ctx.beginPath()
      for (let i = 0; i < data.length; i++) {
        const amplitude = (data[i] / 255) * (radius * 0.5) + radius * 0.5
        const angle = startAngle + i * angleStep
        const x = centerX + amplitude * Math.cos(angle)
        const y = centerY + amplitude * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fill()

      // Draw agent waveform
      drawWaveform(agentAudioData, isAgentSpeaking, -Math.PI / 2, Math.PI / 2)

      // Draw user waveform
      drawWaveform(userAudioData, isUserSpeaking, Math.PI / 2, Math.PI * 1.5)

      requestAnimationFrame(animate)
    }

    animate()
  }, [agentAudioData, userAudioData, isAgentSpeaking, isUserSpeaking])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="w-full h-full flex items-center justify-center"
    >
      <canvas ref={canvasRef} width={1000} height={1000} className="max-w-full max-h-full" />
    </motion.div>
  )
}

export default CircularAudioVisualizer

