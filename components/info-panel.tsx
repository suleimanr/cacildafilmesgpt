import { motion, AnimatePresence } from 'framer-motion'

interface InfoPanelProps {
  activeInfo: number | null
  content: { text: string; highlight: string }[]
}

export default function InfoPanel({ activeInfo, content }: InfoPanelProps) {
  return (
    <AnimatePresence>
      {activeInfo !== null && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
        >
          <div className="bg-gray-800 p-8 rounded-lg max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {content[activeInfo].text}
            </h2>
            <p className="text-xl text-gray-300">{content[activeInfo].highlight}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

