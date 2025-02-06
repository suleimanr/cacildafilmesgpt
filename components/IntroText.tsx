import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const IntroText: React.FC = () => {
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true)
    }, 2000)

    const hideTimer = setTimeout(() => {
      setShowText(false)
    }, 12000)

    return () => {
      clearTimeout(timer)
      clearTimeout(hideTimer)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0 },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <AnimatePresence>
      {showText && (
        <motion.div
          className="fixed top-28 left-0 right-0 z-50 bg-black bg-opacity-80 p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="container mx-auto">
            <motion.p className="text-xl text-white max-w-3xl ml-8" variants={textVariants}>
              Pergunte sobre nosso portfólio, trabalhos, serviços, contato, e o que mais você quiser saber sobre a Punch
              Conteúdo.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default IntroText

