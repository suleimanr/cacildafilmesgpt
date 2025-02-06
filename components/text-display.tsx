import { motion } from 'framer-motion'

interface TextDisplayProps {
  content: {
    text: string
    highlight?: string
  }
}

const TextDisplay: React.FC<TextDisplayProps> = ({ content }) => {
  const words = content.text.split(' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={`inline-block mx-1 text-4xl md:text-6xl font-bold ${
            word.toLowerCase() === content.highlight?.toLowerCase()
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600'
              : 'text-white'
          }`}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default TextDisplay

